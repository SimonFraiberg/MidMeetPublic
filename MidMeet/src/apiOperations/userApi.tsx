import { RequestProps, request } from "./baseApi";
type ValueProps = {
  email: string;
  password: string;
  confirm: string;
  profilePic: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  firstName: string;
  lastName: string;
};

export type UserProps = {
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
};

const addUser = async (values: ValueProps) => {
  const { confirm, ...userValues } = values;
  const response = await fetch("http://localhost:12345/api/Users", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...userValues }),
  });
  if (!response.ok) return 0;
  return 1;
};

const login = async (email: string, password: string) => {
  const response = await fetch("http://localhost:12345/api/Tokens", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: email, password: password }),
  });

  // Parse the JSON response
  if (response.ok) {
    return (await response.json()).accessToken;
  } else {
    return (await response.json()).error;
  }
};

const logout = async () => {
  await fetch("http://localhost:12345/api/Tokens/logout", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

const login2FA = async (
  email: string,
  password: string,
  twoFactorCode: string
) => {
  const response = await fetch("http://localhost:12345/api/Tokens/2FA", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: email,
      password: password,
      twoFactorCode: twoFactorCode,
    }),
  });
  if (response.ok) {
    return (await response.json()).accessToken;
  } else {
    return (await response.json()).error;
  }
};

const set2FA = async (token: string, setToken: (str: string) => void) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users/2FA`,
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
      if (response) {
        return response;
      } else {
        throw new Error("error with changing 2FA ");
      }
    } catch (error) {
      throw new Error("error with changing 2FA ");
    }
  } catch (error) {
    throw new Error("error with changing 2FA ");
  }
};

const changePassword = async (
  token: string,
  setToken: (str: string) => void,
  newPassword: string,
  oldPassword: string
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users/changePassword`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, oldPassword }),
      },
    };
    try {
      const response = await request(token, setToken, userRequest);
      if (response) {
        return response;
      } else {
        return response;
      }
    } catch (error) {
      throw new Error("error with changing password ");
    }
  } catch (error) {
    throw new Error("error with changing password ");
  }
};

const updateAddress = async (
  token: string,
  setToken: (str: string) => void,
  address: {
    address: string;
    lng: number;
    lat: number;
  }
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users/updateAddress`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address }),
      },
    };
    try {
      const response = await request(token, setToken, userRequest);

      return response;
    } catch (error) {
      throw new Error("error with changing password ");
    }
  } catch (error) {
    throw new Error("error with changing password ");
  }
};

const updateProfilePic = async (
  token: string,
  setToken: (str: string) => void,
  profilePic: string
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users/updateProfilePic`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePic: profilePic }),
      },
    };
    try {
      const response = await request(token, setToken, userRequest);

      return response;
    } catch (error) {
      throw new Error("error with changing password ");
    }
  } catch (error) {
    throw new Error("error with changing password ");
  }
};

const disable2FA = async (
  token: string,
  setToken: (str: string) => void,
  code: string
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Tokens/disable2FA`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      },
    };
    try {
      const response = await request(token, setToken, userRequest);
      return response;
    } catch (error) {
      throw new Error("error with changing 2FA ");
    }
  } catch (error) {
    throw new Error("error with changing 2FA ");
  }
};

const isVerified2FA = async (
  token: string,
  setToken: (str: string) => void,
  code: string
) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Tokens/verify2FA`,
      init: {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      },
    };
    try {
      const response = await request(token, setToken, userRequest);
      return response;
    } catch (error) {
      throw new Error("error with changing 2FA ");
    }
  } catch (error) {
    throw new Error("error with changing 2FA ");
  }
};

const get2FA = async (token: string, setToken: (str: string) => void) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users/2FA`,
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

const getUser = async (token: string, setToken: (str: string) => void) => {
  try {
    //define the request
    const userRequest: RequestProps = {
      input: `http://localhost:12345/api/Users`,
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
      const userResponse = await request(token, setToken, userRequest);

      const { email, firstName, lastName, profilePic, location } = userResponse;
      const user: UserProps = {
        email,
        firstName,
        lastName,
        profilePic,
        location,
      };
      return user;
    } catch (error) {
      throw new Error("user not valid direct to login");
    }
  } catch (error) {
    throw new Error("user not valid direct to login");
  }
};

export {
  isVerified2FA,
  addUser,
  login,
  getUser,
  set2FA,
  get2FA,
  login2FA,
  logout,
  disable2FA,
  changePassword,
  updateProfilePic,
  updateAddress,
};
