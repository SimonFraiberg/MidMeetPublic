const tokenController = require("../controllers/token");
const express = require("express");
const authorization = require("../controllers/authorization");

const router = express.Router();

router.route("/").post(tokenController.login);

router.route("/2FA").post(tokenController.login2FA);

router
  .route("/verify2FA")
  .post(authorization.verifyToken, tokenController.verify2FA);

router
  .route("/disable2FA")
  .post(authorization.verifyToken, tokenController.disable2FAstep);

router.route("/refresh").get(tokenController.refresh);

router.route("/logout").post(tokenController.logout);

module.exports = router;
