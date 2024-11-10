import dayjs, { Dayjs } from "dayjs";

import { useState, useContext, useEffect } from "react";
import MidMeetNavbar from "../../midMeetNavbar/MidMeetNavbar";
import { Button } from "react-bootstrap";
import CustomStepper from "../../wizard/CustomStepper";
import DateCard from "./DateCard";
import ActivityPick from "./ActivityPick";
import InviteStage from "./InviteStage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createMeet } from "../../../apiOperations/meetApi";
import PickLocation from "./PickLocation";
import { TokenContext } from "../../../App";


export default function CreateMeeting() {
  const { setToken, token } = useContext(TokenContext);

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState({ address: "", lng: 0, lat: 0 });
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [stage, setStage] = useState(0);
  const [meetId, setMeetId] = useState("");

  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  useEffect(() => {
    if (meetId != "") setStage((prevStage) => prevStage + 1);
  }, [meetId]);

  const handleNextClick = () => {
    if (stage == 0) {
      if (value) {
        const date = value.toDate();
        console.log(date);
      }
      if (name == "") {
        toast.error("please pick a name for the meet");
        return;
      }
    }

    if (stage < 2) setStage((prevStage) => prevStage + 1);
  };

  const handleActivity = async () => {
    if (selectedCards.length == 0) {
      toast.error("please pick at least one");
      return;
    } else {
      setStage((prevStage) => prevStage + 1);
    }
  };

  const handleCreate = async (location: {
    address: string;
    lng: number;
    lat: number;
  }) => {
    toast.success("Meet Created you can now invite people");

    if (
      selectedCards.includes("food") &&
      selectedCards.includes("activity") &&
      value
    ) {
      const id = await createMeet(
        token,
        setToken,
        name,
        value.toDate(),
        "both",
        location
      );

      setMeetId(id);
    } else {
      if (
        selectedCards.includes("food") &&
        !selectedCards.includes("activity") &&
        value
      )
        setMeetId(
          await createMeet(
            token,
            setToken,
            name,
            value.toDate(),
            "food",
            location
          )
        );
      else {
        if (value)
          setMeetId(
            await createMeet(
              token,
              setToken,
              name,
              value.toDate(),
              "activity",
              location
            )
          );
      }
    }
  };

  const handleDone = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    if (stage > 0) setStage((prevStage) => prevStage - 1);
  };

  return (
    <>
      <MidMeetNavbar />
      <CustomStepper stage={stage}></CustomStepper>
      {stage == 0 && (
        <DateCard
          name={name}
          setName={setName}
          value={value}
          setValue={setValue}
        />
      )}
      {stage == 1 && (
        <ActivityPick
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
        />
      )}

      {stage == 2 && (
        <PickLocation setLocation={setLocation} handleCreate={handleCreate} />
      )}
      {stage == 3 && <InviteStage id={meetId} />}
      {stage == 0 && (
        <Button
          name="Next"
          className="custom-action-button next"
          onClick={handleNextClick}
        >
          Next
        </Button>
      )}
      {stage == 1 && (
        <Button
          name="Next"
          className="custom-action-button next"
          onClick={handleActivity}
        >
          Next
        </Button>
      )}
      {stage == 1 && (
        <Button
          name="Back"
          className="custom-action-button back"
          onClick={handleBackClick}
        >
          Back
        </Button>
      )}
      {stage <= 2 && stage != 0 && (
        <Button
          name="Back"
          className="custom-action-button back"
          onClick={handleBackClick}
        >
          Back
        </Button>
      )}
      {stage == 2 && (
        <Button
          name="Create"
          className="custom-action-button next"
          onClick={() => handleCreate(location)}
        >
          Create
        </Button>
      )}
      {stage == 3 && (
        <Button
          name="Done"
          className="custom-action-button done"
          onClick={handleDone}
        >
          Done
        </Button>
      )}
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
    </>
  );
}
