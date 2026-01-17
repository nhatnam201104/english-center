import { useAuthStore } from "../../stores/auth.store";

const Home = () => {
  const { user } = useAuthStore();
  console.log("Authenticated user:", user);
  return <div>Home Page</div>;
};

export default Home;
