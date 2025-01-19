import { endpoint } from "./endpoints";

export const refreshAccessToken = async () => {
  // DEBUG: console.log("REFRESH IN REFRESH ACCESS TOKEN!");
  try {
    const res = await fetch(endpoint.USER_REFRESH_TOKEN(), {
      method: "POST",
      credentials: "include", // sends cookie with refreshToken to backend
    });

    if (res.status === 401 || res.status === 403) {
      console.log("No token.");
      return { token: "" };
    }

    const data = await res.json();
    return { token: data.token }; // return access token
  } catch (error) {
    console.log(error);
    return { token: "" };
  }
};
