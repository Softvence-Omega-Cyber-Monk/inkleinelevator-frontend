import { useLocation } from "react-router-dom";
import Banner from "./LandingPage/Banner";
import ContactSection from "./LandingPage/ContactUs";
import HowItWorks from "./LandingPage/EleventorWorks";
import FAQSection from "./LandingPage/Faq";
import ElevatorLandingPage from "./LandingPage/LandingAbout";
import PricingSection from "./LandingPage/PricingSection";
import WhoItsFor from "./LandingPage/WhoItsFor";
import { useEffect } from "react";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state]);
  return (
    <div className="">
      <Banner />
      <ElevatorLandingPage />
      <HowItWorks />
      <WhoItsFor />
      <PricingSection />
      <section id="contact-us">
        <ContactSection />
      </section>

      <FAQSection />
    </div>
  );
};

export default Home;
