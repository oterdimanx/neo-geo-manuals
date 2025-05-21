import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100">
        <h1 className="text-red-500 font-pixel text-2xl">Manual Editor</h1>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background GIF */}
        <div className="absolute inset-0">
          <img
            src="/Politank-Z-Evening-Animated-Stage-Backgrond-Sprite-GIF-Waku-Waku-7-Neo-Geo.gif"
            alt="Retro background"
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Overlay GIF */}
        <div className="absolute inset-0 pointer-events-none backdrop-blur-sm ">
          <img
            src="/king-of-fighters-animated-fight-158545.gif"
            alt="Electric overlay"
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Centered 404 Message */}
        <div className="relative z-10 opacity-90 flex flex-col items-center justify-center h-full text-white text-center bg-black/30">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold drop-shadow-lg mb-4"
          >
            404
          </motion.h1>
  
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg drop-shadow mb-6"
          >
            This page has vanished into the pixel void.
          </motion.p>
  
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              to="/"
              className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-200 transition"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div></div>
    );
  }