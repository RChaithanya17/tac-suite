import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { CourseSlider } from "@/components/CourseSlider";
import { SkillsSection } from "@/components/SkillsSection";
import { IndustriesSection } from "@/components/IndustriesSection";
import { CertificateSection } from "@/components/CertificateSection";
import { GovCertSection } from "@/components/GovCertSection";
import { PlacementSection } from "@/components/RealJobs";
import PeopleSection from "@/components/Placed";
import { PartnersSection } from "@/components/Rectangles";
import { ChallengeSection } from "@/components/Lakh";
import { Footer } from "@/components/Footer";
import { StudentWorks } from "@/components/StudentWorks";
import TutorsSection from "@/components/Tutors";

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero â€” no ID needed, logo click scrolls to top */}
      <HeroSection />

      {/* Cohorts */}
      <section id="courses">
        <CourseSlider />
      </section>

      {/* Skills */}
      <section id="skills">
        <SkillsSection />
      </section>

      {/* Portfolio / Student Works */}
      <section id="student-works">
        <StudentWorks />
      </section>


      <ChallengeSection />
      
      <PeopleSection />
      <IndustriesSection />
      <CertificateSection />
      <GovCertSection />

      {/* Placements */}
      <section id="placements">
        <PlacementSection />
      </section>

      <PartnersSection />
      <TutorsSection/>
      {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4019.3058919765494!2d78.3911328!3d17.4502143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x800fe4a42c7516db%3A0x5509ee9a0a7e78fc!2sTAC%20-%20The%20Art%20Code!5e1!3m2!1sen!2sin!4v1776323750248!5m2!1sen!2sin" width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> */}
      <Footer />
    </main>
  );
}