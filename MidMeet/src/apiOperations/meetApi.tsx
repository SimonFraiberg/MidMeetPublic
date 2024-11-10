import { RequestProps, request } from "./baseApi";

type placeProp = {
  wheelchairAccessibleEntrance: boolean;
  currentOpeningHours: string[];
  priceLevel: string;
  rating: number;
  photoRef: string;
  url: string;
  displayName: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
};

export type recommendationProp = {
  voted: string[];
  activity: placeProp;
  restaurant: placeProp;
};

export type BasicMeetInfo = {
  creator: string;
  date: Date;
  name: string;
};

export type meetProps = {
  _id: string;
  name: string;
  date: Date;
  type: string;
  creator: string;
  participants: [
    {
      email: string;
      location: {
        address: string;
        lat: number;
        lng: number;
      };
    }
  ];
  recommendations: recommendationProp[];
  users: [
    {
      firstName: string;
      lastName: string;
      profilePic: string;
      location: {
        address: string;
        lat: number;
        lng: number;
      };
    }
  ];
};

const createRecommendations = async (
  token: string,
  setToken: (str: string) => void,
  meetId: string
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Meets/${meetId}/createRecommendation`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    };
    try {
      const response = await request(token, setToken, userRequest);
      if (response.errors) {
        return null;
      }
      return response;
    } catch (error) {
      throw new Error("user not valid direct to login");
    }
  } catch (error) {
    throw new Error("user not valid direct to login");
  }
};

const getMeet = async (
  token: string,
  setToken: (str: string) => void,
  meetId: string | undefined
) => {
  if (meetId) {
    try {
      //define the request
      const userRequest: RequestProps = {
        input: `http://localhost:12345/api/Meets/${meetId}`,
        init: {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      };
      try {
        const meetResponse = await request(token, setToken, userRequest);
        const {
          _id,
          creator,
          name,
          type,
          date,
          users,
          participants,
          recommendations,
        } = meetResponse;
        const meet: meetProps = {
          _id,
          name,
          creator,
          type,
          date,
          users,
          participants,
          recommendations,
        };

        return meet;
      } catch (error) {
        throw new Error("user not valid direct to login");
      }
    } catch (error) {
      throw new Error("user not valid direct to login");
    }
  }
};

const getBasicMeetInfo = async (
  token: string,
  setToken: (str: string) => void,
  meetId: string
) => {
  if (meetId) {
    try {
      //define the request
      const userRequest: RequestProps = {
        input: `http://localhost:12345/api/Meets/basic/${meetId}`,
        init: {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      };
      try {
        const meetResponse = await request(token, setToken, userRequest);
        console.log(meetResponse);
        const { name, date, creator } = meetResponse;
        const meet: BasicMeetInfo = {
          name,
          date,
          creator,
        };

        return meet;
      } catch (error) {
        throw new Error("user not valid direct to login");
      }
    } catch (error) {
      throw new Error("user not valid direct to login");
    }
  }
};

const vote = async (
  token: string,
  setToken: (str: string) => void,
  meetId: string,
  choice: number
) => {
  if (meetId) {
    try {
      //define the request
      const userRequest: RequestProps = {
        input: `http://localhost:12345/api/Meets/${meetId}/vote`,
        init: {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ choice: choice }),
        },
      };
      try {
        const recommendationResponse: recommendationProp[] = await request(
          token,
          setToken,
          userRequest
        );

        return recommendationResponse;
      } catch (error) {
        throw new Error("user not valid direct to login");
      }
    } catch (error) {
      throw new Error("user not valid direct to login");
    }
  }
};

const acceptInvite = async (
  token: string,
  setToken: (str: string) => void,
  meetId: string | null,
  location: {
    address: string;
    lat: number;
    lng: number;
  }
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Meets/${meetId}/accept`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: location }),
      },
    };
    try {
      const response = await request(token, setToken, userRequest);
      if (response.errors) {
        return null;
      }
      return response;
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const createMeet = async (
  token: string,
  setToken: (str: string) => void,
  name: string,
  date: Date,
  type: string,
  creatorLocation: {
    address: string;
    lat: number;
    lng: number;
  }
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: ` http://localhost:12345/api/Meets`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          date: date,
          type: type,
          creatorLocation: creatorLocation,
        }),
      },
    };

    const response = await request(token, setToken, userRequest);
    const { _id } = response;
    console.log(_id);
    return _id;
  } catch (error) {
    throw new Error("error with getting 2FA ");
  }
};

const sendInvite = async (
  token: string,
  setToken: (str: string) => void,
  meetId: string,
  sendEmail: string
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: ` http://localhost:12345/api/Meets/${meetId}/send`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sendEmail: sendEmail }),
      },
    };
    try {
      const response = await request(token, setToken, userRequest);

      if (response === true) {
        return true;
      }
      if (response === false) {
        return false;
      } else {
        throw new Error("error with getting 2FA ");
      }
    } catch (error) {
      throw new Error("error with getting 2FA ");
    }
  } catch (error) {
    throw new Error("error with getting 2FA ");
  }
};

const getAllMeetings = async (
  token: string,
  setToken: (str: string) => void
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Meets`,
      init: {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    };

    const allMeets: meetProps[] = await request(token, setToken, userRequest);

    return allMeets;
  } catch (error) {
    throw new Error("error in getting meetings from the server");
  }
};

export {
  acceptInvite,
  getMeet,
  getBasicMeetInfo,
  createRecommendations,
  sendInvite,
  vote,
  createMeet,
  getAllMeetings,
};
