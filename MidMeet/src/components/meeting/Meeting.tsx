import { Container, Row, Col } from "react-bootstrap";
import "./meeting.css";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarGroup } from "@mui/material";
export interface Participant {
  name: string;
  image: string;
}

interface MeetingProps {
  key: number;
  id: string;
  name: string;
  startTime: string;
  date: string;
  participants: Participant[];
}

export default function Meeting({
  id,
  name,
  startTime,
  date,
  participants,
}: MeetingProps) {
  const navigate = useNavigate(); // Initialize the navigate function
  console.log(participants);
  return (
    <Container
      onClick={() => navigate(`/Map/${id}`)}
      fluid
      className="p-4 rounded mt-3 w-75 meetingContainer"
    >
      <Row className="josefin-sans meetingText">
        <Col xs={8}>
          <Row>
            <Col>
              <span className="meetingTitle">Meeting Name: </span>
              {name}
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="meetingTitle">Start at:</span> {startTime}
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="meetingTitle">Date:</span> {date}{" "}
            </Col>
          </Row>
        </Col>
        <Col xs={4}>
          <Row>
            <span className="meetingTitle">Particpants:</span>
          </Row>
          <Row>
            <AvatarGroup
              sx={{
                justifyContent: "flex-end",
              }}
              max={4}
            >
              {participants.length !== 0 ? (
                participants.map((participant) => (
                  <Avatar alt="particpant" src={participant.image} />
                ))
              ) : (
                <>
                  <Col>No One</Col>
                </>
              )}
            </AvatarGroup>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
