import { UserData } from "../../utils/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Loading from "../../components/Loading/Loading";
import { endpoint } from "../../utils/endpoints";
import style from "@/Profile.module.css";
import useFetchUser from "../../hooks/useFetchUser";

const Profile: React.FC = () => {
  const user: UserData = useSelector((state: RootState) => state.user);
  const { user_id } = useSelector((state: RootState) => state.auth);
  const { error, loading } = useFetchUser(endpoint.USER_GET(user_id));

  const isManager = user.stanowisko_id === 1;
  if (error) return <h1>Coś poszło nie tak.</h1>;
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.profileContainer}>
          <h1>Twój profil</h1>
          <p>
            {isManager
              ? "Dane te będą udostępniane każdemu personelowi i Twoim klientom jako dane kontaktowe. Jeśli wystąpią jakiekolwiek problemy, zaktualizuj je w zakładce pracownicy."
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
                disabled={true}
                className={`${style.inputField}`}
              />
            </div>
            <div>
              <strong>E-mail: </strong>
              <input
                type="email"
                name="email"
                value={user.email}
                disabled={true}
                className={`${style.inputField}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
