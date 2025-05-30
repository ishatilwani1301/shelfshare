import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../components/Home.css"; // Ensure you have the correct path to your CSS file

function Home() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden bg-gray-900">
      {/* Animated Background Lines */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
            d="M0,160L60,165.3C120,171,240,181,360,186.7C480,192,600,192,720,186.7C840,181,960,171,1080,165.3C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,160L60,165.3C120,171,240,181,360,186.7C480,192,600,192,720,186.7C840,181,960,171,1080,165.3C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
                M0,160L60,180C120,200,240,240,360,250C480,260,600,240,720,220C840,200,960,180,1080,170C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
                M0,160L60,165.3C120,171,240,181,360,186.7C480,192,600,192,720,186.7C840,181,960,171,1080,165.3C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
              "
            />
          </path>
        </svg>
      </div>

      {/* Content */}
      <header className="text-center mb-12 relative z-10">
        <h1 className="text-6xl font-extrabold mb-6 tracking-wide">
          Welcome to <span className="text-yellow-400">LocalReads</span>
        </h1>
        <p className="text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Your gateway to discovering, borrowing, and buying books from an exclusive, curated collection. 
          Join us to explore a world of stories and knowledge.
        </p>
      </header>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 relative z-10">
        <button
          className="bg-yellow-500 text-indigo-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
          onClick={() => navigate("/login")} // Navigate to Login page
        >
          Login
        </button>
        <button
          className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-105"
          onClick={() => navigate("/signup")} // Navigate to Signup page
        >
          Signup
        </button>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-300 relative z-10">
        <p>© 2025 <span className="font-semibold text-white">LocalReads</span>. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy" className="hover:underline">Privacy Policy</a> | 
          <a href="/terms" className="hover:underline ml-2">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

export default Home;