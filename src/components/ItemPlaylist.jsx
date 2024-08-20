import { motion, useMotionValue, Reorder } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import IsPlaying from "./IsPlaying"; // Assure-toi d'importer correctement le composant IsPlaying
import LikeBtn from "./LikeBtn"; // Assure-toi d'importer correctement le composant LikeBtn

import { useRaisedShadow } from "./use-raised-shadow";

const ItemPlaylist = ({
  song,
  index,
  screenWidth,
  selectedMusicObj,
  click,
  like,
  handleDeleteSong,
}) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      value={song}
      id={song}>
      <motion.li
        initial={{ opacity: 0, translateY: 10 }}
        animate={{
          opacity: 1,
          translateY: 1,
          transition: { delay: index * 0.03 },
        }}
        exit={{ opacity: 0, translateY: 10 }}
        style={{ boxShadow, y }}
        className='flex items-center justify-between w-full transition-colors rounded-xl lg:pr-3 hover:bg-black hover:bg-opacity-30'>
        <div className='flex items-center gap-4'>
          <img
            src={song.album}
            alt={`Album: ${song.title}`}
            className='w-14 h-14 rounded-md'
          />
          <div>
            <h1>
              {screenWidth < 1024 && song.title.length > 25
                ? `${song.title.substring(0, 25)}...`
                : song.title}
            </h1>
            <p className='text-[#C2C2C2]'>{song.artist}</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {selectedMusicObj && selectedMusicObj.id === song.id ? (
            <div className='flex items-end justify-end '>
              <span className='h-7'>
                <IsPlaying />
              </span>
            </div>
          ) : (
            <button
              className='text-xl'
              onClick={() => click(song)}>
              <FaPlay />
            </button>
          )}
          <button
            onClick={() => like(song.id, song)}
            className='w-7 h-7'>
            <LikeBtn id={song.id} />
          </button>
          <button
            className='text-3xl text-red-500'
            onClick={() => handleDeleteSong(song.id)}>
            <IoClose />
          </button>
        </div>
      </motion.li>
    </Reorder.Item>
  );
};

export default ItemPlaylist;
