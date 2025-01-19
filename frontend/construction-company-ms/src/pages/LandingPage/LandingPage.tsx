import style from "./LandingPage.module.css";
import heroImg from "../../assets/images/hero.png";
import { useNavigate } from "react-router";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={`${style.landingContainer}`}>
      <div className={`${style.navBar} ${style.animated} ${style.fromLeft}`}>
        <h3>CCMSystems</h3>
        <button
          className={`${style.logBtn} ${style.animatedReversed} ${style.fromTop}`}
          onClick={() => navigate("/auth")}
        >
          Log In
        </button>
      </div>
      <section className={style.hero}>
        <div className={style.heroLeft}>
          <h1 className={"fadeIn"}>Strong Systems for Stronger Structures.</h1>
          <div
            className={`${style.heroBtn} ${style.animated} ${style.fromLeft}`}
            onClick={() => navigate("/auth")}
          >
            Log in
          </div>
          <div
            className={`${style.heroBtn} ${style.animated} ${style.fromLeft}`}
            onClick={() => navigate("/auth")}
          >
            Contact Sales
          </div>
        </div>
        <div className={style.heroRight}>
          <img className={"fadeIn"} src={heroImg} />
        </div>

        <div>
          <svg
            className={`${style.blob} fadeIn`}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="#C6AC8F">
              <animate
                attributeName="d"
                calcMode={"paced"}
                dur={"20000ms"}
                repeatCount={"indefinite"}
                values="
            M48,-44.1C60.3,-35.7,67,-17.9,64.2,-2.8C61.4,12.2,49,24.5,36.7,36.6C24.5,48.8,12.2,61,-0.5,61.5C-13.2,62,-26.4,50.8,-35.6,38.6C-44.8,26.4,-49.9,13.2,-51.5,-1.7C-53.2,-16.6,-51.5,-33.2,-42.3,-41.6C-33.2,-50,-16.6,-50.2,0.6,-50.8C17.9,-51.5,35.7,-52.5,48,-44.1Z;

            M46.1,-46.2C59,-33.1,68.3,-16.6,66.4,-1.9C64.6,12.8,51.4,25.5,38.5,34.2C25.5,42.9,12.8,47.6,0.5,47.1C-11.8,46.6,-23.6,41,-37.1,32.3C-50.6,23.6,-65.7,11.8,-70.1,-4.4C-74.4,-20.5,-68,-41,-54.5,-54.1C-41,-67.1,-20.5,-72.8,-2,-70.8C16.6,-68.8,33.1,-59.3,46.1,-46.2Z;

            M37.7,-39.9C48.1,-27.4,55,-13.7,50.3,-4.7C45.7,4.4,29.4,8.8,19.1,19.4C8.8,30,4.4,46.7,-1.3,48C-7,49.3,-14.1,35.2,-22,24.7C-29.9,14.1,-38.7,7,-46.1,-7.4C-53.5,-21.8,-59.4,-43.6,-51.5,-56.1C-43.6,-68.5,-21.8,-71.6,-4,-67.6C13.7,-63.5,27.4,-52.4,37.7,-39.9Z;

            M48,-44.1C60.3,-35.7,67,-17.9,64.2,-2.8C61.4,12.2,49,24.5,36.7,36.6C24.5,48.8,12.2,61,-0.5,61.5C-13.2,62,-26.4,50.8,-35.6,38.6C-44.8,26.4,-49.9,13.2,-51.5,-1.7C-53.2,-16.6,-51.5,-33.2,-42.3,-41.6C-33.2,-50,-16.6,-50.2,0.6,-50.8C17.9,-51.5,35.7,-52.5,48,-44.1Z;
            "
              ></animate>
            </path>
          </svg>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#81B29A" d="" transform="translate(100 100)" />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
