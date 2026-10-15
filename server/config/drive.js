const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../token.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      'credentials.json not found. Download OAuth 2.0 Client credentials from Google Cloud Console and place it as backend/credentials.json'
    );
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

function createOAuth2Client() {
  const credentials = loadCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const redirectUri = redirect_uris?.[0] || process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/backup/oauth2callback';

  return new google.auth.OAuth2(client_id, client_secret, redirectUri);
}

function getAuthUrl() {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // force refresh_token
  });
}

async function getAuthenticatedClient() {
  const oauth2Client = createOAuth2Client();

  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error(
      'Google Drive not authorized yet. Visit /api/backup/auth-url to authorize first.'
    );
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oauth2Client.setCredentials(token);

  // Auto-refresh and save new tokens if needed
  oauth2Client.on('tokens', (tokens) => {
    const current = fs.existsSync(TOKEN_PATH)
      ? JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'))
      : {};
    const updated = { ...current, ...tokens };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2));
  });

  return oauth2Client;
}

async function getDrive() {
  const auth = await getAuthenticatedClient();
  return google.drive({ version: 'v3', auth });
}

async function saveTokenFromCode(code) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  return tokens;
}

module.exports = {
  getDrive,
  getAuthUrl,
  saveTokenFromCode,
};