import { Card } from "react-bootstrap";
import TwoFactorSteps from "./TwoFactor/TwoFactorSteps";
import ListItem from "@mui/material/ListItem";
import QuizIcon from "@mui/icons-material/Quiz";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MidMeetNavbar from "../../midMeetNavbar/MidMeetNavbar";
import ChangeAddress from "./ChangeAddress";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import ChangePicture from "./ChangePicture";
import theme from "../../MuiTheme";
import { ThemeProvider } from "@mui/material/styles";

import "./settings.css";

export default function Settings() {
  const navigate = useNavigate();
  return (
    <>
      <MidMeetNavbar />
      <div className="settings">
        <ThemeProvider theme={theme}>
          <Card className="settings-card">
            <Card.Body>
              <TwoFactorSteps />
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/PreferenceQuiz/FoodRestriction");
                    }}
                  >
                    <ListItemIcon>
                      <QuizIcon style={{ fontSize: 40 }} />
                    </ListItemIcon>
                    <ListItemText primary="Preference Quiz" />
                  </ListItemButton>
                </ListItem>
                <ChangePicture />
                <ChangeAddress />

                <ChangePassword />
              </List>
            </Card.Body>
          </Card>
        </ThemeProvider>
      </div>
    </>
  );
}
