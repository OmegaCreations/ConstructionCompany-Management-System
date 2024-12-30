import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

// fetch other [get] data
export const useFetchData = (url: string) => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // I dont know if its a good way to force a component's
  // reload by changing variable in dependency array - but hey, it works :)
  const reloadDataComponent = () => {
    setReload(true);
  };

  useEffect(() => {
    setReload(false);
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
          if (res.status === 401) {
            // unauthorized -> logout
            dispatch(logout());
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setData(data);
          setLoading(false);
        })
        .catch((err) => setError(err));
    })(); // self invoking function :)
  }, [url, token, reload]);

  return { data, error, loading, reloadDataComponent };
};
