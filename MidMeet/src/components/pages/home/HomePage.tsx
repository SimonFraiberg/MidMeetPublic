import { TokenContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import currentUser from "../../../currentUser";
import MidMeetNavbar from "../../midMeetNavbar/MidMeetNavbar";
import WelcomeUser from "../../welcomeUser/WelcomeUser";
import { getAllMeetings } from "../../../apiOperations/meetApi";
import { Nav, Tab, Spinner } from "react-bootstrap";
import { isBefore } from "date-fns";
import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NotFound from "../../meeting/NotFound";
import ShowMeeting from "../../meeting/ShowMeeting";
import { meetProps } from "../../../apiOperations/meetApi";
import Invite from "../../invitation/Invite";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../MuiTheme";
import { ToastContainer } from "react-toastify";
import "./homePage.css";

export default function HomePage() {
  const [openInvite, setOpenInvite] = useState(false);
  const [inviteMeetId, setInviteMeetId] = useState("");

  const { token, setToken } = useContext(TokenContext);
  const { user, isLoading, isError } = currentUser(token, setToken);
  const [activeKey, setActiveKey] = useState("1"); // Start with the first tab
  const [allMeets, setAllMeets] = useState<meetProps[]>([]);
  const [numMeeting, setNumMeeting] = useState<number>(0);

  useEffect(() => {
    async function fetchMeetings() {
      const meetings = await getAllMeetings(token, setToken);
      // Sort all meetings by date
      meetings.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const now = new Date();
      setNumMeeting(meetings.length);
      const futureMeetings = meetings.filter(
        (meeting) => !isBefore(new Date(meeting.date), now)
      );
      setAllMeets(futureMeetings.slice(0, 2));
    }
    fetchMeetings();
    if (returnUrl) {
      setOpenInvite(true);
      const meetIdWithAccept = returnUrl.split("Meets/")[1];
      setInviteMeetId(meetIdWithAccept.split("/")[0]);
    }
  }, [token, setToken, openInvite]);
  //navigate to create new meeting page
  const navigate = useNavigate(); // Initialize the navigate function

  const queryParams = new URLSearchParams(window.location.search);
  const returnUrl = queryParams.get("returnUrl");

  if (isLoading) {
    return <Spinner animation="border" variant="warning" />; // Render loading state
  }

  if (isError) {
    navigate("/Login");
  }

  return (
    <>
      <MidMeetNavbar />
      <Invite meetId={inviteMeetId} open={openInvite} setOpen={setOpenInvite} />
      <WelcomeUser name={user?.firstName} picture={user?.profilePic} />
      <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k!)}>
        <Nav variant="pills" className="border-bottom p-3">
          <Nav.Item>
            <Nav.Link className="josefin-sans" eventKey="1">
              Latest meetings
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="josefin-sans" eventKey="2">
              Your Information
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/*Latest meetings tab*/}
          <Tab.Pane eventKey="1">
            {allMeets.length === 0 ? (
              <NotFound />
            ) : (
              <ShowMeeting meetings={allMeets} />
            )}
          </Tab.Pane>

          {/* Your Information tab */}
          <Tab.Pane eventKey="2">
            <ThemeProvider theme={theme}>
              <Card sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
                <CardHeader
                  title={
                    <Typography
                      variant="h5"
                      style={{
                        fontFamily: "Gabriela, sans-serif",
                        fontWeight: "500",
                        fontSize: "24px",
                        color: "white",
                        fontStyle: "normal",
                      }}
                    >
                      Your Information
                    </Typography>
                  }
                  sx={{
                    backgroundColor: "primary.light",
                  }}
                />
                <CardContent>
                  <Typography variant="body1" paragraph>
                    <strong className="profileH2">Full Name:</strong>
                    <span className="profileText">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong className="profileH2">Email:</strong>
                    <span className="profileText">{user?.email}</span>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong className="profileH2">Default Location:</strong>
                    <span className="profileText">
                      {user?.location.address || "N/A"}
                    </span>
                  </Typography>
                  <Typography variant="body1">
                    <strong className="profileH2">
                      Number of Meetings With Us:
                    </strong>
                    <span className="profileText">{numMeeting}</span>
                  </Typography>
                </CardContent>
              </Card>
            </ThemeProvider>
          </Tab.Pane>
        </Tab.Content>
        <ThemeProvider theme={theme}>
          {/*shortcut for common actions (apper in all of the tabs)*/}
          <Tooltip title="Create New Meet" placement="left">
            <Fab
              color="primary"
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                color: "white",
              }}
              onClick={() => navigate("/createMeet")}
            >
              <AddIcon /> {/* Add the plus icon */}
            </Fab>
          </Tooltip>
        </ThemeProvider>
      </Tab.Container>
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
