import { IoIosArrowDown } from "react-icons/io";
import RollingTitle from "../RollingTitle";
import PlayPauseButton from "../PlayPauseButton";
import AudioVisualizer from "../AudioVisualizer";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { MdSkipNext } from "react-icons/md";
import { HiSpeakerWave } from "react-icons/hi2";
import { useMusic } from "../../context/musicContext";

const DetailsMusicFull = ({
  music,
  closeFn,
  progress,
  changeProgress,
  pause,
  togglePause,
  isPaused,
  volume,
  changeVolume,
  duration,
  playlistMusic,
}) => {
  const { addMusicPlaying } = useMusic();
  const durationRef = useRef(null);
  const volumeRef = useRef(null);

  const [isDraggingDuration, setIsDragging] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);

  const updateProgress = (e) => {
    if (isDraggingDuration) {
      let width = durationRef.current.clientWidth;
      const offset =
        e.touches[0].clientX - durationRef.current.getBoundingClientRect().left;
      const percentage = (offset / width) * 100;
      changeProgress(percentage / 100);
    }
  };

  const updateVolume = (e) => {
    if (isDraggingVolume) {
      let width = volumeRef.current.clientWidth;
      const offset =
        e.touches[0].clientX - volumeRef.current.getBoundingClientRect().left;
      const percentage = (offset / width) * 100;
      changeVolume(percentage / 100);
    }
  };

  const handleTouchStartVolume = () => {
    setIsDraggingVolume(true);
    // Sauvegardez l'état actuel de la lecture
  };

  const handleTouchEndVolume = () => {
    setIsDraggingVolume(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    // Sauvegardez l'état actuel de la lecture
    setWasPlaying(!isPaused);
    pause(); // Mettez en pause la musique indépendamment de l'état actuel
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (wasPlaying) {
      togglePause(); // Reprenez la lecture si la musique était en lecture
    }
  };

  const switchChanson = (direction) => {
    if (playlistMusic != null) {
      if (playlistMusic.songs && playlistMusic.songs.length > 1) {
        const currentIndex = playlistMusic.songs.findIndex(
          (song) => song.id === music.id
        );
        let nextIndex;
        if (direction === "next") {
          nextIndex = (currentIndex + 1) % playlistMusic.songs.length;
        } else {
          nextIndex =
            (currentIndex - 1 + playlistMusic.songs.length) %
            playlistMusic.songs.length;
        }
        const nextSong = playlistMusic.songs[nextIndex];
        if (nextSong && nextSong.id) {
          console.log("Changement", nextSong);
          addMusicPlaying(nextSong.id); // Pass the ID to addMusicPlaying
          // setStartTime(new Date().toISOString());
          togglePause();
        } else {
          console.error("pas valide", nextSong);
        }
      } else {
        console.warn("peux pas switch");
      }
    }
  };

  return (
    <div className='w-full h-full gap-12 flex flex-col items-center relative justify-center'>
      <span className='absolute -bottom-1'>
        <AudioVisualizer />
      </span>
      <button
        className='top-4 absolute right-7 text-[#493074] '
        onClick={closeFn}>
        <IoIosArrowDown className='text-4xl' />
      </button>

      <img
        className='rounded-full w-60 z-50'
        src={music.album.cover_medium}
        alt={music.title}
      />

      <div className='w-full flex flex-col gap-5 z-50 items-center '>
        <div className='text-white overflow-hidden flex flex-col w-[70%]'>
          <span className='text-3xl font-tanker'>
            {music.title.length > 30 ? (
              <RollingTitle title={music.title} />
            ) : (
              <h3 className='font-bold'>{music.title}</h3>
            )}
          </span>
          <h2>{music.artist.name}</h2>
        </div>
        <div className='w-full flex flex-col gap-2 items-center justify-center'>
          <motion.div
            animate={isDraggingDuration ? { scaleY: 1.4 } : { scaleY: 1 }}
            className='bg-[#493074] w-[70%] rounded-full  h-1.5 cursor-pointer'
            onClick={(e) => updateProgress(e)}
            onTouchStart={handleTouchStart}
            onTouchMove={updateProgress}
            onTouchEnd={handleTouchEnd}
            ref={durationRef}>
            <motion.span
              className='bg-orange-500 block rounded-full h-full'
              style={{ width: progress * 100 + "%" }}
              initial={{ scale: 1 }}
              transition={{ duration: 0.2 }}></motion.span>
          </motion.div>
          <div className='w-[68%] flex justify-between'>
            <span className='w-7'>
              {Math.floor(progress * duration) > 9
                ? "0:" + Math.floor(progress * duration)
                : "0:0" + Math.floor(progress * duration)}
            </span>
            <span className='w-7'>
              {Math.floor(duration) > 9
                ? "0:" + Math.floor(duration)
                : "0:0" + Math.floor(duration)}
            </span>
          </div>
        </div>
        <div className='text-[#493074] flex items-center justify-between w-[40%] text-[2.5rem]'>
          <button onClick={() => switchChanson("prev")}>
            <MdSkipNext className='rotate-180' />
          </button>
          <button onClick={togglePause}>
            <PlayPauseButton
              isPaused={isPaused}
              couleur={"#493074"}
              sizePause={"4xl"}
              sizePlay={"3xl"}
            />
          </button>
          <button onClick={() => switchChanson("next")}>
            <MdSkipNext />
          </button>
        </div>
        <div className='flex gap-5 mt-3 w-[70%] text-[#493074] text-2xl items-center justify-center'>
          <HiSpeakerWave className='text-xl' />
          <motion.div
            animate={isDraggingVolume ? { scaleY: 1.4 } : { scaleY: 1 }}
            className='bg-[#493074] w-full  rounded-full  h-1.5 cursor-pointer'
            onClick={(e) => updateVolume(e)}
            onTouchMove={updateVolume}
            onTouchStart={handleTouchStartVolume}
            onTouchEnd={handleTouchEndVolume}
            ref={volumeRef}>
            <motion.span
              className='bg-orange-500 block rounded-full h-full'
              style={{ width: volume * 100 + "%" }}
              initial={{ scale: 1 }}
              transition={{ duration: 0.2 }}></motion.span>
          </motion.div>
          <HiSpeakerWave />
        </div>
      </div>
    </div>
  );
};
export default DetailsMusicFull;
