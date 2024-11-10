const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticator } = require("otplib");

const verify2FAstep = async (email, twoFactorCode) => {
  try {
    const user = await User.findOne({ email: email });
    if (verify2FA(twoFactorCode, user.TwoFA.secret)) {
      user.TwoFA.enabled = true;
      user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return null;
  }
};

const disable2FAstep = async (email, twoFactorCode) => {
  try {
    const user = await User.findOne({ email: email });
    if (verify2FA(twoFactorCode, user.TwoFA.secret)) {
      user.TwoFA.enabled = false;
      user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return null;
  }
};

const verify2FA = (twoFactorCode, secret) => {
  const verified = authenticator.check(twoFactorCode, secret);
  return verified;
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });

    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
  } catch (error) {
    return null;
  }
};

const login2FA = async (email, password, twoFactorCode) => {
  try {
    const user = await User.findOne({ email: email });

    if (await bcrypt.compare(password, user.password)) {
      if (verify2FA(twoFactorCode, user.TwoFA.secret)) {
        return user;
      } else {
        return null;
      }
    }
  } catch (error) {
    return null;
  }
};

const findUser = async (email) => {
  try {
    const user = await User.findOne({ email: email });
  } catch (error) {
    return null;
  }
};

module.exports = { disable2FAstep, verify2FAstep, login, findUser, login2FA };
