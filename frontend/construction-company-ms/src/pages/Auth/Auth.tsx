import { useState } from "react";
import { useNavigate } from "react-router";
import style from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";

const Auth: React.FC = () => {
  // auth variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // redux hook used for invoking slices functions
  // indicates if frontend is waiting for server response
  const [loading, setLoading] = useState(false);

  // sumbits form data and tries to log in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // fetch login endpoint
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
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

      const { token, role } = await response.json();
      localStorage.setItem("jwt", token); // save jwt to local storage
      dispatch(login({ token, role }));
      navigate("/dashboard");
    } catch (err) {
      console.error("Błąd podczas logowania:", err);
      setError("Wystąpił błąd. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

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
