import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="w-full max-w-6xl min-h-screen bg-gray-100">
          <div id="editor-title" className="relative inline z-[10]">
            <div className="front relative bg-[#222] text-lime-500 text-[8vh] font-black font-serif">
              <div className="absolute top-0 left-0 w-full h-full animate-apptitle"
                style={{
                  background: 'radial-gradient(circle, #222 40%, transparent 40%)',
                  backgroundSize: '.5vh .5vh',
                  backgroundPosition: '-.5vh',
                }}
              />
              <div className="absolute top-[-50px] left-[-10px] w-full h-full text-[#222] [text-shadow:-10px_0px_lime,-1px_-1px_lime,-8px_8px_lime]">
                <h1 className="font-pixel">Manual Editor</h1>
                <div className="droplet absolute left-[64%] top-[77px] transform -translate-x-1/2 mt-2 w-2 h-2 bg-lime-500 rounded-full animate-drip" />
              </div>
            </div>
          </div>
          <div className="relative w-full h-screen overflow-hidden top-[50px]">
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
        </div>
      </div>
    );
  }