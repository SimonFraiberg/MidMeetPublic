import * as React from "react";
import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import "./meetings.css"; // Assuming you create a CSS file for custom styles

type activityProps = {
  selectedCards: string[];
  setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
};
export default function ActivityPick({
  selectedCards,
  setSelectedCards,
}: activityProps) {
  const handleCardClick = (card: string) => {
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.includes(card)
        ? prevSelectedCards.filter((c) => c !== card)
        : [...prevSelectedCards, card]
    );
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding={3}
        gap={2} // Adjust this value to control the space between the cards
      >
        <Card
          className={`activity-card ${
            selectedCards.includes("activity") ? "selected" : ""
          }`}
          sx={{ width: "40vw", objectFit: "fit" }}
          onClick={() => handleCardClick("activity")}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              image="./activity.svg"
              alt="activity"
              sx={{ height: "22vh", objectFit: "contain" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find me a fun activity
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card
          className={`activity-card ${
            selectedCards.includes("food") ? "selected" : ""
          }`}
          sx={{ width: "40vw", objectFit: "fit" }}
          onClick={() => handleCardClick("food")}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              image="./food.svg"
              alt="food"
              sx={{ height: "22vh", objectFit: "contain" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Food
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find me a place to eat
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </>
  );
}
