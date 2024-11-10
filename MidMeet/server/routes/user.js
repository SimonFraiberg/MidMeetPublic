const userController = require("../controllers/user");
const quizController = require("../controllers/quiz");

const authorization = require("../controllers/authorization");
const express = require("express");
var router = express.Router();

//create user
router
  .route("/")
  .post(userController.createUser)
  .get(authorization.verifyToken, userController.getUserByUsername);

//set 2fa
router.route("/2FA").post(authorization.verifyToken, userController.set2FA);

router
  .route("/changePassword")
  .post(authorization.verifyToken, userController.changePassword);

router
  .route("/updateProfilePic")
  .post(authorization.verifyToken, userController.updateProfilePic);

router
  .route("/updateAddress")
  .post(authorization.verifyToken, userController.updateAddress);

//get 2fa status
router.route("/2FA").get(authorization.verifyToken, userController.get2FA);

//set user food preferences
router
  .route("/food")
  .post(authorization.verifyToken, quizController.setFoodPreferences);

//set user food restrictions
router
  .route("/foodRestrictions")
  .post(authorization.verifyToken, quizController.setFoodRestriction);

//set user activity prefrences
router
  .route("/activity")
  .post(authorization.verifyToken, quizController.setActivitiesPreferences);

//set all prefrences
router
  .route("/preference")
  .post(authorization.verifyToken, quizController.setPreferences);

//get all prefrences
router
  .route("/preference")
  .get(authorization.verifyToken, quizController.getPreferences);

module.exports = router;
