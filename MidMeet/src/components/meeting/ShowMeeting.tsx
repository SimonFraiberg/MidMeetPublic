import { Container } from "react-bootstrap";
import { meetProps } from "../../apiOperations/meetApi";
import Meeting, { Participant } from "./Meeting";
import { format } from "date-fns";

// Define the prop type for LatestMeeting
interface ShowMeetingProps {
  meetings: meetProps[]; // Expect an array of meetProps
}

export default function ShowMeeting({ meetings }: ShowMeetingProps) {
  // Render the meetings
  return (
    <>
      <Container fluid className="position-relative">
        {meetings.map((meeting, index) => {
          console.log(meeting.users);
          const participants: Participant[] =
            meeting.users?.length > 0
              ? meeting.users.map((user) => ({
                  name: user.firstName,
                  image: user.profilePic,
                }))
              : [];

          return (
            <Meeting
              key={index}
              id={meeting._id}
              name={meeting.name}
              startTime={format(new Date(meeting.date), "h:mm a")}
              date={format(new Date(meeting.date), "yyyy, MMMM do, EEEE")}
              participants={participants} // Pass the participants array
            />
          );
        })}
      </Container>
    </>
  );
}
