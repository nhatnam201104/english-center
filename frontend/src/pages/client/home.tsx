import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToeicLanding from "../../components/home/ToeicLanding";
import ToeicLevel from "../../components/home/ToeicLevel";
import FeaturedCourses from "../../components/home/FeaturedCoureses";
import AiFeedback from "../../components/home/AiFeedBack";
import Roadmap from "../../components/home/Roadmap";
import CallToAction from "../../components/home/CallToAction";
import { useAuthStore } from "../../stores/auth.store";



const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const toeicLevelRef = useRef<HTMLDivElement>(null);
  const featuredCoursesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;
        case "TEACHER":
          navigate("/teacher/courses", { replace: true });
          break;
        case "PARENT":
          navigate("/parent", { replace: true });
          break;
        case "STUDENT":
          navigate("/student/dashboard", { replace: true });
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

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
