const User = require("../models/user");
const bcrypt = require("bcrypt");

const { authenticator } = require("otplib");
const qrcode = require("qrcode");
const createUser = async (
  email,
  password,
  location,
  firstName,
  lastName,
  profilePic
) => {
  try {
    const userCheck = await User.findOne({ email: email });

    if (!userCheck) {
      const user = new User({
        email,
        password,
        location,
        firstName,
        lastName,
        profilePic,
      });

      return await user.save();
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error occurred while finding user:", error);
  }
};

const getUserByUsername = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return -1;
  } else {
    return user;
  }
};

const updateAddress = async (email, address) => {
  const user = await User.findOne({ email: email });
  user.location = address;

  await user.save();
  if (!user) {
    return false;
  } else {
    return true;
  }
};

const updateProfilePic = async (email, picture) => {
  const user = await User.findOne({ email: email });
  user.profilePic = picture;
  await user.save();
  if (!user) {
    return false;
  } else {
    return true;
  }
};

const setUser2FA = async (email) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    // If user doesn't exist, return -1
    if (!user) {
      return false;
    } else {
      const secret = authenticator.generateSecret();
      const uri = authenticator.keyuri("MidMeet", "MidMeet", secret);
      user.TwoFA.secret = secret;
      // Save the updated user
      // Return the updated user
      // Generate the QR code data
      const qrData = await qrcode.toDataURL(uri);

      user.TwoFA.qr = qrData;

      await user.save();
      return user.TwoFA.qr;
    }
  } catch (error) {
    // Handle any errors
    console.error("Error setting TwoFA:", error);
    return false;
  }
};

const getUser2FA = async (email) => {
  try {
    // Find the user by email

    const user = await User.findOne({ email: email });

    // If user doesn't exist, return -1
    if (!user) {
      return false;
    } else {
      if (user.TwoFA.enabled) {
        return user.TwoFA.enabled;
      } else return false;
    }
  } catch (error) {
    // Handle any errors
    console.error("Error getting TwoFA:", error);
    return false;
  }
};

const changePassword = async (email, oldPassword, newPassword) => {
  try {
    const user = await User.findOne({ email: email });

    if (await bcrypt.compare(oldPassword, user.password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  createUser,
  getUserByUsername,
  setUser2FA,
  getUser2FA,
  changePassword,
  updateProfilePic,
  updateAddress,
};
