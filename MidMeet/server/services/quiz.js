const User = require("../models/user");

const setFoodPreferences = async (email, foodList) => {
  try {
    // Find the user by email

    const user = await User.findOne({ email: email });
    // If user doesn't exist, return -1
    if (!user) {
      return false;
    } else {
      user.preferences.food = foodList;
      await user.save();
      return true;
    }
  } catch (error) {
    // Handle any errors
    console.error("Error setting food preferences:", error);
    return false;
  }
};

const setFoodRestriction = async (email, foodList) => {
  try {
    // Find the user by email

    const user = await User.findOne({ email: email });
    // If user doesn't exist, return -1
    if (!user) {
      return false;
    } else {
      user.preferences.foodRestrictions = foodList;
      await user.save();
      return true;
    }
  } catch (error) {
    // Handle any errors
    console.error("Error setting food restriction:", error);
    return false;
  }
};

const setActivitiesPreferences = async (email, activities) => {
  try {
    // Find the user by email

    const user = await User.findOne({ email: email });
    // If user doesn't exist, return -1
    if (!user) {
      return false;
    } else {
      user.preferences.activities = activities;
      await user.save();
      return true;
    }
  } catch (error) {
    // Handle any errors
    console.error("Error setting food restriction:", error);
    return false;
  }
};

const setPreferences = async (email, food, foodRestrictions, activities) => {
  try {
    // Find the user by email

    const user = await User.findOne({ email: email });

    // If user doesn't exist, return -1
    if (!user) {
      return false;
    } else {
      if (food) user.preferences.food = food;
      if (foodRestrictions)
        user.preferences.foodRestrictions = foodRestrictions;
      if (activities) user.preferences.activities = activities;

      await user.save();
      return true;
    }
  } catch (error) {
    // Handle any errors
    console.error("Error setting food restriction:", error);
    return false;
  }
};

const getPreferences = async (email) => {
  try {
    // Find the user by email

    const user = await User.findOne({ email: email });
    // If user doesn't exist, return -1
    if (!user) {
      return null;
    } else {
      return user.preferences;
    }
  } catch (error) {
    // Handle any errors
    console.error("Error getting preferences", error);
    return null;
  }
};
module.exports = {
  setFoodPreferences,
  setFoodRestriction,
  setActivitiesPreferences,
  setPreferences,
  getPreferences,
};
