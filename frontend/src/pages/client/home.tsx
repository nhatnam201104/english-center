import { useRef } from "react";
import ToeicLanding from "../../components/home/toeicLanding";
import ToeicLevel from "../../components/home/toeicLevel";
import FeaturedCourses from "../../components/home/featuredCoureses";
import AiFeedback from "../../components/home/aiFeedBack";
import Roadmap from "../../components/home/roadmap";
import CallToAction from "../../components/home/callToAction";


const Home = () => {
  const toeicLevelRef = useRef<HTMLDivElement>(null);
  const featuredCoursesRef = useRef<HTMLDivElement>(null);

  const scrollToToeicLevel = () => {
    toeicLevelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToCourses = () => {
    featuredCoursesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="w-full">
      <ToeicLanding
        onStartTest={scrollToToeicLevel}
        onViewCourses={scrollToCourses}
      />

      <div ref={toeicLevelRef} className="scroll-mt-28">
        <ToeicLevel />
      </div>

      <div ref={featuredCoursesRef} className="scroll-mt-28">
        <FeaturedCourses />
      </div>

      <AiFeedback />
      <Roadmap />
      <CallToAction />
    </div>
  );
};

export default Home;