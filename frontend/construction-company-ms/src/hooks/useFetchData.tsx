import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, setAccessToken } from "../store/slices/authSlice";
import { refreshAccessToken } from "../utils/refreshToken";

export const useFetchData = (url: string) => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // I dont know if it's a good way to force a component's
  // reload by changing variable in dependency array - but hey, it works :)
  const reloadDataComponent = () => {
    setReload((prev) => !prev);
  };

  const refreshToken = async () => {
    try {
      const newToken = await refreshAccessToken();
      if (!newToken || newToken.token === "") {
        dispatch(logout());
        return false;
      }
      localStorage.setItem("accessToken", newToken.token);
      dispatch(setAccessToken(newToken.token));
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      dispatch(logout());
      return false;
    }
  };

  useEffect(() => {
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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            });

            if (!retryRes.ok) throw new Error("Failed to fetch after refresh");

            const retryResult = await retryRes.json();
            setData(retryResult);
          }
          return;
        }

        if (!res.ok)
          throw new Error(`Request failed with status ${res.status}`);

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token, reload]);

  return { data, error, loading, reloadDataComponent };
};
