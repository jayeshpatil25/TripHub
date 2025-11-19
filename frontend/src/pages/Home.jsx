import bg from "../assets/homeimg.jpg";
import { useAuthStore } from '../store/useAuthStore'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();
    const { authUser } = useAuthStore();
    const handleStartPlanning = () => {
    if (authUser) {
      navigate("/dashboard"); 
    } else {
      navigate("/login");
    }
  };

  return (
    <>
    <div
      className="h-[100vh] bg-cover bg-center relative flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-opacity-50 absolute inset-0" />
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold mb-4">Explore. Plan. Travel.</h1>
        <p className="text-lg mb-6">Your all-in-one trip planner for unforgettable journeys</p>
        <button
          onClick={handleStartPlanning}
          className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Start Planning
        </button>
      </div>
    </div>
    </>
  );
};

export default Home;
