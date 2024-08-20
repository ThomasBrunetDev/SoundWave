import { motion } from "framer-motion";
import { BiSolidLeftArrow } from "react-icons/bi";
import { useState } from "react";
import AudioVisualizer from "../AudioVisualizer";

const DetailMusicDesktopExpand = ({ selectedMusicObj, switchChanson }) => {
  const [rightArrowVisible, setRightArrowVisible] = useState(false);
  const [leftArrowVisible, setLeftArrowVisible] = useState(false);

  return (
    <>
      <motion.div
        className='flex flex-col items-center justify-center gap-14 h-[90%] w-full'
        initial={{ display: "none", opacity: 0, translateY: 20 }}
        animate={{
          display: "flex",
          opacity: 1,
          translateY: 1,
          transition: { delay: 0.5, duration: 0.2 },
        }}>
        <span className="absolute bottom-2">
          <AudioVisualizer />
        </span>
        <div className='relative flex items-center justify-center z-50 gap-10'>
          <motion.span
            onMouseEnter={() => setRightArrowVisible(true)}
            onMouseLeave={() => setRightArrowVisible(false)}
            onClick={() => switchChanson('prev')}
            className='flex'>
            <motion.span
              initial={{ opacity: 1 }}
              animate={
                !rightArrowVisible
                  ? {
                      translateX: 0,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
                  : {
                      translateX: -10,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
              }>
              <BiSolidLeftArrow className='text-4xl' />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, translateX: -10 }}
              animate={
                !rightArrowVisible
                  ? {
                      opacity: 0,
                      translateX: -5,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
                  : {
                      opacity: 1,
                      translateX: -17,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
              }
              exit={{ opacity: 0, translateX: -10 }}>
              <BiSolidLeftArrow className='text-4xl' />
            </motion.span>
          </motion.span>

          <div className='z-50 relative flex items-center justify-center'>
            <img
              className='rounded-full'
              src={selectedMusicObj.album.cover_medium}
              alt=''
            />
            <span className='bg-perso-mauveLecteur w-16 h-16 z-10 absolute rounded-full'></span>
          </div>
          <motion.span
            onMouseEnter={() => setLeftArrowVisible(true)}
            onMouseLeave={() => setLeftArrowVisible(false)}
            className='flex z-50'>
            <motion.span
            onClick={() => switchChanson('next')}
              initial={{ opacity: 0, translateX: -10 }}
              animate={
                !leftArrowVisible
                  ? {
                      opacity: 0,
                      translateX: 5,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
                  : {
                      opacity: 1,
                      translateX: 17,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
              }
              exit={{ opacity: 0, translateX: -10 }}>
              <BiSolidLeftArrow className='rotate-180 text-4xl' />
            </motion.span>
            <motion.span
            className="z-50"
              initial={{ opacity: 1 }}
              animate={
                !leftArrowVisible
                  ? {
                      translateX: 0,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
                  : {
                      translateX: 10,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
              }>
              <BiSolidLeftArrow className='rotate-180 text-4xl' />
            </motion.span>
          </motion.span>
        </div>
        <div className='flex flex-col items-center z-50 justify-center gap-2'>
          <h1 className='font-tanker text-4xl'>{selectedMusicObj.title}</h1>
          <div className='flex items-center gap-4'>
            <h2>
              {selectedMusicObj.album.title.length > 30
                ? `${selectedMusicObj.album.title.substring(0, 30)}...`
                : selectedMusicObj.album.title}
            </h2>
            <span className='bg-white h-1.5 w-1.5 rounded-full'></span>
            <h2 className="z-50">{selectedMusicObj.artist.name}</h2>
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default DetailMusicDesktopExpand;
