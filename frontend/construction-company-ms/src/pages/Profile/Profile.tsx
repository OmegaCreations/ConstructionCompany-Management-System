import { UserData } from "../../utils/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Loading from "../../components/Loading/Loading";
import Popup from "../../components/Popup/Popup";
import { endpoint } from "../../utils/endpoints";
import { useState } from "react";
import style from "./Profile.module.css";
import useFetchUser from "../../hooks/useFetchUser";

const Profile: React.FC = () => {
  const user: UserData = useSelector((state: RootState) => state.user);
  const { user_id } = useSelector((state: RootState) => state.auth);
  const { error, loading } = useFetchUser(endpoint.USER_GET(user_id));
  //const [isSaving, setIsSaving] = useState(false);

  const [editableData, setEditableData] = useState({
    telefon: user.telefon,
    email: user.email,
  });

  const [errors, setErrors] = useState({
    telefon: "",
    email: "",
  });

  const validateInputs = () => {
    const newErrors = { telefon: "", email: "" };

    // validate phone number
    if (!/^[0-9]*$/.test(editableData.telefon)) {
      newErrors.telefon = "Phone number must contain anly digits.";
    }

    // validate email address
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableData.email)) {
      newErrors.email = "Invalid e-mail format.";
    }

    setErrors(newErrors);
    return !newErrors.telefon && !newErrors.email;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSave = () => {
    if (validateInputs()) {
      // TODO: API save
    }
  };

  if (error) {
    return <Popup type="error" text="Error loading data." />;
  }

  const isManager = user.stanowisko_id === 1;

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.profileContainer}>
          <h1>Your data</h1>
          <p>
            {isManager
              ? "Dane te będą udostępniane każdemu personelowi i Twoim klientom jako dane kontaktowe. Jeśli wystąpią jakiekolwiek problemy, zaktualizuj je poniżej."
              : "Dane te są widoczne dla Twojego menedżera i innego personelu. Jeśli wystąpią jakiekolwiek błędy, skontaktuj się ze swoim menadżerem."}
          </p>
          <div className={style.profileInfo}>
            <div>
              <strong>Name: </strong>
              <input
                type="text"
                value={`${user.imie} ${user.nazwisko}`}
                disabled
                className={style.inputField}
              />
            </div>
            <div>
              <strong>Current position: </strong>
              <input
                type="text"
                value={user.stanowisko_nazwa}
                disabled
                className={style.inputField}
              />
            </div>
            <div>
              <strong>Phone number: </strong>
              <input
                type="text"
                name="telefon"
                value={user.telefon}
                onChange={handleInputChange}
                disabled={!isManager}
                className={`${style.inputField} ${
                  errors.telefon ? style.inputError : ""
                }`}
              />
              {errors.telefon && (
                <span className={style.errorText}>{errors.telefon}</span>
              )}
            </div>
            <div>
              <strong>E-mail: </strong>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                disabled={!isManager}
                className={`${style.inputField} ${
                  errors.email ? style.inputError : ""
                }`}
              />
              {errors.email && (
                <span className={style.errorText}>{errors.email}</span>
              )}
            </div>
          </div>
          {isManager && (
            <button
              onClick={handleSave}
              className={style.saveButton}
              disabled={!!errors.telefon || !!errors.email}
            >
              Save
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
