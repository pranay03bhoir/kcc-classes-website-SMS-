import Image from "next/image";
import Navbar from "@/components/NavigationBar/NavBar";
import HomeIntroScreen from "@/components/Home/HomeIntroScreen";
import HomePageSectionOne from "@/components/Home/HomePageSectionOne";
import HomePageSectionTwo from "@/components/Home/HomePageSectionTwo";
import HomePageSectionThree from "@/components/Home/HomePageSectionThree";
import HomePageSectionFour from "@/components/Home/HomePageSectionFour";
import AboutOurInstitution from "@/components/Home/AboutOurInstitution";
import MeetOurToppers from "@/components/Home/MeetOurToppers";
import HomePageSectionFive from "@/components/Home/HomePageSectionFive";
import HomePageSectionSix from "@/components/Home/HomePageSectionSix";
import Footer from "@/components/Home/Footer";
export default function Home() {
  return (
    <div className={`overflow-x-hidden`}>
      <div className="">
        <Navbar />
      </div>
      <main className={`pt-40`}>
        <HomeIntroScreen />
      </main>
      <section className={`pt-16`}>
        <HomePageSectionOne />
      </section>
      <section className={`pt-16`}>
        <AboutOurInstitution />
      </section>
      <section className={`pt-16`}>
        <HomePageSectionTwo />
      </section>
      <section className={`pt-32`}>
        <HomePageSectionThree />
      </section>
      <section className={`pt-32`}>
        <HomePageSectionFour />
      </section>
      <section className={`pt-32`}>
        <MeetOurToppers />
      </section>
      <section className={`pt-32`}>
        <HomePageSectionFive />
      </section>
      <section className={`pt-32`}>
        <HomePageSectionSix />
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}
