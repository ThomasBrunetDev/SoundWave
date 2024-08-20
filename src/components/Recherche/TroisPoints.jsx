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
// import AudioVisualizer from "../AudioVisualizer";
import { useMusic } from "../../context/musicContext";
// import { useInfos } from "../../context/authContext";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
// import { BiSkipNext } from "react-icons/bi";
// import { FaRegHeart } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";

// import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// import PlayPauseButton from "../PlayPauseButton";
// import VolumeSlider from "./VolumeSlider";
// import SousMenu from "../sousMenu";
// import DetailMusicDesktopExpand from "./DetailMusicDesktopExpand";
// import RollingTitle from "../RollingTitle";
// import { IoIosArrowUp } from "react-icons/io";
// import "./detailMusicDesktop.css";

const TroisPoints = ({ }) => {
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
  const [sousMenuVisible, setSousMenuVisible] = useState(false);

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
  const handleEnded = () => {
    if (selectedMusicObj && !isPaused) {
      const endTime = new Date().toISOString();
      stop();
      console.log("Music ended:", selectedMusicObj);
      console.log("Start time:", startTime);
      console.log("End time:", endTime);
      recordListeningHistory(selectedMusicObj, startTime, endTime);

      if (playlistMusic.songs && playlistMusic.songs.length > 1) {
        const currentIndex = playlistMusic.songs.findIndex(
          (song) => song.id === selectedMusicObj.id
        );
        const nextIndex = (currentIndex + 1) % playlistMusic.songs.length;
        const nextSong = playlistMusic.songs[nextIndex];

        if (nextSong && nextSong.id) {
          console.log("Next Song:", nextSong);
          addMusicPlaying(nextSong.id); // Pass the ID to addMusicPlaying
          setStartTime(new Date().toISOString());
          togglePause();
        } else {
          // If the current song is the last one, reset the playlist to the first song
          const firstSong = playlistMusic.songs[0];
          console.log("Next Song (reset):", firstSong);
          addMusicPlaying(firstSong.id); // Pass the ID to addMusicPlaying
          setStartTime(new Date().toISOString());
          togglePause();
        }
      } else {
        // If there's only one song, reset the playlist to the first song
        const firstSong = playlistMusic.songs[0];

        if (firstSong && firstSong.id) {
          console.log("Next Song (reset):", firstSong);
          addMusicPlaying(firstSong.id); // Pass the ID to addMusicPlaying
          setStartTime(new Date().toISOString());
          togglePause();
        } else {
          console.error("Invalid first song or preview URL:", firstSong);
          console.log("Complete playlist:", playlistMusic);
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

  return  (
    <motion.div
      className='flex flex-col items-center justify-end rounded-[20px] px-4 pr-5 overflow-hidden w-[68vw] xl:w-[71vw] h-full 2xl:w-[74vw] z-20 bg-perso-mauveLecteur fixed bottom-3 left-[30%] xl:left-[27%] 2xl:left-[23%] pb-1 '
      animate={controls}
      initial={{ height: "56px" }}>
      {isExpanded && (
        <DetailMusicDesktopExpand selectedMusicObj={selectedMusicObj} />
      )}
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
                isPaused={isPaused}
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
          
          <i className='relative flex'>
            <AnimatePresence>
              {sousMenuVisible && (
                <span className='fixed bottom-14'>
                  <SousMenu
                    elements={[
                      {
                        nom: "Ajouter a la liste de lecutre",
                        clicFn: () => {
                          console.log("Ajouter a la liste de lecutre");
                          setSousMenuVisible(false);
                        },
                      }
                    ]}
                    clicFn={() => {
                      console.log("clic sur l'option");
                      setSousMenuVisible(!sousMenuVisible);
                    }}
                    closeFn={() => setSousMenuVisible(!sousMenuVisible)}
                  />
                </span>
              )}
            </AnimatePresence>
            <button onClick={() => setSousMenuVisible(!sousMenuVisible)}>
              <BsThreeDotsVertical className='text-perso-mauve text-xl' />
            </button>
          </i>
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
  ) ;
};



export default TroisPoints;