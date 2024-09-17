import { motion } from "framer-motion";
import PlayPauseButton from "../PlayPauseButton";
import LikeBtn from "../LikeBtn";
import { useMusic } from "../../context/musicContext";
const ChansonsAimee = ({ index, chanson, handleDeleteLikedSong }) => {
  const { addMusicPlaying, selectedMusicObj } = useMusic();

  return (

    <>
    
      <motion.li
        
        initial={{ scale: 0 }}
        transition={{ delay: index * 0.1, duration: .05, type: "spring", stiffness: 260, damping: 20, }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className='flex flex-col gap-2 items-center'
        key={chanson.id}>
        <div className='relative justify-center flex items-center'>
          {chanson.album && (
            <img
              className='rounded-full w-40'
              src={chanson.album}
              alt={`${chanson.title} Album Cover`}
            />
          )}
          <button onClick={() => addMusicPlaying(chanson.id)} className='flex justify-center items-center absolute bg-gray-700 rounded-2xl p-3.5'>
            <PlayPauseButton
              
              isPaused={selectedMusicObj && selectedMusicObj.id === chanson.id ? false : true}
              couleur={"#955EED"}
              sizePlay={"2xl"}
              sizePause={"2xl"}
            />
          </button>
          <button
            onClick={handleDeleteLikedSong}
            className='p-2 bg-gray-700 absolute bottom-0 right-2 rounded-xl'>
            <span className="w-6 h-6 block">
              <LikeBtn id={chanson.id} />
            </span>
          </button>
        </div>
        <div className='flex flex-col items-center'>
          <h1 className='font-supremeBold text-center text-2xl w-52'>
            {chanson.title.length > 25
              ? `${chanson.title.substring(0, 25)}...`
              : chanson.title}
          </h1>
          <h2 className='text-gray-400 '>{chanson.artist}</h2>
        </div>
      </motion.li>
    </>
  );
};
export default ChansonsAimee;
