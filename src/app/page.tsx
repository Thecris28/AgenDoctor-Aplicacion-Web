import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Header />
      <h1>Welcome to the Doctor's Portal</h1>
      <Image src="/doctor.jpg" alt="Doctor" width={500} height={500} />
    </main>
  );
}
