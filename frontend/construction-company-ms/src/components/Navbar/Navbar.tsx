import { useDispatch, useSelector } from "react-redux";
import image from "../../assets/images/banner.png";
import style from "./Navbar.module.css";
import { RootState } from "../../store/store";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { logout } from "../../store/slices/authSlice";

const Navbar: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submenu, setSubmenu] = useState(false);
  const [menu, setMenu] = useState(false);

  const handleToggleMenu = () => {
    if (submenu) setSubmenu(false);
    setMenu((prev) => !prev);
  };

  const handleToggleSubMenu = () => {
    if (!menu) setMenu(true);
    setSubmenu((prev) => !prev);
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/auth");
  };

  // for better readability I've splitted roles to different return statements
  if (!role) return; // logged out
  if (role === "worker")
    return (
      <nav className={`${style.sidebar} ${menu ? style.closed : ""}`}>
        <ul>
          <li className={style.logo}>
            <img src={image} />
            <button className={style.toggleBtn} onClick={handleToggleMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </svg>
            </button>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
              </svg>
              <span>Panel</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/calendar"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v200h-80v-40H200v400h280v80H200Zm0-560h560v-80H200v80Zm0 0v-80 80ZM560-80v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
              </svg>
              <span>Kalendarz</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
              <span>Profil</span>
            </NavLink>
          </li>
        </ul>
        <button
          className={`${style.dropdownBtn} ${style.logout}`}
          onClick={handleLogOut}
        >
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            <span>Wyloguj</span>
          </a>
        </button>
      </nav>
    );

  if (role === "manager")
    return (
      <nav className={`${style.sidebar} ${menu ? "" : style.closed}`}>
        <ul>
          <li className={style.logo}>
            <img src={image} />
            <button className={style.toggleBtn} onClick={handleToggleMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </svg>
            </button>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
              </svg>
              <span>Panel</span>
            </NavLink>
          </li>
          <li>
            <button className={style.dropdownBtn} onClick={handleToggleSubMenu}>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                </svg>
                <span>Zarządzaj</span>
                <svg
                  className={submenu ? "" : style.rotate}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
              </a>
            </button>
            <ul className={submenu ? style.subMenuShow : style.subMenu}>
              <li>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) => (isActive ? style.active : "")}
                >
                  Kalendarz
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/workers"
                  className={({ isActive }) => (isActive ? style.active : "")}
                >
                  Pracownicy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clients"
                  className={({ isActive }) => (isActive ? style.active : "")}
                >
                  Klienci
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/orders"
                  className={({ isActive }) => (isActive ? style.active : "")}
                >
                  Zlecenia
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/warehouse"
                  className={({ isActive }) => (isActive ? style.active : "")}
                >
                  Magazyny
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
              <span>Profil</span>
            </NavLink>
          </li>
        </ul>
        <button
          className={`${style.dropdownBtn} ${style.logout}`}
          onClick={handleLogOut}
        >
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            <span>Wyloguj</span>
          </a>
        </button>
      </nav>
    );
};

export default Navbar;
