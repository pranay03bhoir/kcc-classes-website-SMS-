import Image from "next/image";
import Navbar from "@/components/NavigationBar/NavBar";
import HomeIntroScreen from "@/components/Home/HomeIntroScreen";
import HomePageSectionOne from "@/components/Home/HomePageSectionOne";
import HomePageSectionTwo from "@/components/Home/HomePageSectionTwo";

export default function Home() {
  return (
    <>
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
        <HomePageSectionTwo />
      </section>
    </>
  );
}
