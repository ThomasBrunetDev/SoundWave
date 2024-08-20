import React from "react";
import { motion } from "framer-motion";
import { useAudioVisual } from "../lib/audiotim"; // Assurez-vous d'importer correctement votre fonction useAudioVisual

const AudioVisualizer = () => {
  const visualInfos = useAudioVisual();
  

  return (
    <div className="flex flex-row-reverse h-9 gap-3 rotate-180">
        
      {visualInfos.map((value, index) => (
        <motion.div
        key={index}
        className="h-20 bg-perso-orangePale w-[20px] relative bottom-0 opacity-50" // Utilisation de classes Tailwind pour styliser la barre
        initial={{ height: 0 }}
        animate={{ height: `${value*2}px`}}
        transition={{ duration: 0.3 }} // Ajustez la durée de l'animation selon vos besoins
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
