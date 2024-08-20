import { useEffect, useRef, useState } from "react";
import { useAudio, useAudioEnded } from "../../lib/audiotim";
import { useAudioProgress } from "../../lib/audiotim";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import AudioVisualizer from "../AudioVisualizer";
import { useMusic } from "../../context/musicContext";
import { useInfos } from "../../context/authContext";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { BiSkipNext } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import PlayPauseButton from "../PlayPauseButton";
import VolumeSlider from "./VolumeSlider";
import DetailMusicDesktopExpand from "./DetailMusicDesktopExpand";
import RollingTitle from "../RollingTitle";
import { IoIosArrowUp } from "react-icons/io";
import "./detailMusicDesktop.css";

const DetailsMusicDesktop = ({ }) => {
  const {
    isReady,
    changeSource,
    togglePause,
    pause,
    isPaused,
    togglePauseHandler,
    stop,
    volume,
    changeVolume,
    duration,
  } = useAudio(false);
  const [isDragging, setIsDragging] = useState(false);
  const clickRef = useRef();
  const [wasPlaying, setWasPlaying] = useState(false);
  const { progress, changeProgress } = useAudioProgress();
  const [startTime, setStartTime] = useState(null);
  const [isHandlingPlayPause, setIsHandlingPlayPause] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const controls = useAnimation();
  const controls2 = useAnimation();

  const { selectedMusicObj, playlistMusic, playlistDetails, addMusicPlaying } =
    useMusic();

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (selectedMusicObj) {
      console.log("Selected Music:", selectedMusicObj);
    }
  }, [selectedMusicObj]);

  useEffect(() => {
    if (selectedMusicObj) {
      changeSource(selectedMusicObj.preview, true);
    }
  }, [selectedMusicObj]);
  useEffect(() => {
    handlePlayPause();
  }, []);

  const switchChanson = (direction) => {
    if (playlistMusic != null) {
      if (playlistMusic.songs && playlistMusic.songs.length > 1) {
        const currentIndex = playlistMusic.songs.findIndex(
          (song) => song.id === selectedMusicObj.id
        );
        let nextIndex;
        if (direction === 'next') {
          nextIndex = (currentIndex + 1) % playlistMusic.songs.length;
        } else {
          nextIndex = (currentIndex - 1 + playlistMusic.songs.length) % playlistMusic.songs.length;
        }
        const nextSong = playlistMusic.songs[nextIndex];
        if (nextSong && nextSong.id) {
          console.log("Changement", nextSong);
          addMusicPlaying(nextSong.id); // Pass the ID to addMusicPlaying
          setStartTime(new Date().toISOString());
          togglePause();
        } else {
          console.error("pas valide", nextSong);
        }
      } else {
        console.warn("peux pas switch");
      }
    };
  }


  const handleEnded = () => {
    if (playlistMusic && playlistMusic.songs && playlistMusic.songs.length > 0) {
      console.log("playlistMusic", playlistMusic);
      if (selectedMusicObj && !isPaused) {
        const endTime = new Date().toISOString();
        stop();
        // console.log("Music ended:", selectedMusicObj);
        // console.log("Start time:", startTime);
        // console.log("End time:", endTime);
        recordListeningHistory(selectedMusicObj, startTime, endTime);

        if (playlistMusic.songs && playlistMusic.songs.length > 1) {
          const currentIndex = playlistMusic.songs.findIndex(
            (song) => song.id === selectedMusicObj.id
          );
          const nextIndex = (currentIndex + 1) % playlistMusic.songs.length;
          const nextSong = playlistMusic.songs[nextIndex];
        
          if (nextSong && nextSong.id) {
            console.log("prochaine chanson", nextSong);
            addMusicPlaying(nextSong.id);
            setStartTime(new Date().toISOString());
            togglePause();
          } else {
            const firstSong = playlistMusic.songs[0];
        
            // Check if details property exists
            if (firstSong && firstSong.details && firstSong.details.id) {
              console.log("prochaine chanson", firstSong);
              addMusicPlaying(firstSong.details.id);
              setStartTime(new Date().toISOString());
              togglePause();
            } else {
              console.error("url pas valide", firstSong);
              console.log("playlist finif", playlistMusic);
            }
          }
        } else {
          const firstSong = playlistMusic.songs[0];
          if (firstSong && firstSong.details && firstSong.details.id) {
            console.log("prochaine chanson", firstSong);
            addMusicPlaying(firstSong.details.id);
            setStartTime(new Date().toISOString());
            togglePause();
          } else {
            console.error("invalide", firstSong);
            console.log("playlist fini", playlistMusic);
          }
        }
      }
    }

  };
  useAudioEnded(handleEnded);

  const handlePlayPause = async () => {
    try {
      // If already handling play/pause, do nothing to avoid recursion
      if (isHandlingPlayPause) {
        return;
      }

      setIsHandlingPlayPause(true);

      if (startTime === null) {
        setStartTime(new Date().toISOString());
        await togglePause();
      } else {
        const endTime = new Date().toISOString();
        await togglePause();
        setStartTime(null);
        await recordListeningHistory(selectedMusicObj, startTime, endTime);
      }
    } catch (error) {
      console.error("Error in handlePlayPause:", error);
    } finally {
      setIsHandlingPlayPause(false); // Reset the flag regardless of success or failure
    }
  };

  const recordListeningHistory = async (music, startTime, endTime) => {
    try {
      const user = auth.currentUser;
      console.log(music);
      if (!user) {
        return;
      }

      const durationInSeconds = Math.floor(
        (new Date(endTime) - new Date(startTime)) / 1000
      );

      const userDocRef = doc(db, "users", user.uid);

      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      if (!Array.isArray(userData.chansonsEcoute)) {
        userData.chansonsEcoute = [];
      }

      const existingSong = userData.chansonsEcoute.find(
        (song) => song.id === music.id
      );

      if (existingSong) {
        existingSong.duration += durationInSeconds;
      } else {
        userData.chansonsEcoute.push({
          id: music.id,
          album: music.album.title,
          artist: music.artist.name,
          duration: durationInSeconds,
          title: music.title,
        });
      }

      await setDoc(
        userDocRef,
        { chansonsEcoute: userData.chansonsEcoute },
        { merge: true }
      );

      console.log("Listening history recorded successfully!");
    } catch (error) {
      console.error("Error recording listening history:", error);
    }
  };

  if (!selectedMusicObj) {
    return console.log("Aucune Musique en cours");
  }

  const updateProgress = (e) => {
    if (isDragging) {
      let width = clickRef.current.clientWidth;
      const offset =
        e.touches[0].clientX - clickRef.current.getBoundingClientRect().left;
      const percentage = (offset / width) * 100;
      changeProgress(percentage / 100);
    } else {
      let width = clickRef.current.clientWidth;
      const offset = e.clientX - clickRef.current.getBoundingClientRect().left;
      const percentage = (offset / width) * 100;
      changeProgress(percentage / 100);
    }
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


  const handleButtonClick = () => {
    const newHeight = isExpanded ? "56px" : "600px";
    const newRotation = isExpanded ? "0deg" : "180deg";
    controls.start({
      height: newHeight,
      transition: { duration: 0.4, ease: "easeOut" },
    });
    controls2.start({ rotate: newRotation, transition: { duration: 0.2 } });

    // Mettre à jour l'état pour le prochain clic
    setIsExpanded(!isExpanded);
  };

  return isReady ? (
    <motion.div
      className='flex flex-col items-center justify-end rounded-[20px] px-4 pr-5 overflow-hidden w-[68vw] xl:w-[71vw] h-full 2xl:w-[74vw] z-20 bg-perso-mauveLecteur fixed bottom-3 left-[30%] xl:left-[27%] 2xl:left-[23%] pb-1'
      animate={controls}
      initial={{ height: "56px" }}>
      {isExpanded && (
        <DetailMusicDesktopExpand selectedMusicObj={selectedMusicObj} switchChanson={switchChanson} />
      )}
      <div className='w-full h-[52px] flex flex-row justify-between'>
        <div className='flex items-center gap-2'>
          <div className='h-full flex gap-1 items-center text-perso-mauve'>
            <button className='w-8 flex items-center justify-center' onClick={() => switchChanson('prev')}>
              <BiSkipNext className='rotate-180 text-4xl' />
            </button>
            <button
              onClick={togglePause}
              className='w-9 h-9 flex items-center justify-center bg-perso-mauve rounded-full'>
              <PlayPauseButton
                isPaused={isPaused}
                couleur={"#A67FE7"}
                sizePlay={"md"}
                sizePause={"xl"}
              />
            </button>
            <button className='w-8 flex items-center justify-center' onClick={() => switchChanson('next')}>
              <BiSkipNext className='text-4xl' />
            </button>
          </div>
          <p className='flex gap-1 text-perso-mauve text-sm'>
            <span className='w-7'>
              {Math.floor(progress * duration) > 9
                ? "0:" + Math.floor(progress * duration)
                : "0:0" + Math.floor(progress * duration)}
            </span>
            <span>/</span>
            <span className='w-7'>
              {Math.floor(duration) > 9
                ? "0:" + Math.floor(duration)
                : "0:0" + Math.floor(duration)}
            </span>
          </p>
        </div>

        <div className='flex items-center w-[35%] gap-3 h-full'>
          <img
            className='w-10 h-10 rounded-md'
            src={selectedMusicObj.album.cover}
            alt='cover'
          />
          <div className='flex w-full h-full overflow-hidden justify-between items-center'>
            <div className='flex flex-col items-start justify-center overflow-hidden w-full h-full'>
              {selectedMusicObj.title.length > 35 ? (
                <RollingTitle title={selectedMusicObj.title} />
              ) : (
                <h3>{selectedMusicObj.title}</h3>
              )}

              <h4 className='text-sm text-perso-mauve'>
                {selectedMusicObj.artist.name}
              </h4>
            </div>
          </div>

          
        </div>

        <div
          className='bg-gray-600 absolute w-full -bottom-0 left-0 h-1 cursor-pointer'
          onClick={updateProgress}
          onTouchStart={handleTouchStart}
          onTouchMove={updateProgress}
          onTouchEnd={handleTouchEnd}
          ref={clickRef}>
          <motion.span
            className='bg-orange-500 block h-1'
            style={{ width: progress * 100 + "%" }}
            animate={isDragging ? { scaleY: 3 } : { scaleY: 1 }}
            initial={{ scale: 1 }}
            transition={{ duration: 0.2 }}></motion.span>
        </div>

        <div className='flex items-center justify-center gap-7'>
          <VolumeSlider />

          <motion.button
            onClick={handleButtonClick}
            animate={controls2}
            className='flex items-center justify-center h-7 w-7 rounded-full border-perso-mauve text-perso-mauve border-2'>
            <IoIosArrowUp className='text-xl mb-[1px] stroke-[10px]' />
          </motion.button>
        </div>
        {/* <AudioVisualizer /> */}
      </div>
    </motion.div>
  ) : (
    <motion.div
      className='flex flex-col items-center justify-end rounded-[20px] px-4 pr-5 overflow-hidden w-[68vw] xl:w-[71vw] h-full 2xl:w-[74vw] z-20 bg-perso-mauveLecteur fixed bottom-3 left-[30%] xl:left-[27%] 2xl:left-[23%] pb-1'
      animate={controls}
      initial={{ height: "56px" }}>
      <div className='w-full h-[52px] flex flex-row justify-between'>
        <div className='flex items-center gap-2'>
          <div className='h-full flex gap-1 items-center text-perso-mauve'>
            <button className='w-8 flex items-center justify-center'>
              <BiSkipNext className='rotate-180 text-4xl' />
            </button>
            <button
              onClick={togglePause}
              className='w-9 h-9 flex items-center justify-center bg-perso-mauve rounded-full'>
              <PlayPauseButton
                isPaused={true}
                couleur={"#A67FE7"}
                sizePlay={"md"}
                sizePause={"xl"}
              />
            </button>
            <button className='w-8 flex items-center justify-center'>
              <BiSkipNext className='text-4xl' />
            </button>
          </div>
          <p className='flex gap-1 text-perso-mauve text-sm'>
            <Skeleton width={88} />
          </p>
        </div>

        <div className='flex items-center justify-center w-[35%] gap-3 h-full'>
          <span className='mb-1'>
            <Skeleton
              width={40}
              height={40}
            />
          </span>
          <div className='flex w-full h-full overflow-hidden justify-between items-center'>
            <div className='flex flex-col items-start justify-center w-full h-full mt-0-1'>
              <Skeleton width={"15rem"} />

              <Skeleton
                width={"10rem"}
                height={".6rem"}
              />
            </div>
          </div>
          <i>
            {/* Pour like */}
            <FaRegHeart className='text-perso-mauve text-xl stroke-[25] overflow-visible' />
          </i>
        </div>

        <div className='bg-gray-600 absolute w-full -bottom-0 left-0 h-1 cursor-pointer'></div>

        <div className='flex items-center justify-center gap-7'>
          <VolumeSlider />
          <motion.button
            onClick={handleButtonClick}
            animate={controls2}
            className='flex items-center justify-center h-7 w-7 rounded-full border-perso-mauve text-perso-mauve border-2'>
            <IoIosArrowUp className='text-xl mb-[1px] stroke-[10px]' />
          </motion.button>
        </div>
        {/* <AudioVisualizer /> */}
      </div>
    </motion.div>
  );
};


export default DetailsMusicDesktop;
