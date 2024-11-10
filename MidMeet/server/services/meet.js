const Meet = require("../models/meet");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require("custom-env").env(process.env.NODE_ENV, "./config");
const axios = require("axios");

const createMeet = async (email, name, date, type, creatorLocation) => {
  try {
    const user = await User.findOne({ email: email });
    recommendations = [];
    participants = [];
    invitations = [];
    if (user) {
      const creator = email;

      const meet = new Meet({
        name,
        creator,
        date,
        type,
        recommendations,
        participants,
        invitations,
      });
      meet.participants.push({
        email: creator,
        location: creatorLocation,
      });
      const savedMeet = await meet.save();
      user.meets.push(savedMeet._id.toString());
      await user.save();
      return savedMeet;
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error occurred while finding user:", error);
  }
};

const addMeetById = async (email, id) => {
  const user = await User.findOne({ email: email });
  const meet = await Meet.findOne({ _id: id });

  if (!meet || !user) {
    return -1;
  }
  meet.participants.push(email);
  user.meets.push(id);
  return await meet.save();
};

const getMeetById = async (email, id) => {
  const meet = await Meet.findOne({ _id: id }).lean(); // Convert to plain JavaScript object
  if (!meet) {
    return -2;
  }

  const users = await Promise.all(
    meet.participants.map(async (participant) => {
      const user = await User.findOne(
        { email: participant.email },
        { firstName: 1, lastName: 1, profilePic: 1 } // Exclude location from projection
      );

      return {
        location: participant.location, // Use location from participant object
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
      };
    })
  );

  meet.users = users;

  if (
    meet.participants.some((participant) => participant.email === email) ||
    meet.creator === email
  ) {
    return meet;
  } else {
    return -1;
  }
};

const getBasicMeetInfo = async (id) => {
  const meet = await Meet.findOne({ _id: id }).lean(); // Convert to plain JavaScript object
  const creator = await User.findOne({ email: meet.creator });

  if (!meet) {
    return -1;
  } else {
    const meetBasic = {
      creator: creator.firstName + " " + creator.lastName,
      date: meet.date,
      name: meet.name,
    };
    return meetBasic;
  }
};

const acceptMeetInvite = async (email, id, location) => {
  const meet = await Meet.findOne({ _id: id });

  const user = await User.findOne({ email: email });

  if (!meet || !user) {
    return -1;
  }

  const isAlreadyParticipant = meet.participants.some(
    (participant) => participant.email == email
  );

  if (isAlreadyParticipant) {
    return -2;
  }

  if (meet.creator == email) {
    return -2;
  }

  meet.participants.push({
    email: email,
    location: location,
  });

  user.meets.push(meet.id);

  await user.save();
  return await meet.save();
};

/// Function to send email
const sendEmail = async (to, subject, html, attachments) => {
  // Create a Nodemailer transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Email message options
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: subject,
    html: html,
    attachments: attachments,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

const sendMeetInvite = async (email, recipientEmail, id) => {
  const meet = await Meet.findOne({ _id: id });

  const creator = await User.findOne({ email: email });
  if (!meet) {
    return -2;
  }

  await meet.save();

  // Send email with link to accept invitation
  const acceptLink = `http://localhost:12345/api/Meets/${id}/accept`;
  const subject = `You have been invited to a meet by ${meet.creator}`;
  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meet Invitation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      width: 150px;
      height: auto;
      margin-bottom: 20px;
    }
    .invitation {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
    }
    .invitation p {
      margin-bottom: 10px;
    }
    .invitation a {
      display: inline-block;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
    }
    .invitation a:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:logoImage" alt="Logo" class="logo">
      <h2>Meet Invitation</h2>
    </div>
    <div class="invitation">
      <p>You have been invited to ${meet.name} by ${creator.firstName} ${creator.lastName}.</p>
       <p>The meet date is: ${meet.date}.</p>
      <p>Click the following link to accept the invitation:</p>
      <a href="${acceptLink}">Accept Invitation</a>
      <div>
        <p>Or copy and paste the following link into your browser:</p>
        <p>${acceptLink}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  // Define embedded image
  const attachments = [
    {
      filename: "logo.png",
      path: "./public/logo.png",
      cid: "logoImage", // Same cid value as in the src attribute
    },
  ];

  await sendEmail(recipientEmail, subject, html, attachments);
};

function mostFrequent(arr) {
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
}
const converToRectangle = (center, radius) => {
  const latOffset = radius / 111000; // Approximately 111,000 meters (or 111 kilometers) per degree of latitude
  const lngOffset =
    radius / (111000 * Math.cos((center.latitude * Math.PI) / 180));
  const high = {
    latitude: center.latitude + latOffset,
    longitude: center.longitude + lngOffset,
  };

  // Calculate the coordinates for the southwest corner
  const low = {
    latitude: center.latitude - latOffset,
    longitude: center.longitude - lngOffset,
  };

  return { high, low };
};
const filterPlaces = (places, desiredDateTime) => {
  if (!places) {
    return [];
  }
  // Define day names for easy lookup
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = desiredDateTime.getDay(); // Get the day index (0 for Sunday, 1 for Monday, etc.)
  const dayName = dayNames[dayIndex]; // Get the name of the day
  const currentTime = desiredDateTime.toTimeString().slice(0, 5); // Get the time in "HH:MM" format
  console.log("Desired date day: " + dayName);
  console.log("Desired date hour: " + currentTime);
  console.log("places: " + places);
  // Filter the food places to only include ones open during the desired date and time
  const filteredPlaces = places.filter((place) => {
    const dayDescription = place.currentOpeningHours?.find((desc) =>
      desc.includes(dayName)
    );
    console.log("Day Description: " + dayDescription);
    if (!dayDescription) return false; // No opening hours found for the desired day

    // Extract opening and closing times (assuming format "HH:MM AM/PM – HH:MM AM/PM")
    const timeRange = dayDescription.split(": ")[1]; // Extracts the time range part
    console.log("Time Range: " + timeRange);
    const parsedTime = parseTimeRange(timeRange); // Parse the time range

    if (!parsedTime) return false; // If parsing fails, exclude this place

    // Convert parsed times to 24-hour format
    const placeOpenTime24 = convertTo24HourFormat(parsedTime.startTime);
    const placeCloseTime24 = convertTo24HourFormat(parsedTime.endTime);
    const desiredTime24 = convertTo24HourFormat(
      desiredDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    console.log(
      `Comparing: ${placeOpenTime24} <= ${desiredTime24} <= ${placeCloseTime24}`
    );

    // Check if the desired time is within the opening hours
    const isOpen = isWithinTimeRange(
      placeOpenTime24,
      placeCloseTime24,
      desiredTime24
    );
    console.log(`Is place open? ${isOpen}`);
    return isOpen;
  });

  return filteredPlaces;
};

// Helper function to parse time range
function parseTimeRange(timeRangeString) {
  // Define regex to match times with Unicode characters
  const timePattern =
    /(\d{1,2}:\d{2})[\s\u2009]*([APM]{2})?[\s\u2009]*[\u2013\u2014–-][\s\u2009]*(\d{1,2}:\d{2})[\s\u2009]*([APM]{2})?/i;

  // Execute the regex
  const match = timeRangeString.match(timePattern);

  if (!match) {
    console.log("No match found");
    return null; // No match found
  }

  const startTime = match[1]; // First matched time (start time)
  const startAMPM = match[2] || ""; // AM/PM for start time, or empty if not present
  const endTime = match[3]; // Second matched time (end time)
  const endAMPM = match[4] || ""; // AM/PM for end time, or empty if not present

  console.log(
    `Parsed Time Range: ${startTime}${startAMPM} - ${endTime}${endAMPM}`
  );

  return {
    startTime: `${startTime} ${startAMPM}`.trim(),
    endTime: `${endTime} ${endAMPM}`.trim(),
  };
}

// Helper function to convert "HH:MM AM/PM" to 24-hour format "HH:MM"
const convertTo24HourFormat = (time) => {
  const [timePart, modifier] = time.trim().split(/\s+/);
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier && modifier.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier && modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

// Check if the desired time is within the open range, considering midnight crossing
const isWithinTimeRange = (openTime, closeTime, desiredTime) => {
  const openTime24 = convertTo24HourFormat(openTime);
  const closeTime24 = convertTo24HourFormat(closeTime);
  const desiredTime24 = convertTo24HourFormat(desiredTime);

  // If the close time is less than the open time, it means the close time is past midnight
  if (closeTime24 < openTime24) {
    return desiredTime24 >= openTime24 || desiredTime24 <= closeTime24;
  } else {
    return desiredTime24 >= openTime24 && desiredTime24 <= closeTime24;
  }
};
/**
 * Finds food places based on the provided criteria including food type, restrictions, and location.
 *
 * @param {string} bestFood - The type of food to search for (e.g., "pizza").
 * @param {Array<string>} foodRestrictions - An array of food restrictions (e.g., dietary restrictions).
 * @param {Object} locationRestriction - The location restriction for the search, including a rectangle with low and high coordinates.
 * @param {Date} date - The date for filtering the results (used for special handling of activities).
 * @returns {Promise<Array>} - A promise that resolves to an array of food place objects.
 * @throws {Error} - Throws an error if the request to the Google Places API fails or if no valid data is returned.
 */
const findFood = async (
  bestFood,
  foodRestrictions,
  locationRestriction,
  date
) => {
  console.log("searching for ");
  console.log(
    `${[...new Set(foodRestrictions)].join(" ")} ${bestFood} restaurant `
  );
  console.log("locationRestriction ", locationRestriction);

  try {
    // Make a POST request to Google Places API to search for food places
    const foodResponse = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: `${[...new Set(foodRestrictions)].join(
          " "
        )} ${bestFood} restaurant `,
        locationRestriction: locationRestriction,
        maxResultCount: 20,
        rankPreference: "DISTANCE",
        includedType: "restaurant",
        strictTypeFiltering: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API,
          "X-Goog-FieldMask":
            "places.location,places.accessibilityOptions,places.displayName,places.formattedAddress,places.priceLevel,places.websiteUri,places.photos,places.rating,places.price_level,places.current_opening_hours",
        },
      }
    );

    // Check if the API response contains valid data
    if (!foodResponse.data || !foodResponse.data.places) {
      console.log("No data returned from the API.");
      return [];
    }
    // Map the API response data to a list of food place objects
    const foodPlaces = foodResponse?.data?.places?.map((element) => {
      return {
        wheelchairAccessibleEntrance:
          element?.accessibilityOptions?.wheelchairAccessibleEntrance,
        currentOpeningHours: element?.currentOpeningHours?.weekdayDescriptions,
        priceLevel: element?.priceLevel,
        rating: element?.rating,
        photoRef: element?.photos?.[0]?.name,
        url: element?.websiteUri,
        displayName: element?.displayName?.text,
        location: {
          address: element?.formattedAddress,
          lat: element?.location?.latitude,
          lng: element?.location?.longitude,
        },
      };
    });
    //console.log("foodPlaces", foodPlaces);
    // Filter the food places based on the date
    const filterdFoodPlaces = filterPlaces(foodPlaces, date);
    //console.log("filterdFoodPlaces", filterdFoodPlaces);

    return filterdFoodPlaces;
  } catch (error) {
    // Handle and log any errors that occur during the API request
    console.error("Error fetching food data:", error.message || error);
    return [];
  }
};
/**
 * Finds activities based on the provided best activity, location restriction, and date.
 *
 * @param {string} bestActivity - The type of activity to search for (e.g., "cinemas").
 * @param {Object} locationRestriction - The location restriction for the search, including a rectangle with low and high coordinates.
 * @param {Date} date - The date for filtering the results (used for special handling of activities).
 * @returns {Promise<Array>} - A promise that resolves to an array of activity objects.
 * @throws {Error} - Throws an error if the request to the Google Places API fails or if no valid data is returned.
 */
const findActivity = async (bestActivity, locationRestriction, date) => {
  const includedType = bestActivity === "cinemas" ? "movie_theater" : "";
  console.log("bestActivity is:", bestActivity);

  try {
    // Make a POST request to Google Places API to search for activities
    const activityResponse = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: `${bestActivity}`,
        locationRestriction: locationRestriction,
        maxResultCount: 20,
        rankPreference: "DISTANCE",
        includedType: includedType,
        strictTypeFiltering: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API,
          "X-Goog-FieldMask":
            "places.location,places.accessibilityOptions,places.displayName,places.formattedAddress,places.priceLevel,places.websiteUri,places.photos,places.rating,places.price_level,places.current_opening_hours",
        },
      }
    );

    // Check if the API response contains valid data
    if (!activityResponse.data || !activityResponse.data.places) {
      console.log("No data returned from the API.");
      return [];
    }

    // Map the API response data to a list of activity objects
    const activityPlaces = activityResponse?.data?.places?.map(
      (element, index) => {
        const activity = {
          wheelchairAccessibleEntrance:
            element?.accessibilityOptions?.wheelchairAccessibleEntrance,
          currentOpeningHours:
            element?.currentOpeningHours?.weekdayDescriptions,
          priceLevel: element?.priceLevel,
          rating: element?.rating,
          photoRef: element?.photos?.[0]?.name,
          url: element?.websiteUri,
          displayName: element?.displayName?.text,
          location: {
            address: element?.formattedAddress,
            lat: element?.location?.latitude,
            lng: element?.location?.longitude,
          },
        };
        return activity;
      }
    );

    // If the activity type is not "cinemas", filter the activities based on the date
    if (bestActivity !== "cinemas") {
      const filterdActivityPlaces = filterPlaces(activityPlaces, date);
      return filterdActivityPlaces;
    } else {
      // If activity type is "cinemas", return all results
      return activityPlaces;
    }
  } catch (error) {
    // Handle and log any errors that occur during the API request
    console.error("Error fetching activity data:", error.message || error);
    return [];
  }
};

// Helper function to get the most frequent item from a dictionary
function getMostFrequentItem(dictionary) {
  const sortedItems = Object.entries(dictionary).sort((a, b) => b[1] - a[1]);
  return sortedItems.length > 0 ? sortedItems[0][0] : null;
}
/**
 * Creates food recommendations based on user preferences or location proximity.
 *
 * The function first attempts to find food recommendations based on the most frequently selected food preference among the users.
 * If no such preferences are available or no results are found, it falls back to finding food recommendations based on location proximity.
 *
 * @async
 * @function createFoodRecommendation
 * @param {Object} locationRestriction - An object specifying the geographic area to search within. It includes a rectangular boundary defined by coordinates.
 * @param {Object} foodCounts - A dictionary/object where keys are food items and values are their counts of occurrences among user preferences.
 * @param {Array} foodRestrictions - An array containing any food restrictions that need to be considered during the search.
 * @param {Date} date - The date for which the recommendation is being made (used for filtering based on availability).
 * @param {Object} center - An object containing `latitude` and `longitude` properties representing the central location point.
 * @returns {Promise<Array>} - A promise that resolves to an array of food recommendations, up to 3 results.
 */
const createFoodRecommendation = async (
  locationRestriction,
  foodCounts,
  foodRestrictions,
  date,
  center
) => {
  let foodResult = [];
  // Find the most frequent food
  let mostFrequentFood = getMostFrequentItem(foodCounts);
  let copyMostFrequentFood = mostFrequentFood;
  // flag: true if we found recommendation
  let isRecommendationFound = false;
  // Initial search radius in meters.
  let radius = 5000;
  // Set maximum search radius to 30 km
  const maxRadius = 30000;

  // Check if dictionaries are empty = none of the users filled the preference quiz
  if (Object.keys(foodCounts).length === 0) {
    // If none of the users filled the preference quiz, find according to distance
    isRecommendationFound = true;
  }

  // Find food recommendations based on preferences.
  while (!isRecommendationFound) {
    // Find recommendations based on the most frequent food
    foodResult = await findFood(
      mostFrequentFood,
      foodRestrictions,
      locationRestriction,
      date
    );

    console.log("food Result: ", foodResult);
    if (foodResult.length === 0) {
      console.log("foodResult based on ", mostFrequentFood, "is empty");
      // Remove the most frequent food and update
      delete foodCounts[mostFrequentFood];
      mostFrequentFood = getMostFrequentItem(foodCounts);
      // If no more items left to consider, exit loop
      if (!mostFrequentFood) {
        isRecommendationFound = true;
      }
    } else {
      // Exit loop if a recommendation is found.
      isRecommendationFound = true;
    }
  }

  // Fallback to distance-based search if no food preferences were found.
  console.log("foodResult.length", foodResult.length);
  while (foodResult.length === 0) {
    if (radius >= maxRadius) {
      console.log("Maximum radius reached. Ending search.");
      return []; // Exit loop if maximum radius is reached.
    }

    radius += 5000; // Increase search radius by 5 km.
    let { low, high } = converToRectangle(center, radius);

    locationRestriction = {
      rectangle: {
        low: low,
        high: high,
      },
    };

    // find according to distance and mostFrequentFood
    console.log("No food preference left to consider, finding any restaurant");
    foodResult = await findFood(
      copyMostFrequentFood,
      foodRestrictions,
      locationRestriction,
      date
    );
  }
  // Return the top 3 food recommendations.
  const foodRecommendations = foodResult.slice(0, 3);
  return foodRecommendations;
};

/**
 * Creates activity recommendations based on the most frequent activity preferences
 * of participants or the closest matches within a given area.
 *
 * @param {Object} locationRestriction - The geographical restriction for searching.
 *                                       Example: { rectangle: { low: { latitude, longitude }, high: { latitude, longitude } } }
 * @param {Object} activityCounts - A dictionary containing activities as keys and their count of occurrences as values.
 *                                  Example: { 'cinemas': 3, 'hiking': 2 }
 * @param {String} date - The date for which the activity is being recommended.
 * @param {Object} center - The center point (latitude, longitude) for expanding search.
 *                          Example: { latitude: 31.0, longitude: 34.0 }
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of activity recommendations.
 */
const createActivityRecommendation = async (
  locationRestriction,
  activityCounts,
  date,
  center
) => {
  // Find the most frequent activity
  let mostFrequentActivity = getMostFrequentItem(activityCounts);
  let copyMostFrequentActivity = mostFrequentActivity;
  // flag: true if we found recommendation
  let isRecommendationFound = false;
  // Initial search radius in meters.
  let radius = 5000;
  // Define a maximum radius to avoid infinite loops or extremely large search areas.
  const MAX_RADIUS = 30000;
  // Check if dictionaries are empty = none of the users filled the preference quiz
  if (Object.keys(activityCounts).length === 0) {
    // If none of the users filled the preference quiz, find according to distance
    isRecommendationFound = true;
  }

  // Loop until a recommendation is found or no more preferences are left.
  while (!isRecommendationFound) {
    // Find recommendations based on the most frequent activity
    activityResult = await findActivity(
      mostFrequentActivity,
      locationRestriction,
      date
    );

    console.log("activity Result: ", activityResult);
    if (activityResult.length === 0) {
      console.log("activityResultbased on ", mostFrequentActivity, "is empty");
      // Remove the most frequent activity and update
      delete activityCounts[mostFrequentActivity];
      mostFrequentActivity = getMostFrequentItem(activityCounts);
      // If no more items left to consider, exit loop
      if (!mostFrequentActivity) {
        isRecommendationFound = true;
      }
    } else {
      isRecommendationFound = true;
    }
  }

  // Expand search area if no results are found.
  while (activityResult.length === 0 && radius <= MAX_RADIUS) {
    radius += 5000; // Increase search radius by 5 km.
    let { low, high } = converToRectangle(center, radius);
    locationRestriction = {
      rectangle: {
        low: low,
        high: high,
      },
    };

    // find according to distance and mostFrequentActivity
    activityResult = await findActivity(
      copyMostFrequentActivity,
      locationRestriction,
      date
    );
  }

  // If results are still empty after expanding search area, return an empty array.
  if (activityResult.length === 0) {
    console.log("No activities found within the maximum search radius.");
    return [];
  }
  const activityRecommendations = activityResult.slice(0, 3);
  return activityRecommendations;
};

const createRecommendation = async (id) => {
  try {
    // Find the meeting by id
    const meet = await Meet.findOne({ _id: id });
    if (!meet) {
      return -1; // Handle the case where the meet doesn't exist
    }

    let lats = 0;
    let lngs = 0;

    // Initialize the dictionaries to count occurrences
    const foodCounts = {};
    const activityCounts = {};
    const foodRestrictions = [];

    // Clear previous recommendations and votes
    meet.recommendations = [];
    meet.voted = [];

    // Find the users and their preferences and sum up the location data
    const users = await Promise.all(
      meet.participants.map(async (participant) => {
        lats += participant.location.lat;
        lngs += participant.location.lng;
        return await User.findOne({ email: participant.email });
      })
    );

    // Calculate the center location
    lats /= users.length;
    lngs /= users.length;
    const center = { latitude: lats, longitude: lngs };
    const { low, high } = converToRectangle(center, 5000);

    const locationRestriction = {
      rectangle: {
        low: low,
        high: high,
      },
    };

    users.forEach((user) => {
      // Count food preferences
      user?.preferences.food.forEach((food) => {
        foodCounts[food] = (foodCounts[food] || 0) + 1;
      });

      // Count activity preferences
      user?.preferences.activities.forEach((activity) => {
        activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      });

      // Collect food restrictions
      foodRestrictions.push(...user.preferences.foodRestrictions);
    });

    if (meet.type === "both") {
      let foodRecommendations = await createFoodRecommendation(
        locationRestriction,
        foodCounts,
        foodRestrictions,
        meet.date,
        center
      );
      let activityRecommendations = await createActivityRecommendation(
        locationRestriction,
        activityCounts,
        meet.date,
        center
      );
      //console.log("foodRecommendations", foodRecommendations);
      //console.log("activityRecommendations", activityRecommendations);

      // Determine the number of recommendations to create
      const minRecommendations = Math.min(
        foodRecommendations.length,
        activityRecommendations.length
      );

      // Populate the recommendations
      for (let index = 0; index < minRecommendations; index++) {
        const restaurant = foodRecommendations[index];
        const activity = activityRecommendations[index];

        meet.recommendations.push({
          restaurant,
          activity,
        });
      }
      return await meet.save();
    }

    if (meet.type === "food") {
      let foodRecommendations = await createFoodRecommendation(
        locationRestriction,
        foodCounts,
        foodRestrictions,
        meet.date
      );

      //console.log("foodRecommendations", foodRecommendations);
      // Populate the recommendations
      for (let index = 0; index < foodRecommendations.length; index++) {
        const restaurant = foodRecommendations[index];

        meet.recommendations.push({
          restaurant,
          activity: [],
        });
      }
      return await meet.save();
    }

    if (meet.type === "activity") {
      let activityRecommendations = await createActivityRecommendation(
        locationRestriction,
        activityCounts,
        meet.date
      );

      //console.log("activityRecommendations", activityRecommendations);
      // Populate the recommendations
      for (let index = 0; index < activityRecommendations.length; index++) {
        const activity = activityRecommendations[index];

        meet.recommendations.push({
          restaurant: [],
          activity,
        });
      }
      return await meet.save();
    }
  } catch (error) {
    console.log(error.response);
    return -1;
  }
};

const vote = async (email, meetId, choice) => {
  try {
    const meet = await Meet.findOne({ _id: meetId });
    const user = await User.findOne({ email: email });
    if (!meet || !user || meet.recommendations.length == 0) {
      return -1;
    }
    meet.recommendations.forEach((recommendation, index) => {
      if (recommendation.voted.includes(email)) {
        console.log("included");
        meet.recommendations[index].voted = recommendation.voted.filter(
          (vote) => vote != email
        );
      }
    });

    meet.recommendations[choice].voted.push(email);
    await meet.save();
    return meet.recommendations;
  } catch (error) {
    return -1;
  }
};

const getMeets = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    const allMeets = await Meet.find({ _id: { $in: user.meets } });

    const allMeetsWithUsers = await Promise.all(
      allMeets.map(async (meet) => {
        const users = await Promise.all(
          meet.participants.map(async (participant) => {
            return await User.findOne(
              { email: participant.email },
              { location: 1, firstName: 1, lastName: 1, profilePic: 1 }
            );
          })
        );
        return { ...meet._doc, users }; // `...meet._doc` spreads the object props
      })
    );

    return allMeetsWithUsers;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

module.exports = {
  createMeet,
  getMeetById,
  addMeetById,
  sendMeetInvite,
  acceptMeetInvite,
  createRecommendation,
  getBasicMeetInfo,
  vote,
  getMeets,
};
