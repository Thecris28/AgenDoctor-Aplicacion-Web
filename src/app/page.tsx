import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import Hero from "@/components/landingPage/Hero";
import HowItWorks from "@/components/landingPage/HowItWorks";




export default function Home() {
  return (
    <main className="">
      <Header />
      <Hero/>
      <Features />
      <HowItWorks />
      <Footer />
      
    </main>
  );
}
