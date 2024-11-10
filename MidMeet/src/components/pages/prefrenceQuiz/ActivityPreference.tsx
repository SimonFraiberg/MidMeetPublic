import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import Preference from "./Preference";
import Background from "../../background/Background";
import Card from "../../card/Card";
import Button from "../../button/Button";
import { Option } from "./Preference";
import { postPreference } from "../../../apiOperations/quizPreference";
import { TokenContext } from "../../../App";
import { ToastContainer, toast } from "react-toastify";
import confetti from "canvas-confetti";

interface ActivityPreferenceProps {
  activityOptions: Option[];
  setActivityOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}

export default function ActivityPreference({
  activityOptions,
  setActivityOptions,
}: ActivityPreferenceProps) {
  const location = useLocation();
  const { food = [], foodRestriction = [] } = location.state || {};
  const { setToken, token } = useContext(TokenContext);
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  const [shouldNavigate, setShouldNavigate] = useState(false); // New state for navigation trigger
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Navigate to another component
  const navigate = useNavigate();

  //Prev navigate the user to the food preference
  const handlePrevClick = () => {
    navigate("/PreferenceQuiz/FoodPreference");
  };

  useEffect(() => {
    if (shouldNavigate) {
      if (selectedActivity.length > 0) {
        selectedActivity.forEach((item) => {
          console.log("activity:" + item);
        });
        if (food && food.length > 0) {
          food.forEach((item: any) => {
            console.log("food:" + item);
          });
        }
        if (foodRestriction && foodRestriction.length > 0)
          foodRestriction.forEach((item: any) => {
            console.log("foodRestriction:" + item);
          });

        postPreference(token, setToken, {
          foodRestrictions: foodRestriction,
          food: food,
          activities: selectedActivity,
        });
        triggerConfetti();
        navigate("/HomePage");
      } else {
        toast.error("please pick at least 1 activity");
      }
      setShouldNavigate(false); // Reset the navigation trigger
    }
  }, [shouldNavigate, selectedActivity]);

  const handleFinishClick = () => {
    //updating the selected activity array
    setSelectedActivity((prevSelectedActivity) => [
      ...prevSelectedActivity,
      ...activityOptions
        .filter((option) => option.clicked)
        .map((option) => option.searchAPI as string),
    ]);
    setShouldNavigate(true); // Set trigger for navigation
  };
  return (
    <Background>
      <Card className="preferenceCard">
        <Preference
          title="What kind of activity do you like?"
          className="container_8_images"
          options={activityOptions}
          setOptions={setActivityOptions}
        />
        <Button
          name="FINISH"
          className="fileButton bottomRight"
          onClick={handleFinishClick}
        />
        <Button
          name="prev"
          className="fileButton bottomLeft"
          onClick={handlePrevClick}
        />
      </Card>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Background>
  );
}
