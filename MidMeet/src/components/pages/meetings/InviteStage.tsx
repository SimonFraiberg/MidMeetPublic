import { useState, useContext } from "react";
import { TokenContext } from "../../../App";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Box,
  Button,
  TextField,
  Chip,
  Typography,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "./meetings.css";
import { sendInvite } from "../../../apiOperations/meetApi";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import theme from "../../MuiTheme";
import { ThemeProvider } from "@mui/material/styles";

const copyToClipboard = (id: string) => {
  if (copy(`http://localhost:12345/api/Meets/${id}/accept`)) {
    toast.success("Copied Invitation link to Clipboard");
  }
};

const BlackChip = styled(Chip)(({}) => ({
  backgroundColor: "transparent",
  border: "solid 1px grey",
  color: "black",
  "& .MuiChip-deleteIcon": {
    color: "#f2cead",
    "&:hover": {
      color: "#fca14c",
    },
  },
}));

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

type InviteProps = {
  id: string;
};

export default function InviteStage({ id }: InviteProps) {
  const { setToken, token } = useContext(TokenContext);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddEmail = () => {
    if (
      emailInput &&
      isValidEmail(emailInput) &&
      !emails.includes(emailInput)
    ) {
      setEmails([...emails, emailInput]);
      setEmailInput("");
      setError("");
    } else if (!isValidEmail(emailInput)) {
      setError("Please enter a valid email address.");
    } else if (emails.includes(emailInput)) {
      setError("Email already added.");
    }
  };

  const handleDeleteEmail = (emailToDelete: string) => {
    setEmails((prevEmails) =>
      prevEmails.filter((email) => email !== emailToDelete)
    );
  };

  const handleSendInvites = () => {
    emails.forEach((email) => {
      sendInvite(token, setToken, id, email);
    });
    toast.success("Sent Invites");
    setEmails([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 500, margin: "0 auto", textAlign: "center", mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Invite People
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            fullWidth
            label="Enter email"
            variant="outlined"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              if (error) setError("");
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddEmail();
              }
            }}
            error={!!error}
            sx={{ marginRight: "8px" }}
          />

          <Button
            color="secondary"
            endIcon={<PersonAddIcon />}
            variant="outlined"
            onClick={handleAddEmail}
            sx={{
              height: "56px",
              marginRight: "8px",
              minWidth: "120px",
            }}
          >
            ADD
          </Button>
          <Button
            color="secondary"
            endIcon={<ContentCopyIcon />}
            variant="outlined"
            onClick={() => copyToClipboard(id)}
            sx={{
              height: "56px",
              minWidth: "120px",
            }}
          >
            Invite Link
          </Button>
        </Box>
        {error && (
          <FormHelperText error sx={{ mb: 2 }}>
            {error}
          </FormHelperText>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {emails.map((email) => (
            <BlackChip
              key={email}
              label={email}
              onDelete={() => handleDeleteEmail(email)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleSendInvites}
          endIcon={<SendIcon />}
          disabled={!emails.length}
          sx={{ height: "56px", minWidth: "120px" }}
        >
          Send Invites
        </Button>
      </Box>
    </ThemeProvider>
  );
}
