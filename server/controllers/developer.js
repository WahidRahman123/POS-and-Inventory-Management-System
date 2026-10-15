const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const os = require('os');
const { BSON } = require('bson');
const archiver = require('archiver');
const { createReadStream, createWriteStream, promises: fsPromises } = require('fs');
const unzipper = require('unzipper');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { getDrive, getAuthUrl, saveTokenFromCode } = require('../config/drive');

const TEMP_ROOT = path.join(os.tmpdir(), 'mern-backup');

// Ensure temp root exists
async function ensureTempDir() {
  await fsPromises.mkdir(TEMP_ROOT, { recursive: true });
}

// ---------- OAUTH HELPERS ----------
const getGoogleAuthUrl = async (req, res) => {
  try {
    const url = getAuthUrl();
    res.json({ success: true, authUrl: url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const googleOAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Authorization code missing');
    }
    await saveTokenFromCode(code);
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1e293b; color: #e2e8f0;">
          <h2 style="color: #4ade80;">✅ Google Drive Authorized Successfully!</h2>
          <p>You can close this window and go back to the app.</p>
          <p style="color: #94a3b8; font-size: 14px;">token.json has been saved. Backup will now work.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`Authorization failed: ${error.message}`);
  }
};


// Register
const register = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password) return res.status(400).json({ message: "Invalid Credentials!" });

    const admin = await User.findOne({ name });

    if (admin) return res.status(400).json({ message: "User Already Existed!" });

    const user = new User({
      name,
      password,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ---------- BACKUP TO DRIVE ----------
const backupToDrive = async (req, res) => {
  let tempDir = null;
  try {
    await ensureTempDir();
    const jobId = uuidv4();
    tempDir = path.join(TEMP_ROOT, jobId);
    await fsPromises.mkdir(tempDir, { recursive: true });

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const col of collections) {
      const collectionName = col.name;
      if (collectionName.startsWith('system.')) continue;

      const docs = await db.collection(collectionName).find({}).toArray();

      // Crucial: serialize each document individually and concatenate buffers
      const buffers = [];
      for (const doc of docs) {
        const serialized = BSON.serialize(doc);
        buffers.push(serialized);
      }
      const bsonBuffer = Buffer.concat(buffers);

      const bsonPath = path.join(tempDir, `${collectionName}.bson`);
      await fsPromises.writeFile(bsonPath, bsonBuffer);

      const metadata = {
        collectionName,
        type: 'collection',
        uuid: uuidv4(),
        options: {},
        indexes: [],
      };
      await fsPromises.writeFile(
        path.join(tempDir, `${collectionName}.metadata.json`),
        JSON.stringify(metadata, null, 2)
      );
    }

    // Create ZIP
    const zipPath = path.join(TEMP_ROOT, `${jobId}.zip`);
    await new Promise((resolve, reject) => {
      const output = createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(tempDir, false);
      archive.finalize();
    });

    // Upload to Google Drive (OAuth)
    const drive = await getDrive();

    const fileMetadata = {
      name: `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`,
      parents: process.env.GOOGLE_DRIVE_FOLDER_ID
        ? [process.env.GOOGLE_DRIVE_FOLDER_ID]
        : undefined,
    };
    const media = {
      mimeType: 'application/zip',
      body: createReadStream(zipPath),
    };

    const uploaded = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, name, createdTime',
    });

    // Cleanup
    await fsPromises.rm(tempDir, { recursive: true, force: true });
    await fsPromises.unlink(zipPath).catch(() => { });

    res.json({
      success: true,
      message: 'Backup uploaded to Google Drive successfully',
      file: uploaded.data,
    });
  } catch (error) {
    if (tempDir) await fsPromises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- SHARED RESTORE LOGIC ----------
async function performRestoreFromZip(zipPath) {
  const extractDir = path.join(TEMP_ROOT, `restore_${uuidv4()}`);
  await fsPromises.mkdir(extractDir, { recursive: true });

  await createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: extractDir }))
    .promise();

  const files = await fsPromises.readdir(extractDir);
  const db = mongoose.connection.db;

  for (const file of files) {
    if (!file.endsWith('.bson')) continue;

    const collectionName = file.replace('.bson', '');
    const bsonPath = path.join(extractDir, file);
    const buffer = await fsPromises.readFile(bsonPath);

    const documents = [];
    let offset = 0;
    while (offset < buffer.length) {
      try {
        const doc = BSON.deserialize(buffer, {
          index: offset,
          allowObjectSmallerThanBufferSize: true,
        });
        documents.push(doc);
        const size = buffer.readInt32LE(offset);
        offset += size;
      } catch (e) {
        break;
      }
    }

    await db.collection(collectionName).deleteMany({});
    if (documents.length > 0) {
      await db.collection(collectionName).insertMany(documents, { ordered: false });
    }
  }

  await fsPromises.rm(extractDir, { recursive: true, force: true });
}

// ---------- MANUAL UPLOAD RESTORE ----------
const restoreFromUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No ZIP file uploaded' });
    }

    const zipPath = req.file.path;
    await performRestoreFromZip(zipPath);
    await fsPromises.unlink(zipPath).catch(() => { });

    res.json({ success: true, message: 'Database restored successfully from uploaded ZIP' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- ONE-CLICK DRIVE RESTORE ----------
const restoreFromDrive = async (req, res) => {
  let zipPath = null;
  try {
    const drive = await getDrive();

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const q = folderId
      ? `'${folderId}' in parents and mimeType='application/zip' and trashed=false`
      : `mimeType='application/zip' and trashed=false`;

    const response = await drive.files.list({
      q,
      orderBy: 'createdTime desc',
      pageSize: 1,
      fields: 'files(id, name, createdTime)',
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: 'No backup found on Google Drive' });
    }

    const latest = files[0];
    zipPath = path.join(TEMP_ROOT, `drive_${uuidv4()}.zip`);

    const dest = createWriteStream(zipPath);
    const driveRes = await drive.files.get(
      { fileId: latest.id, alt: 'media' },
      { responseType: 'stream' }
    );

    await new Promise((resolve, reject) => {
      driveRes.data
        .on('end', resolve)
        .on('error', reject)
        .pipe(dest);
    });

    await performRestoreFromZip(zipPath);
    await fsPromises.unlink(zipPath).catch(() => { });

    res.json({
      success: true,
      message: `Database restored successfully from Drive backup: ${latest.name}`,
      restoredFrom: latest,
    });
  } catch (error) {
    if (zipPath) await fsPromises.unlink(zipPath).catch(() => { });
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  getUsers,
  backupToDrive,
  restoreFromUpload,
  restoreFromDrive,
  getGoogleAuthUrl,
  googleOAuthCallback,
};
