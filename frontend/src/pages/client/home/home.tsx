import React from "react";
import HeroSection from "../../../components/client/HeroSection";
import WhoWeHelp from "../../../components/client/WhoWeHelp";
import OurServices from "../../../components/client/OurServices";
import Howitworks from "../../../components/client/Howitworks";
import Footer from "../../../components/client/Footer";
import Slider from "../../../components/client/Slider";


const Home: React.FC = () => {
    return (
        <main>
            <HeroSection />
            <WhoWeHelp />
            <OurServices />
            <Howitworks />
             <Slider />
            <Footer />
           
            
        </main>
    );
};

export default Home;