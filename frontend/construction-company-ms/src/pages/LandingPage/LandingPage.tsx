import style from "./LandingPage.module.css";

const LandingPage: React.FC = () => {
  return (
    <div className={`${style.landingContainer}`}>
      <div className={`${style.navBar} ${style.animated} ${style.fromLeft}`}>
        <h3>CCMSystems</h3>
      </div>
      <section className={style.hero}>
        Strong Systems for Stronger Structures.
      </section>
    </div>
  );
};

export default LandingPage;
