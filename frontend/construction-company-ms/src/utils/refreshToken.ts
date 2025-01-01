import { endpoint } from "./endpoints";

export const refreshAccessToken = async () => {
  try {
    const res = await fetch(endpoint.USER_REFRESH_TOKEN(), {
      method: "POST",
      credentials: "include", // sends cookie with refreshToken to backend
    });

    if (res.status === 401 || res.status === 403) {
      return { token: "" };
    }

    const data = await res.json();
    localStorage.setItem("accessToken", data.token); // store the token in localStorage
    return { token: data.token }; // return access token
  } catch (error) {
    console.log(error);
    return { token: "" };
  }
};
