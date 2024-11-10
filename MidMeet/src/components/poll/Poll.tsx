import React, { useState, useContext, useEffect } from "react";
import { useSprings, animated } from "@react-spring/web";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Button from "react-bootstrap/Button";
import { recommendationProp, vote } from "../../apiOperations/meetApi";
import { TokenContext } from "../../App";

type optionProps = {
  description: string;
  votes: number;
};

type pollProps = {
  recommendations: recommendationProp[];
  meetId: string;
};

export default function Poll({ recommendations, meetId }: pollProps) {
  const { setToken, token } = useContext(TokenContext);

  const [value, setValue] = useState<string>("");
  const [newRecommendations, setNewRecommendations] = useState(recommendations);
  const [options, setOptions] = useState<optionProps[]>([]);
  const [helperText, setHelperText] = useState("Choose your favorite meet");

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [springs, api] = useSprings(options.length, () => ({
    width: "0px",
    from: { width: "0%" },
  }));

  useEffect(() => {
    setNewRecommendations(recommendations);

    setOptions(
      recommendations.map((recommendation, index) => ({
        description: getOrdinal(index),
        votes: recommendation?.voted?.length,
      }))
    );
  }, [recommendations]);

  useEffect(() => {
    console.log(newRecommendations);
    const maxVotes = Math.max(
      ...newRecommendations.map((recommendation) => recommendation.voted.length)
    );
    console.log("max" + maxVotes);

    const barsData = options.map((option) => {
      const barWidth = maxVotes ? (option.votes / maxVotes) * 100 : 0;
      console.log(barWidth);
      return { width: `${barWidth}px` };
    });
    console.log("restart");
    api.start((index) => ({
      width: barsData[index].width,
      from: { width: "0px" },
    }));
  }, [options, newRecommendations]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const recommendationsResponse = await vote(
      token,
      setToken,
      meetId,
      Number(value)
    );
    if (recommendationsResponse) {
      setNewRecommendations(recommendationsResponse);
      setOptions(
        recommendationsResponse.map((recommendation, index) => ({
          description: getOrdinal(index),
          votes: recommendation?.voted?.length,
        }))
      );
    }
    setHelperText("Excellent Choice");
  };

  const getOrdinal = (n: number) => {
    const ordinals = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
    ];
    return ordinals[n] || `${n + 1}th`; // Fallback for larger numbers
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ m: 4 }} variant="standard">
        <FormLabel id="Meet Vote">Meet Vote</FormLabel>
        <RadioGroup
          aria-labelledby="Meet Vote"
          name="quiz"
          value={value}
          onChange={handleRadioChange}
        >
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={index.toString()}
              control={<Radio />}
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: "0 0 100px", paddingRight: 10 }}>
                    {option.description}
                  </div>
                  <div style={{ flex: 1, marginRight: 8 }}>
                    {newRecommendations.length > 0 && (
                      <animated.div
                        style={{
                          height: "10px",
                          backgroundColor: "lightblue",
                          ...springs[index],
                        }}
                      ></animated.div>
                    )}
                  </div>
                  <div style={{ width: "150px", textAlign: "left" }}>
                    {option.votes} votes
                  </div>
                </div>
              }
            />
          ))}
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button
          style={{ width: "120px", height: "40px" }}
          type="submit"
          variant="primary"
        >
          VOTE
        </Button>
      </FormControl>
    </form>
  );
}
