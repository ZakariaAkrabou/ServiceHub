import React from "react";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import AboutHero from "./components/AboutHero";
import AboutMission from "./components/AboutMission";
import HowItWorks from "../../../components/client/Howitworks";
import AboutValues from "./components/AboutValues";
import AboutTeam from "./components/AboutTeam";

const About: React.FC = () => {
  return (
    <main>
      <Header />
      <AboutHero />
      <AboutMission />
      <HowItWorks />
      <AboutValues />
        <AboutTeam />
      <Footer />
    </main>
  );
};

export default About;
