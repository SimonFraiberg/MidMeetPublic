import React, { useEffect } from "react";
import { useState } from "react";
import Preference from "../../src/components/pages/prefrenceQuiz/Preference";
import Background from "../../src/components/background/Background";
import Card from "../../src/components/card/Card";
import Button from "../../src/components/button/Button";
import { Option } from "../../src/components/pages/prefrenceQuiz/Preference";
import { useNavigate } from "react-router-dom";

interface FoodRestrictionsProps {
  restrictionsOptions: Option[];
  setRestrictionsOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}

export default function FoodRestrictions({
  restrictionsOptions,
  setRestrictionsOptions,
}: FoodRestrictionsProps) {
  const [selectedRestriction, setSelectedRestriction] = useState<string[]>([]);
  const [shouldNavigate, setShouldNavigate] = useState(false); // New state for navigation trigger
  // Navigate to NextComponent
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate only if `shouldNavigate` is true and `selectedRestriction` has been updated
    if (shouldNavigate) {
      navigate("/PreferenceQuiz/FoodPreference", {
        state: { foodRestriction: selectedRestriction },
      });
      setShouldNavigate(false); // Reset the navigation trigger
    }
  }, [shouldNavigate, selectedRestriction, navigate]);

  const handleNextClick = () => {
    //updating the selected food array
    setSelectedRestriction(() => [
      ...restrictionsOptions
        .filter((option) => option.clicked)
        .map((option) => option.optionText),
    ]);
    setShouldNavigate(true); // Set trigger for navigation
  };

  return (
    <Background>
      <Card className="preferenceCard">
        <Preference
          title="Any food restrictions?"
          className="container_4_images"
          options={restrictionsOptions}
          setOptions={setRestrictionsOptions}
        />
        <Button
          name="next"
          className="fileButton bottomRight"
          onClick={handleNextClick}
        />
      </Card>
    </Background>
  );
}
