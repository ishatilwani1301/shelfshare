import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import shelfsharehome from "../assets/shelfsharehome.jpg"; // Import your image
import Footer from "./Footer";



function Home() {
  const navigate = useNavigate(); // Initialize useNavigate for button actions

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-3xl font-bold text-gray-800 cursor-pointer"
            onClick={() => navigate("/")} // Navigate to home or dashboard
          >

            ShelfShare
          </div>

          {/* Navigation Links and Buttons */}
          <nav className="space-x-4 sm:space-x-6 flex items-center">
            
          
            <button
              onClick={() => navigate("/signup")} // Navigate to Signup page
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")} // Navigate to Login page
              className="text-gray-600 hover:text-yellow-500 font-semibold py-2 px-4 text-sm sm:text-base transition-colors"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
        {/* Image Section (Left) */}
        <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8 lg:pr-12">
         
          <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
             <img
              src={shelfsharehome} // Replace this with the actual path to your image
              alt="Person at a bookshelf"
              className="w-full h-auto object-cover aspect-[4/3] md:aspect-auto" // Adjust aspect ratio as needed
              onError={(e) => {
                // Fallback if image fails to load
                e.target.outerHTML = `
                  <div class="bg-gray-200 h-80 md:h-96 rounded-lg flex items-center justify-center text-gray-500">
                    Image Placeholder: Bookshelf
                  </div>`;
              }}
            />
          </div>
        </div>

        {/* Text Content Section (Right) */}
        <div className="w-full md:w-1/2 text-center md:text-left md:pl-8 lg:pl-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Share your shelf,<br />discover new reads
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Connect with fellow book lovers, share your collection, and explore a world of stories. Join our community today and start your literary journey.
          </p>
          <button
            onClick={() => navigate("/signup")} // Example: navigate to a registration or features page
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Get Started
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;