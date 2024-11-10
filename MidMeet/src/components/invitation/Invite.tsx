import { useEffect, useContext, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { getBasicMeetInfo, BasicMeetInfo } from "../../apiOperations/meetApi";
import { TokenContext } from "../../App";
import LocationInput from "../fields/LocationInput";
import currentUser from "../../currentUser";
import { acceptInvite } from "../../apiOperations/meetApi";
import { useNavigate } from "react-router-dom";
type InviteProps = {
  meetId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Invite({ meetId, open, setOpen }: InviteProps) {
  const navigate = useNavigate();
  const { token, setToken } = useContext(TokenContext);
  const [meet, setMeet] = useState<BasicMeetInfo>();
  const [option, setOption] = useState(1);

  const [location, setLocation] = useState({ address: "", lng: 0, lat: 0 });
  const [enterLocation, setEnterLocation] = useState(false);

  const { user, isLoading, isError } = currentUser(token, setToken);
  useEffect(() => {
    const fetchMeet = async () => {
      try {
        const meetData = await getBasicMeetInfo(token, setToken, meetId);
        setMeet(meetData);
      } catch (error) {
        setMeet(undefined);
      }
    };
    fetchMeet();
  }, [meetId]);

  useEffect(() => {
    if (user) setLocation(user?.location);
  }, [user]);
  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>Error: Unable to fetch user data</div>;
  }

  const handleAccept = async () => {
    if (enterLocation && location.address == "") {
      toast.error("Please Select your Location");
      return;
    }

    const status = await acceptInvite(token, setToken, meetId, location);
    if (status) {
      toast.success("You have accepted the invitation!");
    } else {
      toast.error("Invalid Invitation");
    }
    setOpen(false);
    navigate("/HomePage");
  };

  const handleDecline = () => {
    toast.warning("You have Declined the invitation!");

    setOpen(false);
    navigate("/HomePage");
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        New Invitation From {meet?.creator}
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpen(false);
            handleDecline();
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ borderColor: "black" }} />

      <Box
        sx={{
          minHeight: enterLocation ? "500px" : "300px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box sx={{ mb: 2 }}>
            <p>
              You're invited to <strong>{meet?.name}</strong> on{" "}
              {meet?.date && (
                <strong>
                  {format(
                    meet?.date,
                    "EEEE, MMMM do, yyyy, h:mm:ss a 'GMT'XXX"
                  )}
                </strong>
              )}
            </p>
          </Box>
          <Divider>Where will you be?</Divider>

          <Box sx={{ m: 2, display: "flex", justifyContent: "center" }}>
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={option}
              onChange={(event, newValue) => {
                event;
                setLocation({ address: "", lng: 0, lat: 0 });
                if (newValue == null) {
                  if (option == 1) {
                    setEnterLocation(true);
                  } else {
                    if (user?.location) setLocation(user?.location);
                    setEnterLocation(false);
                  }
                  setOption(-option);
                } else {
                  setOption(newValue);
                }

                if (newValue === -1) {
                  setEnterLocation(true);
                } else if (newValue === 1 && user?.location.address) {
                  setLocation(user?.location);
                  setEnterLocation(false);
                }
              }}
            >
              <ToggleButton value={1}>
                {user?.location.address || "Your saved location"}
              </ToggleButton>
              <ToggleButton value={-1}>Other place</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {enterLocation && (
            <Box sx={{ mt: 2 }}>
              <LocationInput setLocation={setLocation} />
            </Box>
          )}
        </Box>
        <Box>
          <Button
            sx={{ float: "right" }}
            variant="outlined"
            color="success"
            onClick={handleAccept}
          >
            Accept Invitation
          </Button>
          <Button variant="outlined" color="error" onClick={handleDecline}>
            Decline Invitation
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
