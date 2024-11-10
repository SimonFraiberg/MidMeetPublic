import { Container, Row, Col, Image, Button } from "react-bootstrap";
import "./welcomeUser.css";
import { isQuizEmpty } from "../../apiOperations/quizPreference";
import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../App";
import { useNavigate } from "react-router-dom";
/**
 *
 * @param name = user name
 * @param picture = user picture
 * @returns top page component under the navbar
 */

const WelcomeUser: React.FC<{
  name: string | undefined;
  picture: string | undefined;
}> = ({ name, picture }) => {
  const { token, setToken } = useContext(TokenContext);
  const [quizEmpty, setQuizEmpty] = useState<boolean | null>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkQuizStatus = async () => {
      const result = await isQuizEmpty(token, setToken);
      console.log(result);
      setQuizEmpty(result);
    };

    checkQuizStatus();
  }, []);

  const handleQuizClick = () => {
    navigate("/PreferenceQuiz/FoodRestriction");
  };
  return (
    <>
      <Container fluid className="bg-light p-5 m-0 border-bottom">
        <Row className="justify-content-start" lg={10}>
          <Col xs={3} lg={2}>
            <Image src={picture} roundedCircle fluid />
          </Col>
          <Col xs={9}>
            <Row className="gabriela-regular">Hey {name} !</Row>
            <Row className="josefin-sans">Nice to see you again</Row>

            {!quizEmpty && (
              <Button className="quizButton" onClick={handleQuizClick}>
                For better results fill our quiz
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WelcomeUser;
