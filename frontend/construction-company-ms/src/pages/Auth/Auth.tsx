import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import style from "./Auth.module.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { RootState } from "../../store/store";
import { endpoint } from "../../utils/endpoints";
import { clearUserData } from "../../store/slices/userSlice";

const Auth: React.FC = () => {
  // auth variables
  const { isUserAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // redux hook used for invoking slices functions
  // indicates if frontend is waiting for server response
  const [loading, setLoading] = useState(false);

  // sumbits form data and tries to log in
  const handleSubmit = async (e: React.FormEvent) => {
    dispatch(clearUserData());
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // fetch login endpoint
      const response = await fetch(endpoint.USER_LOGIN(), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, haslo: password }),
      });

      // if status != 200
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Nie udało się zalogować do serwisu.");
        setLoading(false);
        return;
      }

      const { token, role, user_id } = await response.json();
      localStorage.setItem("accessToken", token); // save jwt to local storage
      localStorage.setItem("userRole", role); // save role to local storage
      localStorage.setItem("userID", user_id); // save role to local storage
      dispatch(login({ token, role, user_id }));
      navigate("/dashboard");
    } catch (err) {
      console.error("Błąd podczas logowania:", err);
      setError("Wystąpił błąd. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    if (!isUserAuthenticated || !role) {
      const token: string | null = localStorage.getItem("accessToken");
      const user_role: string | null = localStorage.getItem("userRole");
      const user_id: string | null = localStorage.getItem("userID");

      // Sprawdzamy, czy wszystkie wartości istnieją i są prawidłowe
      if (token && user_role && user_id) {
        console.log(
          "INIT DATA ON LOAD: ",
          token,
          user_role,
          user_id,
          typeof token
        );
        dispatch(login({ token, role: user_role, user_id: Number(user_id) }));
        navigate("/dashboard");
      }
    }
  };

  // we want to run it once on load to check if user has jwt in local storage
  useEffect(() => {
    checkLocalStorage();
  }, []); // blank dependency array for single invoke of hook

  return (
    <div className={style.authContainer}>
      <h2>Witaj ponownie!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="email@company.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="*********"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}
        <button type="submit" disabled={loading}>
          <span>{loading ? "Logowanie..." : "Zaloguj się"}</span>
        </button>
      </form>
    </div>
  );
};

export default Auth;
