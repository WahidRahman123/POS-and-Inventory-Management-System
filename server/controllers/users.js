const User = require("../models/user");
const jwt = require('jsonwebtoken');

module.exports.index = async (req, res) => {
  try {
    const user = await User.find({});

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createUser = async (req, res) => {
  const { name, password, role } = req.body;

  try {
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

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    let user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    //JWT
    const payload = { user: { id: user._id, role: user.role } };

    // Token Creation and sending
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) throw err;

        res.json({
          user: {
            _id: user._id,
            name: user.name,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
