const quizService = require("../services/quiz");

const setFoodPreferences = async (req, res) => {
  if (await quizService.setFoodPreferences(req.body.email, req.body.food)) {
    res.status(204);
  } else {
    res.status(400).json({ errors: ["Failed adding food preferences"] });
  }
};

const setFoodRestriction = async (req, res) => {
  if (
    await quizService.setFoodRestriction(
      req.body.email,
      req.body.foodRestrictions
    )
  ) {
    res.status(204);
  } else {
    res.status(400).json({ errors: ["Failed adding food restrictions"] });
  }
};

const setActivitiesPreferences = async (req, res) => {
  if (
    await quizService.setActivitiesPreferences(
      req.body.email,
      req.body.activities
    )
  ) {
    res.status(204);
  } else {
    res.status(400).json({ errors: ["Failed adding activities"] });
  }
};

const setPreferences = async (req, res) => {
  if (
    await quizService.setPreferences(
      req.body.email,
      req.body.food,
      req.body.foodRestrictions,
      req.body.activities
    )
  ) {
    res.status(204);
  } else {
    res.status(400).json({ errors: ["Failed adding Preferences"] });
  }
};

const getPreferences = async (req, res) => {
  const preferences = await quizService.getPreferences(req.body.email);
  if (preferences) {
    res.status(200).json(preferences);
  } else {
    res.status(400).json({ errors: ["Failed adding Preferences"] });
  }
};
module.exports = {
  setFoodPreferences,
  setFoodRestriction,
  setActivitiesPreferences,
  setPreferences,
  getPreferences,
};
