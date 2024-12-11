import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// implemented url data fetching hook to prevent copying code
const useGetFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    (() => {
      setLoading(true);
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => setError(err));
    })(); // self invoking function :)
  }, [url]);

  return { data, error, loading };
};

export default useGetFetch;
