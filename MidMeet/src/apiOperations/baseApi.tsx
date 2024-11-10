export type RequestProps = {
  input: RequestInfo | URL;
  init?: RequestInit | undefined;
};

const request = async (
  token: string,
  setToken: (str: string) => void,
  args: RequestProps
) => {
  token;
  const { input, init } = args;

  const response = await fetch(input, init);
  //if token is not valid
  if (response.status === 401) {
    //try using the refresh token to get new access token and try again
    const newTokenResponse = await refresh();
    if (newTokenResponse === "Unauthorized") {
      throw new Error("token not valid");
    } else {
      setToken(newTokenResponse);
      const response = await fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${newTokenResponse}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
      }
    }
  } else {
    return await response.json();
  }
};

const refresh = async () => {
  //get new access token with refresh token
  const response = await fetch(`http://localhost:12345/api/Tokens/refresh`, {
    method: "get",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return (await response.json()).accessToken;
  } else {
    return (await response.json()).error;
  }
};

export { request, refresh };
