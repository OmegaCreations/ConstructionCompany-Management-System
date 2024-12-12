import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router";
import { UserData } from "../utils/types";

// implemented url data fetching hook to prevent copying code
const useGetFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const user: UserData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
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
            if (res.status !== 200) {
              dispatch(logout());
              navigate("/auth");
            }
            return res.json();
          })
          .then((data) => {
            console.log("AAAA: ", data);
            setData(data);
            setLoading(false);
          })
          .catch((err) => setError(err));
      })(); // self invoking function :)
    }
  }, []);

  return { data, error, loading };
};

export default useGetFetch;
