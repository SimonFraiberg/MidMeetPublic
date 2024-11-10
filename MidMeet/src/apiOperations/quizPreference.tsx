import { request, refresh, RequestProps } from "./baseApi";
const postPreference = async (
  token: string,
  setToken: (str: string) => void,
  preference: {
    foodRestrictions: string[];
    food: string[];
    activities: string[];
  }
) => {
  try {
    //check if there is no access token
    if (token === "failed") {
      //try and get access token
      token = await refresh();
      setToken(token);
    }

    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users/preference`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food: preference.food,
          foodRestrictions: preference.foodRestrictions,
          activities: preference.activities,
        }),
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

const isQuizEmpty = async (token: string, setToken: (str: string) => void) => {
  try {
    //check if there is no access token
    if (token === "failed") {
      //try and get access token
      token = await refresh();
      setToken(token);
    }

    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users/preference`,
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
      const response = await request(token, setToken, userRequest);
      if (response?.food?.length == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log("error");

      return null;
    }
  } catch (error) {
    return null;
  }
};

export { postPreference, isQuizEmpty };
