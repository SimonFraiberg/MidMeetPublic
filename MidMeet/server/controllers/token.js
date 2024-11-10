const tokenService = require("../services/token");
const jwt = require("jsonwebtoken");

const verify2FA = async (req, res) => {
  isVerified = await tokenService.verify2FAstep(req.body.email, req.body.code);
  if (isVerified) {
    res.status(200).json({ status: "true" });
  } else {
    res.status(401).json({ status: "false" });
  }
};

const disable2FAstep = async (req, res) => {
  isVerified = await tokenService.disable2FAstep(req.body.email, req.body.code);
  if (isVerified) {
    res.status(200).json({ status: "true" });
  } else {
    res.status(401).json({ status: "false" });
  }
};
const login = async (req, res) => {
  const user = await tokenService.login(req.body.email, req.body.password);
  if (user) {
    if (user.TwoFA.enabled === true) {
      res.status(401).json({ error: "2fa" });
      return;
    }
    // Generate the token.
    const data = { email: req.body.email };

    const accessToken = jwt.sign(data, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });
    // Return the token to the browser
    const refreshToken = jwt.sign(data, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    const returnUrl = req.query.returnUrl;
    if (returnUrl) {
      res.redirect(returnUrl); // Redirect user to returnUrl
    } else {
      res.status(200).json({ accessToken: accessToken }); // Default behavior
    }
  } else res.status(401).json({ error: "wrong email or password" });
};

const login2FA = async (req, res) => {
  const user = await tokenService.login2FA(
    req.body.email,
    req.body.password,
    req.body.twoFactorCode
  );
  if (user) {
    // Generate the token.
    const data = { email: req.body.email };

    const accessToken = jwt.sign(data, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });
    // Return the token to the browser
    const refreshToken = jwt.sign(data, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    const returnUrl = req.query.returnUrl;
    if (returnUrl) {
      res.redirect(returnUrl); // Redirect user to returnUrl
    } else {
      res.status(200).json({ accessToken: accessToken }); // Default behavior
    }
  } else res.status(401).json({ error: "Wrong Google Token" });
};

const refresh = (req, res) => {
  const cookieCheck = req.headers.cookie;

  if (!cookieCheck) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const cookie = cookieCheck.split("=")[1];

  jwt.verify(cookie, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const user = tokenService.findUser(decoded.email);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = { email: decoded.email };

    const accessToken = jwt.sign(data, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ accessToken: accessToken });
  });
};

const logout = (req, res) => {
  const cookie = req.headers.cookie.split("=")[1];
  if (!cookie) return res.sendStatus(204);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).send("Logged out successfully.");
};

module.exports = {
  login,
  logout,
  refresh,
  login2FA,
  verify2FA,
  disable2FAstep,
};
