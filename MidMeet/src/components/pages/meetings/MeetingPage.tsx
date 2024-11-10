import { useContext, useEffect, useState } from "react";
import MidMeetNavbar from "../../midMeetNavbar/MidMeetNavbar";
import { getAllMeetings, meetProps } from "../../../apiOperations/meetApi";
import { TokenContext } from "../../../App";
import { Card } from "react-bootstrap";
import { isBefore } from "date-fns";
import ShowMeeting from "../../meeting/ShowMeeting";
import "./meetings.css";

export default function MeetingPage() {
  const { token, setToken } = useContext(TokenContext);
  const [upcomingMeetings, setUpcomingMeetings] = useState<meetProps[]>([]);
  const [previousMeetings, setPreviousMeetings] = useState<meetProps[]>([]);

  useEffect(() => {
    async function fetchMeetings() {
      const meetings = await getAllMeetings(token, setToken);

      // Sort all meetings by date
      meetings.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Separate meetings into previous and upcoming
      const now = new Date();
      const pastMeetings = meetings.filter((meeting) =>
        isBefore(new Date(meeting.date), now)
      );
      const futureMeetings = meetings.filter(
        (meeting) => !isBefore(new Date(meeting.date), now)
      );

      setPreviousMeetings(pastMeetings);
      setUpcomingMeetings(futureMeetings);
    }
    fetchMeetings();
  }, [token, setToken]);
  return (
    <>
      <MidMeetNavbar />
      <span className="gabriela-regular meetingPageTitle">
        Upcoming Meetings
      </span>
      <Card className="meetingCard overflow-auto">
        <Card.Body>
          {/** Upcoming Meetings */}
          <ShowMeeting meetings={upcomingMeetings} />
        </Card.Body>
      </Card>
      <span className="gabriela-regular meetingPageTitle">
        Previous Meetings
      </span>
      <Card className="overflow-auto meetingCard gabriela-regular overflow-auto">
        <Card.Body>
          {/** Previous Meetings */}
          <ShowMeeting meetings={previousMeetings} />
        </Card.Body>
      </Card>
    </>
  );
}
