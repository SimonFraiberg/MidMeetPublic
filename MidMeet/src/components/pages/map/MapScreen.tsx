"use client";

import "./personStyle.css";
import {
  createRecommendations,
  meetProps,
  recommendationProp,
} from "../../../apiOperations/meetApi";
import { Tooltip } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { TokenContext } from "../../../App";
import { format } from "date-fns";
import { Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import RecommendationCard from "../meetings/RecommendationCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import MidMeetNavbar from "../../midMeetNavbar/MidMeetNavbar";
import copy from "copy-to-clipboard";
import Poll from "../../poll/Poll";
import currentUser from "../../../currentUser";
import InviteButton from "../../invitation/inviteButton";
import { useParams } from "react-router-dom";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import currentMeet from "../../../currentMeet";
type userMarkerProps = {
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  firstName: string;
  lastName: string;
  profilePic: string;
};

type locationType = {
  lat: number;
  lng: number;
};

export default function MapScreen() {
  const { meetId } = useParams();

  const [selectedOption, setSelectedOption] = useState(0);
  const [currentWinner, setCurrentWinner] = useState<recommendationProp>();
  const [userMarkers, setuserMarkers] = useState<userMarkerProps[]>([]);
  const [center, setCenter] = useState<locationType>();

  const [selectedMarker, setSelectedMarker] = useState<userMarkerProps | null>(
    null
  );
  const [recommendationMarkers, setRecommendationMarkers] = useState<
    recommendationProp[]
  >([]);
  const [selectedActivity, setselectedActivity] =
    useState<recommendationProp | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<recommendationProp | null>(null);

  const { setToken, token } = useContext(TokenContext);
  const { user } = currentUser(token, setToken);
  const { meetData } = currentMeet(token, setToken, meetId);
  useEffect(() => {
    async function fetchData() {
      if (meetData) {
        console.log("toko,", meetData.participants[0].location.lat);
        let totalLat = 0;
        let totalLng = 0;

        meetData.participants.forEach((participant) => {
          totalLat += participant.location.lat;
          totalLng += participant.location.lng;
        });

        setCenter({
          lat: totalLat / meetData.participants.length,
          lng: totalLng / meetData.participants.length,
        });
        try {
          if (meetData && meetData.users) {
            const userMarkerProps = meetData.users.map((user) => ({
              location: {
                address: user.location.address,
                lat: user.location.lat,
                lng: user.location.lng,
              },
              firstName: user.firstName,
              lastName: user.lastName,
              profilePic: user.profilePic,
            }));
            setuserMarkers(userMarkerProps);

            if (
              meetData.recommendations &&
              meetData.recommendations.length > 0
            ) {
              setRecommendationMarkers(meetData.recommendations);
              const mostVotedRecommendation = meetData.recommendations.reduce(
                (prev, current) =>
                  prev.voted.length > current.voted.length ? prev : current,
                meetData.recommendations[0]
              );

              setCurrentWinner(mostVotedRecommendation);
            }
          } else {
            console.error("Invalid response structure", meetData);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    }
    fetchData();
  }, [token, meetData]);

  console.log("center", center);
  const copyToClipboard = () => {
    let isCopy = copy(`http://localhost:12345/api/Meets/${meetId}/accept`);
    if (isCopy) {
      toast.success("Copied Invitation link to Clipboard");
    }
  };

  const addToGoogleCalendar = () => {
    if (currentWinner && meetData) {
      const startTime = format(new Date(meetData.date), "yyyyMMdd'T'HHmmss'Z'");
      const endTime = format(
        new Date(new Date(meetData.date).getTime() + 2 * 60 * 60 * 1000),
        "yyyyMMdd'T'HHmmss'Z'"
      );
      const location = currentWinner.restaurant.location.address;

      let description = "";

      // Determine the description based on the meet type
      if (meetData.type === "food") {
        description = currentWinner.restaurant.displayName;
      } else if (meetData.type === "activity") {
        description = currentWinner.activity.displayName;
      } else if (meetData.type === "both") {
        description = `${currentWinner.activity.displayName} and ${currentWinner.restaurant.displayName}`;
      }

      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        meetData.name
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
        description
      )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

      window.open(
        calendarUrl,
        "googleCalendarPopup",
        "width=600,height=600,scrollbars=yes,resizable=yes"
      );
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
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
      <MidMeetNavbar></MidMeetNavbar>
      <Container fluid className="map meetScreen">
        <Row>
          <Col sm={6}>
            <Row className="p-3 j">
              {meetData && (
                <Card className=" ">
                  <Card.Body>
                    <Row>
                      <Col sm={7}>
                        <Card.Title>
                          <b>{meetData.name}</b>
                        </Card.Title>
                        <Card.Text>
                          {format(meetData.date, "yyyy, MMMM do, EEEE, h:mm a")}
                        </Card.Text>
                        <Card.Text>
                          <strong>{meetData.users.length} Participants:</strong>
                        </Card.Text>
                        <Row>
                          <Row className="participants-row">
                            {meetData.users.map((user, index) => (
                              <Col
                                key={index}
                                xs={6}
                                lg={3}
                                className="text-center"
                              >
                                <Image
                                  src={user.profilePic}
                                  roundedCircle
                                  className="meetProfileImages"
                                />
                                <p
                                  style={{
                                    margin: "0px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    textAlign: "center",
                                  }}
                                >{`${user.firstName} ${user.lastName}`}</p>
                              </Col>
                            ))}
                          </Row>
                          <ButtonGroup>
                            <Button
                              className="meetingButton"
                              onClick={copyToClipboard}
                            >
                              Invite Link&nbsp;
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-clipboard"
                                viewBox="0 0 16 16"
                              >
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                              </svg>
                            </Button>
                            <InviteButton meetId={meetId} />
                            {meetData?.creator == user?.email && (
                              <Button
                                className="meetingButton"
                                disabled={isLoading} // Disable button while loading
                                onClick={async () => {
                                  setIsLoading(true); // Start loading animation
                                  if (meetId)
                                    try {
                                      const recommendations =
                                        await createRecommendations(
                                          token,
                                          setToken,
                                          meetId
                                        );
                                      if (recommendations != null) {
                                        setRecommendationMarkers(
                                          recommendations
                                        );
                                        toast.success(
                                          "you have new recommendations"
                                        );
                                      } else {
                                        toast.error(
                                          "failed to get recommendations"
                                        );
                                      }
                                    } finally {
                                      setIsLoading(false); // Stop loading animation after execution (success or failure)
                                    }
                                }}
                              >
                                Reccomend Me&nbsp;
                                {isLoading ? (
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  ""
                                )}
                                {!isLoading && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-search-heart"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018" />
                                    <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11" />
                                  </svg>
                                )}
                              </Button>
                            )}
                          </ButtonGroup>
                        </Row>
                        <div className="add-calender">
                          <Tooltip
                            title="Add Current Winner To Calender"
                            placement="top"
                          >
                            <IconButton
                              onClick={addToGoogleCalendar}
                              disabled={!currentWinner}
                            >
                              <InsertInvitationIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </Col>
                      <Col sm={5}>
                        {recommendationMarkers.length > 0 && meetId && (
                          <Poll
                            recommendations={recommendationMarkers}
                            meetId={meetId}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Row>
            <Row className="overflow-auto meetContainer">
              {meetData &&
                recommendationMarkers.map((recommendation, index) => (
                  <RecommendationCard
                    key={index}
                    cardkey={index}
                    type={meetData?.type}
                    recommendationProp={recommendation}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />
                ))}
            </Row>
          </Col>

          <Col sm={6}>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE}>
              <div className="mapContainer">
                {center && (
                  <Map
                    className="google-map"
                    defaultCenter={center}
                    defaultZoom={9}
                    mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
                  >
                    {userMarkers.length > 0 &&
                      recommendationMarkers.length > 0 && (
                        <Directions
                          userMarkers={userMarkers}
                          recommendations={recommendationMarkers}
                          selectedOption={selectedOption}
                          meet={meetData}
                        />
                      )}
                    {userMarkers.map((marker, index) => (
                      <AdvancedMarker
                        key={index}
                        position={{
                          lat: marker.location.lat,
                          lng: marker.location.lng,
                        }}
                        onClick={() => setSelectedMarker(marker)}
                      >
                        <img
                          className="marker"
                          src={marker.profilePic}
                          width={32}
                          height={32}
                          alt="Profile"
                        />
                      </AdvancedMarker>
                    ))}
                    {recommendationMarkers.length > 0 && (
                      <>
                        {meetData?.type !== "food" && (
                          <AdvancedMarker
                            key={selectedOption}
                            position={{
                              lat: recommendationMarkers[selectedOption]
                                .activity.location.lat,
                              lng: recommendationMarkers[selectedOption]
                                .activity.location.lng,
                            }}
                            onClick={() =>
                              setselectedActivity(
                                recommendationMarkers[selectedOption]
                              )
                            }
                          >
                            <img
                              className="marker"
                              src={`https://places.googleapis.com/v1/${
                                recommendationMarkers[selectedOption].activity
                                  .photoRef
                              }/media?maxHeightPx=400&maxWidthPx=400&key=${
                                import.meta.env.VITE_GOOGLE
                              }`}
                              width={32}
                              height={32}
                              alt="activity"
                            />
                          </AdvancedMarker>
                        )}
                        {meetData?.type !== "activity" && (
                          <AdvancedMarker
                            key={selectedOption + 1}
                            position={{
                              lat: recommendationMarkers[selectedOption]
                                .restaurant.location.lat,
                              lng: recommendationMarkers[selectedOption]
                                .restaurant.location.lng,
                            }}
                            onClick={() =>
                              setSelectedRestaurant(
                                recommendationMarkers[selectedOption]
                              )
                            }
                          >
                            <img
                              className="marker"
                              src={`https://places.googleapis.com/v1/${
                                recommendationMarkers[selectedOption].restaurant
                                  .photoRef
                              }/media?maxHeightPx=400&maxWidthPx=400&key=${
                                import.meta.env.VITE_GOOGLE
                              }`}
                              width={32}
                              height={32}
                              alt="restaurant"
                            />
                          </AdvancedMarker>
                        )}
                      </>
                    )}

                    {selectedMarker && (
                      <InfoWindow
                        position={{
                          lat: selectedMarker.location.lat,
                          lng: selectedMarker.location.lng,
                        }}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div>
                          <p>{`${selectedMarker.firstName} ${selectedMarker.lastName}`}</p>
                          <p>{selectedMarker.location.address}</p>
                        </div>
                      </InfoWindow>
                    )}

                    {selectedActivity && (
                      <InfoWindow
                        position={{
                          lat: selectedActivity.activity.location.lat,
                          lng: selectedActivity.activity.location.lng,
                        }}
                        onCloseClick={() => setselectedActivity(null)}
                      >
                        <div>
                          <p>{`${selectedActivity.activity.displayName}`}</p>
                          <p>{selectedActivity.activity.location.address}</p>
                        </div>
                      </InfoWindow>
                    )}

                    {selectedRestaurant && (
                      <InfoWindow
                        position={{
                          lat: selectedRestaurant.restaurant.location.lat,
                          lng: selectedRestaurant.restaurant.location.lng,
                        }}
                        onCloseClick={() => setSelectedRestaurant(null)}
                      >
                        <div>
                          <p>{`${selectedRestaurant.restaurant.displayName}`}</p>
                          <p>
                            {selectedRestaurant.restaurant.location.address}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                )}
              </div>
            </APIProvider>
          </Col>
        </Row>
      </Container>
    </>
  );
}

type DirectionsProps = {
  userMarkers: userMarkerProps[];
  recommendations: recommendationProp[];
  selectedOption: number;
  meet: meetProps | undefined;
};

function Directions({
  userMarkers,
  recommendations,
  selectedOption,
  meet,
}: DirectionsProps) {
  const map = useMap();

  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderers, setDirectionsRenderers] = useState<
    google.maps.DirectionsRenderer[]
  >([]);

  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ]; // Array of colors

  useEffect(() => {
    if (!routesLibrary || !map) return;
    // Clear previous renderers
    directionsRenderers.forEach((renderer) => {
      renderer.setMap(null);
    });
    const newDirectionsService = new routesLibrary.DirectionsService();
    const newRenderers = userMarkers.map(
      (_, index) =>
        new routesLibrary.DirectionsRenderer({
          preserveViewport: true,
          map,
          polylineOptions: {
            strokeColor: colors[index % colors.length], // Assign different color
          },
        })
    );

    // Add the extra renderer for the final route
    newRenderers.push(
      new routesLibrary.DirectionsRenderer({
        preserveViewport: true,
        map,
        polylineOptions: {
          strokeColor: colors[userMarkers.length % colors.length], // Assign the next color
        },
      })
    );

    setDirectionService(newDirectionsService);
    setDirectionsRenderers(newRenderers);

    return () => {
      // Clear the renderers on cleanup
      newRenderers.forEach((renderer) => renderer.setMap(null));
    };
  }, [routesLibrary, map, userMarkers, recommendations]);

  useEffect(() => {
    if (!directionsService || directionsRenderers.length === 0) return;

    // Clear previous directions
    directionsRenderers.forEach((renderer) => renderer.setMap(null));

    // Set new directions for each user
    if (meet?.type == "food") {
      userMarkers.forEach((user, index) => {
        directionsService
          .route({
            origin: {
              lat: user.location.lat,
              lng: user.location.lng,
            },
            destination: {
              lat: recommendations[selectedOption].restaurant.location.lat,
              lng: recommendations[selectedOption].restaurant.location.lng,
            },
            travelMode: google.maps.TravelMode.DRIVING,
          })
          .then((response) => {
            directionsRenderers[index].setDirections(response);
            directionsRenderers[index].setMap(map); // Set the map again
          });
      });
    }

    if (meet?.type == "activity") {
      userMarkers.forEach((user, index) => {
        directionsService
          .route({
            origin: {
              lat: user.location.lat,
              lng: user.location.lng,
            },
            destination: {
              lat: recommendations[selectedOption].activity.location.lat,
              lng: recommendations[selectedOption].activity.location.lng,
            },
            travelMode: google.maps.TravelMode.DRIVING,
          })
          .then((response) => {
            directionsRenderers[index].setDirections(response);
            directionsRenderers[index].setMap(map); // Set the map again
          });
      });
    }

    // Set the directions for the route between the restaurant and the activity
    if (meet?.type == "both") {
      directionsService
        .route({
          origin: {
            lat: recommendations[selectedOption].restaurant.location.lat,
            lng: recommendations[selectedOption].restaurant.location.lng,
          },
          destination: {
            lat: recommendations[selectedOption].activity.location.lat,
            lng: recommendations[selectedOption].activity.location.lng,
          },
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
          directionsRenderers[userMarkers.length].setDirections(response);
          directionsRenderers[userMarkers.length].setMap(map); // Set the map again
        });
    }
    var bounds = new google.maps.LatLngBounds();
    let i = 0;
    for (i = 0; i < userMarkers.length; i++) {
      bounds.extend({
        lat: userMarkers[i].location.lat,
        lng: userMarkers[i].location.lng,
      });
    }
    if (meet?.type == "both") {
      bounds.extend({
        lat: recommendations[selectedOption]?.activity?.location.lat,
        lng: recommendations[selectedOption]?.activity?.location.lng,
      });
      bounds.extend({
        lat: recommendations[selectedOption]?.restaurant?.location.lat,
        lng: recommendations[selectedOption]?.restaurant?.location.lng,
      });
    }

    if (meet?.type == "activity") {
      bounds.extend({
        lat: recommendations[selectedOption]?.activity?.location.lat,
        lng: recommendations[selectedOption]?.activity?.location.lng,
      });
    }

    if (meet?.type == "food") {
      bounds.extend({
        lat: recommendations[selectedOption]?.restaurant?.location.lat,
        lng: recommendations[selectedOption]?.restaurant?.location.lng,
      });
    }

    if (map) {
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds, 100);
    }
  }, [
    directionsService,
    directionsRenderers,
    userMarkers,
    recommendations,
    selectedOption,

    map,
  ]);

  return null; // No need to render anything else
}
