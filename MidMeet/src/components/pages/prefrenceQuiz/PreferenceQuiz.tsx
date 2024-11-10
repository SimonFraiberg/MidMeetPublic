import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import FoodPreference from "./FoodPreference";
import ActivityPreference from "./ActivityPreference";
import FoodRestrictions from "../../../../server/public/FoodRestrictions";
import { Option } from "./Preference";

export default function PreferenceQuiz() {
  //FOOD RESTRICION
  const [restrictionOptions, setRestrictionOptions] = useState<Option[]>([
    {
      imgSrc: "/vegan.png",
      optionText: "Vegan",
      id: 1,
      clicked: false,
    },
    {
      imgSrc: "/vegetarian.png",
      optionText: "vegetarian",
      id: 2,
      clicked: false,
    },
    {
      imgSrc: "/kosher.png",
      optionText: "Only Kosher",
      id: 3,
      clicked: false,
    },
    {
      imgSrc: "/celiac.png",
      optionText: "Celiac",
      id: 4,
      clicked: false,
    },
  ]);
  //FOOD
  const [foodOptions, setFoodOptions] = useState<Option[]>([
    {
      imgSrc: "/sushi.png",
      optionText: "Sushi",
      id: 1,
      clicked: false,
    },
    {
      imgSrc: "/hamburger.png",
      optionText: "Hamburger",
      id: 2,
      clicked: false,
    },
    {
      imgSrc: "/pizza.png",
      optionText: "Pizza",
      id: 3,
      clicked: false,
    },
    {
      imgSrc: "/stake.png",
      optionText: "Stake",
      id: 4,
      clicked: false,
    },
    {
      imgSrc: "/coffee.png",
      optionText: "Coffee",
      id: 5,
      clicked: false,
    },
    {
      imgSrc: "/bakery.png",
      optionText: "Bakery",
      id: 6,
      clicked: false,
    },
    {
      imgSrc: "/mexican.png",
      optionText: "Mexican Food",
      id: 7,
      clicked: false,
    },
    {
      imgSrc: "/iceCream.png",
      optionText: "ice cream",
      id: 8,
      clicked: false,
    },
  ]);

  //ACTIVITY
  const [activityOptions, setActivityOptions] = useState<Option[]>([
    {
      imgSrc: "/sport.png",
      optionText: "Sport",
      id: 1,
      searchAPI: "gym",
      clicked: false,
    },
    {
      imgSrc: "/movie.png",
      optionText: "Movies",
      id: 2,
      searchAPI: "cinemas",
      clicked: false,
    },
    {
      imgSrc: "/hiking.png",
      optionText: "Hicking",
      id: 3,
      searchAPI: "nature reserve",
      clicked: false,
    },
    {
      imgSrc: "/museum.png",
      optionText: "Museums",
      id: 4,
      searchAPI: "museums",
      clicked: false,
    },
    {
      imgSrc: "/shopping.png",
      optionText: "Shopping",
      id: 5,
      searchAPI: "mall",
      clicked: false,
    },
    {
      imgSrc: "/bowling.png",
      optionText: "Bowling",
      id: 6,
      searchAPI: "bowling",
      clicked: false,
    },
    {
      imgSrc: "/nightClub.png",
      optionText: "Pub",
      id: 7,
      searchAPI: "pub",
      clicked: false,
    },
    {
      imgSrc: "/theater.png",
      optionText: "Theater",
      id: 8,
      searchAPI: "theater",
      clicked: false,
    },
  ]);
  return (
    <Routes>
      <Route
        path="FoodRestriction"
        element={
          <FoodRestrictions
            restrictionsOptions={restrictionOptions}
            setRestrictionsOptions={setRestrictionOptions}
          />
        }
      />
      <Route
        path="FoodPreference"
        element={
          <FoodPreference
            foodOptions={foodOptions}
            setFoodOptions={setFoodOptions}
          />
        }
      />
      <Route
        path="ActivityPreference"
        element={
          <ActivityPreference
            activityOptions={activityOptions}
            setActivityOptions={setActivityOptions}
          />
        }
      />
    </Routes>
  );
}
