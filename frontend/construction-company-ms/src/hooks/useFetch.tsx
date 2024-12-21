import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { initialUserState, UserData } from "../utils/types";
import { setUserData } from "../store/slices/userSlice";

// implemented url data fetching hook to prevent copying code
const useFetchUser = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const user: UserData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === initialUserState) {
      // only fetch if there is no user data
      (() => {
        console.log("Hello");
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
            dispatch(setUserData({ userData: data }));
            setData(data);
            setLoading(false);
          })
          .catch((err) => setError(err));
      })(); // self invoking function :)
    }
  }, []);

  return { data, error, loading };
};

export default useFetchUser;
