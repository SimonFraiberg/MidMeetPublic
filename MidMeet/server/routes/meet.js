const meetController = require("../controllers/meet");
const authorization = require("../controllers/authorization");
const express = require("express");
var router = express.Router();

//create new meet with this user as creator
router
  .route("/")
  .post(authorization.verifyToken, meetController.createMeet)
  .get(authorization.verifyToken, meetController.getMeets);

//get or post  meet by id

router
  .route("/:meetId")
  .get(authorization.verifyToken, meetController.getMeetById)
  .post(authorization.verifyToken, meetController.addMeetById);

//create recommendation
router
  .route("/:meetId/createRecommendation")
  .post(authorization.verifyToken, meetController.createRecommendation);

// send meet invitation
router
  .route("/:meetId/send")
  .post(authorization.verifyToken, meetController.sendMeetInvite);

// send meet invitation
router
  .route("/:meetId/vote")
  .post(authorization.verifyToken, meetController.vote);

// accept meet invitation
router
  .route("/:meetId/accept")
  .get(meetController.acceptMeetInvitePage)
  .post(authorization.verifyToken, meetController.acceptMeetInvite);

router
  .route("/basic/:meetId")
  .get(authorization.verifyToken, meetController.getBasicMeetInfo);

module.exports = router;
