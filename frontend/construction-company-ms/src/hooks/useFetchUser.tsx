import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { initialUserState, UserData } from "../utils/types";
import { setUserData } from "../store/slices/userSlice";
import { logout, setAccessToken } from "../store/slices/authSlice";
import { refreshAccessToken } from "../utils/refreshToken";

// implemented url data fetching hook to prevent copying code
const useFetchUser = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const user: UserData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Function to refresh the access token
  const refreshToken = async () => {
    const newToken = await refreshAccessToken();
    if (newToken.token === "") {
      dispatch(logout());
      return false;
    } else {
      localStorage.setItem("accessToken", newToken.token);
      dispatch(setAccessToken(newToken.token));
      return true;
    }
  };

  useEffect(() => {
    if (user === initialUserState) {
      // only fetch if there is no user data
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
              // Retry fetch with new token
              const retryRes = await fetch(url, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              });

              if (!retryRes.ok)
                throw new Error("Failed to fetch after refresh");

              const retryData = await retryRes.json();
              dispatch(setUserData({ userData: retryData }));
              setData(retryData);
            }
            return;
          }

          if (!res.ok)
            throw new Error(`Request failed with status ${res.status}`);

          const data = await res.json();
          dispatch(setUserData({ userData: data }));
          setData(data);
        } catch (err) {
          console.error("Fetch error:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [url, token, user, dispatch]);

  return { data, error, loading };
};

export default useFetchUser;
