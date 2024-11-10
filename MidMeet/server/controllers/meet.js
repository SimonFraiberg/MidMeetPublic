const meetService = require("../services/meet");
const jwt = require("jsonwebtoken");
const tokenService = require("../services/token");

const createMeet = async (req, res) => {
  const meet = await meetService.createMeet(
    req.body.email,
    req.body.name,
    req.body.date,
    req.body.type,
    req.body.creatorLocation
  );
  if (meet === -1) {
    return res
      .status(409)
      .json({ errors: ["meet already exists pick another name"] });
  } else {
    res.status(200).json(meet);
  }
};

const vote = async (req, res) => {
  const recommendations = await meetService.vote(
    req.body.email,
    req.params.meetId,
    req.body.choice
  );
  if (recommendations === -1) {
    return res.status(409).json({ errors: ["error in voting"] });
  } else {
    res.status(200).json(recommendations);
  }
};

const getMeetById = async (req, res) => {
  const meet = await meetService.getMeetById(req.body.email, req.params.meetId);
  if (meet == -1) {
    res.status(400).json({ errors: ["not allowed"] });
  } else {
    if (meet == -2) {
      res.status(400).json({ errors: ["meet deleted"] });
    } else {
      res.status(200).json(meet);
    }
  }
};

const getBasicMeetInfo = async (req, res) => {
  const basicMeetInfo = await meetService.getBasicMeetInfo(req.params.meetId);
  if (basicMeetInfo == -1) {
    res.status(400).json({ errors: ["not allowed"] });
  } else {
    res.status(200).json(basicMeetInfo);
  }
};

const addMeetById = async (req, res) => {
  const meet = await meetService.addMeetById(req.body.email, req.params.meetId);
  if (meet == -1) {
    res.status(400).json({ errors: ["meet does not exists"] });
  } else {
    res.status(200).send(meet);
  }
};

const sendMeetInvite = async (req, res) => {
  console.log(req.body.sendEmail);
  try {
    const token = await meetService.sendMeetInvite(
      req.body.email,
      req.body.sendEmail,
      req.params.meetId
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error sending meet invite:", error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

const checkLoggedIn = (req) => {
  const cookieCheck = req.headers.cookie;

  if (!cookieCheck) {
    return false;
  }

  const cookie = cookieCheck.split("=")[1];

  jwt.verify(cookie, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return false;
    }
    const user = tokenService.findUser(decoded.email);
    if (!user) {
      return false;
    }
    const data = { email: decoded.email };

    const accessToken = jwt.sign(data, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });
    req.accessToken = accessToken;
  });
};
const acceptMeetInvitePage = async (req, res) => {
  try {
    console.log("heres");
    checkLoggedIn(req);
    const returnUrl = `api/Meets/${req.params.meetId}/accept`;

    // Check if user is logged in
    if (req.accessToken) {
      console.log(" logged");
      // If user is logged in, proceed to accept invitation
      res.redirect(`http://localhost:12345/HomePage?returnUrl=${returnUrl}`);
    } else {
      console.log("not logged");

      // If user is not logged in, redirect to login page with return URL
      res.redirect(`http://localhost:12345/Login?returnUrl=${returnUrl}`);
    }
  } catch (error) {
    console.error("Error accepting meet invite:", error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

const acceptMeetInvite = async (req, res) => {
  try {
    const meetId = req.params.meetId;
    const email = req.body.email;
    const location = req.body.location;
    // Here, you can directly assume the user is authenticated

    const meet = await meetService.acceptMeetInvite(email, meetId, location);
    console.log(meet);
    if (meet === -1) {
      res.status(404).json({ errors: ["Meet not found"] });
    } else if (meet === -2) {
      res.status(400).json({ errors: ["already a participant"] });
    } else {
      res.status(200).json(meet);
    }
  } catch (error) {
    console.error("Error accepting meet invite:", error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

const createRecommendation = async (req, res) => {
  const meet = await meetService.createRecommendation(req.params.meetId);

  if (meet === -1) {
    res.status(404).json({ errors: ["Meet not found"] });
  } else {
    res.status(200).json(meet.recommendations);
  }
};

const getMeets = async (req, res) => {
  const allMeets = await meetService.getMeets(req.body.email);

  if (allMeets === -1) {
    res.status(404).json({ errors: ["Meets not found"] });
  } else {
    res.status(200).json(allMeets);
  }
};
module.exports = {
  createMeet,
  getMeetById,
  addMeetById,
  sendMeetInvite,
  acceptMeetInvite,
  acceptMeetInvitePage,
  createRecommendation,
  getBasicMeetInfo,
  vote,
  getMeets,
};
