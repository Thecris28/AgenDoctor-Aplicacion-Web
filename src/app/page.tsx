import Caracteristicas from "@/components/landingPage/Caracteristicas";
import Especialidades from "@/components/landingPage/Especialidades";
import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import Hero from "@/components/landingPage/Hero";
import HowItWorks from "@/components/landingPage/HowItWorks";




export default function Home() {
  return (
    <main className="">
      <Header />
      <div className="w-full bg-heroBg flex justify-center">
        <Hero/>
      </div>
      <Features />
      <Caracteristicas />
      <HowItWorks />
      <Especialidades />
      <Footer />
      
    </main>
  );
}
