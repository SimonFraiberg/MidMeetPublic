import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Preference from "./Preference";
import Background from "../../background/Background";
import Card from "../../card/Card";
import Button from "../../button/Button";
import { Option } from "./Preference";
import { ToastContainer, toast } from "react-toastify";

interface FoodPreferenceProps {
  foodOptions: Option[];
  setFoodOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}

export default function FoodPreference({
  foodOptions,
  setFoodOptions,
}: FoodPreferenceProps) {
  const location = useLocation();
  const { foodRestriction = [] } = location.state || {};
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [shouldNavigate, setShouldNavigate] = useState(false); // New state for navigation trigger
  // Navigate to NextComponent
  const navigate = useNavigate();
  useEffect(() => {
    if (shouldNavigate) {
      if (selectedFood.length > 0) {
        navigate("/PreferenceQuiz/ActivityPreference", {
          state: {
            food: selectedFood,
            foodRestriction: foodRestriction,
          },
        });
      } else {
        console.log("wtf?");
        toast.error("please pick at least 1 option");
      }
      setShouldNavigate(false); // Reset the navigation trigger
    }
  }, [shouldNavigate, selectedFood]);

  const handleNextClick = () => {
    //updating the selected food array
    setSelectedFood(() => [
      ...foodOptions
        .filter((option) => option.clicked)
        .map((option) => option.optionText),
    ]);
    setShouldNavigate(true); // Set trigger for navigation
  };

  const handlePrevClick = () => {
    navigate("/PreferenceQuiz/FoodRestriction");
  };
  return (
    <Background>
      <Card className="preferenceCard">
        <Preference
          title="What kind of food do you like?"
          className="container_8_images"
          options={foodOptions}
          setOptions={setFoodOptions}
        />
        <Button
          name="next"
          className="fileButton bottomRight"
          onClick={handleNextClick}
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
