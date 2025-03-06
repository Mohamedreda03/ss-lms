import Banks from "@/components/Banks";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import YearsCourses from "@/components/YearsCourses";

export default async function Home() {
  return (
    <div>
      <Hero />
      <WhyUs />
      <Banks />
      <YearsCourses />
    </div>
  );
}
