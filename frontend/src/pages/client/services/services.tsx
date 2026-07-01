import React from "react";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import ServicesPageHeader from "../../../components/client/services/ServicesPageHeader";

import ServicesSection from "../../../components/client/services/ServicesSection";


const Services: React.FC = () => {
  return (
    <main>
        <Header />
        <ServicesPageHeader />
        <ServicesSection />
        <Footer />
    </main>

  );
};

export default Services;
