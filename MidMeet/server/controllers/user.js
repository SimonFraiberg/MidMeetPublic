const userService = require("../services/user");

const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await userService.createUser(
    req.body.email,
    hashedPassword,
    req.body.location,
    req.body.firstName,
    req.body.lastName,
    req.body.profilePic
  );
  if (user === -1) {
    return res.status(409).json({ errors: ["email already exists"] });
  } else {
    res.status(200).json(user);
  }
};

const updateAddress = async (req, res) => {
  const address = await userService.updateAddress(
    req.body.email,
    req.body.address
  );
  if (address) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
};

const updateProfilePic = async (req, res) => {
  const profilePic = await userService.updateProfilePic(
    req.body.email,
    req.body.profilePic
  );
  if (profilePic) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
};

const getUserByUsername = async (req, res) => {
  const user = await userService.getUserByUsername(req.body.email);
  if (user == -1) {
    res.status(400).json({ errors: ["email does not exists"] });
  } else {
    res.status(200).send(user);
  }
};

const set2FA = async (req, res) => {
  const img = await userService.setUser2FA(req.body.email);
  if (img !== false) {
    res.status(200).json({ img: img });
  } else {
    res.status(400).json({ errors: ["Failed changing the 2FA"] });
  }
};

const get2FA = async (req, res) => {
  if ((await userService.getUser2FA(req.body.email)) === true) {
    res.status(200).send(true);
  } else {
    res.status(400).send(false);
  }
};

const changePassword = async (req, res) => {
  if (
    (await userService.changePassword(
      req.body.email,
      req.body.oldPassword,
      req.body.newPassword
    )) === true
  ) {
    res.status(200).send(true);
  } else {
    res.status(400).send(false);
  }
};
module.exports = {
  createUser,
  getUserByUsername,
  set2FA,
  get2FA,
  changePassword,
  updateProfilePic,
  updateAddress,
};
