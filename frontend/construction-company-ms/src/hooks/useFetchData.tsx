import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

// fetch other [get] data
export const useFetchData = (url: string) => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
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
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setData(data);
          setLoading(false);
        })
        .catch((err) => setError(err));
    })(); // self invoking function :)
  }, [url, token]);

  return { data, error, loading };
};
