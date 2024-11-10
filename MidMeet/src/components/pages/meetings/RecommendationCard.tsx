import Card from "react-bootstrap/Card";
import { recommendationProp } from "../../../apiOperations/meetApi";
import CardGroup from "react-bootstrap/CardGroup";
import Ratings from "react-ratings-declarative";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "./meetings.css";
import { Tooltip } from "@mui/material";
import { Row, Col } from "react-bootstrap";
type Recommendation = {
  recommendationProp: recommendationProp;
  cardkey: number;
  selectedOption: number;
  type: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
};
export default function RecommendationCard({
  recommendationProp,
  cardkey,
  selectedOption,
  type,
  setSelectedOption,
}: Recommendation) {
  return (
    <>
      <span className="badge  cornerNum">{cardkey + 1}</span>

      <CardGroup
        style={{ cursor: "pointer" }}
        className={`meets shadow p-0 pl-2 mb-3 mt-0 m-5 bg-white rounded vh-20 ${
          selectedOption == cardkey ? "active" : ""
        }`}
        onClick={() => setSelectedOption(cardkey)}
      >
        {type !== "activity" && (
          <Card className="meet ">
            <Card.Title className="recommend-title">
              <span className="recommend-text">Food</span>
              <svg
                width="30"
                height="35"
                viewBox="0 0 38 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.58331 41.25C1.58331 42.2625 2.29581 43.125 3.16665 43.125H23.75C24.6366 43.125 25.3333 42.2625 25.3333 41.25V39.375H1.58331V41.25ZM13.4583 16.875C7.52081 16.875 1.58331 20.625 1.58331 28.125H25.3333C25.3333 20.625 19.3958 16.875 13.4583 16.875ZM5.73165 24.375C7.48915 21.4688 11.2258 20.625 13.4583 20.625C15.6908 20.625 19.4275 21.4688 21.185 24.375H5.73165ZM1.58331 31.875H25.3333V35.625H1.58331V31.875ZM28.5 9.375V1.875H25.3333V9.375H17.4166L17.7808 13.125H32.9175L30.7008 39.375H28.5V43.125H31.2233C32.5533 43.125 33.6458 41.9062 33.8041 40.3688L36.4166 9.375H28.5Z"
                  fill="black"
                />
              </svg>
            </Card.Title>
            <Card.Img
              className="meetImg p-2"
              src={`https://places.googleapis.com/v1/${
                recommendationProp.restaurant?.photoRef
              }/media?maxHeightPx=400&maxWidthPx=400&key=${
                import.meta.env.VITE_GOOGLE
              }`}
            />
            <Card.Body style={{ position: "relative" }}>
              <Card.Title>
                {recommendationProp.restaurant?.displayName}
              </Card.Title>
              <Card.Text>
                {recommendationProp.restaurant?.location?.address}
              </Card.Text>
              <div className="links">
                {recommendationProp.restaurant?.url && (
                  <Card.Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={recommendationProp.restaurant?.url}
                  >
                    <Tooltip title="website" placement="top">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-link"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z" />
                      </svg>
                    </Tooltip>
                  </Card.Link>
                )}

                <Card.Link
                  href={`https://www.waze.com/ul?ll=${recommendationProp.restaurant.location.lat},${recommendationProp.restaurant.location.lng}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img width="20" height="20" src="/waze-icon.svg"></img>
                </Card.Link>
                <Card.Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    recommendationProp.restaurant.location.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img width="20" height="20" src="/Google_Maps.svg"></img>
                </Card.Link>
              </div>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col>
                  {recommendationProp.restaurant.rating && (
                    <>
                      <small className="rating text-muted">
                        {recommendationProp.restaurant.rating}
                      </small>

                      <Ratings
                        rating={recommendationProp.restaurant.rating}
                        widgetDimensions="2vh"
                        widgetSpacings="1px"
                      >
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                      </Ratings>
                    </>
                  )}
                </Col>
                <Col>
                  <DropdownButton
                    size="sm"
                    id="dropdown-basic-button"
                    title="Opening Hours"
                    drop="up-centered"
                    className="custom-dropdown"
                  >
                    {recommendationProp.restaurant?.currentOpeningHours.map(
                      (day: string, index: number) => (
                        <Dropdown.Item key={index}>{day}</Dropdown.Item>
                      )
                    )}
                  </DropdownButton>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        )}
        {type !== "food" && (
          <Card className="meet ">
            <Card.Title className="recommend-title">
              <span className="recommend-text">Activity</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="35"
                fill="currentColor"
                className="bi bi-activity"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"
                />
              </svg>
            </Card.Title>
            <Card.Img
              className="meetImg p-2"
              src={`https://places.googleapis.com/v1/${
                recommendationProp.activity?.photoRef
              }/media?maxHeightPx=400&maxWidthPx=400&key=${
                import.meta.env.VITE_GOOGLE
              }`}
            />{" "}
            <Card.Body style={{ position: "relative" }}>
              <Card.Title>
                {recommendationProp.activity?.displayName}
              </Card.Title>
              <Card.Text>
                {recommendationProp.activity?.location?.address}
              </Card.Text>
              <div className="links">
                {recommendationProp.activity?.url && (
                  <Card.Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={recommendationProp.activity?.url}
                  >
                    <Tooltip title="website" placement="top">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-link"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z" />
                      </svg>
                    </Tooltip>
                  </Card.Link>
                )}

                <Card.Link
                  href={`https://www.waze.com/ul?ll=${recommendationProp.activity.location.lat},${recommendationProp.activity.location.lng}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img width="20" height="20" src="/waze-icon.svg"></img>
                </Card.Link>
                <Card.Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    recommendationProp.activity.location.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img width="20" height="20" src="/Google_Maps.svg"></img>
                </Card.Link>
              </div>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col>
                  {recommendationProp.activity.rating && (
                    <>
                      <small className="rating text-muted">
                        {recommendationProp.activity.rating}
                      </small>

                      <Ratings
                        rating={recommendationProp.activity.rating}
                        widgetDimensions="2vh"
                        widgetSpacings="1px"
                      >
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                        <Ratings.Widget widgetRatedColor="gold" />
                      </Ratings>
                    </>
                  )}
                </Col>
                <Col>
                  <DropdownButton
                    size="sm"
                    id="dropdown-basic-button"
                    title="Opening Hours"
                    drop="up-centered"
                  >
                    {recommendationProp.activity?.currentOpeningHours.map(
                      (day: string, index: number) => (
                        <Dropdown.Item key={index}>{day}</Dropdown.Item>
                      )
                    )}
                  </DropdownButton>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        )}
      </CardGroup>
    </>
  );
}
