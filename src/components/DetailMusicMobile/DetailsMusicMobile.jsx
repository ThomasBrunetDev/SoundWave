import { useEffect, useRef, useState } from "react";
import { useAudio, useAudioEnded, useAudioProgress } from "../../lib/audiotim";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

import { useMusic } from "../../context/musicContext";

import { FlatTree, motion, useAnimation } from "framer-motion";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import PlayPauseButton from "../PlayPauseButton";
import RollingTitle from "../RollingTitle";
import DetailsMusicFull from "./DetailsMusicFull";
import DetailMusicFullSkeleton from "./DetailMusicFullSkeleton";
import { flushSync } from "react-dom";

const DetailsMusicMobile = () => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const { selectedMusicObj, playlistMusic, playlistDetails, addMusicPlaying } =
    useMusic();

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (selectedMusicObj) {
      console.log("Selected Music:", selectedMusicObj);
      recordListeningHistory(selectedMusicObj);
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
    if (playlistMusic && playlistMusic.songs && playlistMusic.songs.length > 0) {
      if (selectedMusicObj && !isPaused) {
        const endTime = new Date().toISOString();
        stop();
        console.log("Music ended:", selectedMusicObj);
        console.log("Start time:", startTime);
        console.log("End time:", endTime);
        // recordListeningHistory(selectedMusicObj, startTime, endTime);

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
        // await recordListeningHistory(selectedMusicObj, startTime, endTime);
      }
    } catch (error) {
      console.error("Error in handlePlayPause:", error);
    } finally {
      setIsHandlingPlayPause(false); // Reset the flag regardless of success or failure
    }
  };

  const recordListeningHistory = async (music) => {
    console.log("Recording listening history:", music);
    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      const userDocRef = doc(db, "users", user.uid);

      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      // Ensure chansonsEcoute is defined and initialized as an empty array
      userData.chansonsEcoute = userData.chansonsEcoute || [];

      const existingSongIndex = userData.chansonsEcoute.findIndex(
        (song) => song.id === music.id
      );

      if (existingSongIndex !== -1) {
        // If the song exists, increment the nbFoisEcoute
        userData.chansonsEcoute[existingSongIndex].nbFoisEcoute += 1;
      } else {
        // If the song doesn't exist, add it to chansonsEcoute with nbFoisEcoute set to 1
        userData.chansonsEcoute.push({
          id: music.id,
          album: music.album.title,
          artist: music.artist.name,
          artistImg: music.artist.picture_xl,
          title: music.title,
          cover: music.album.cover_big,
          nbFoisEcoute: 1, // Set initial nbFoisEcoute to 1
        });
      }

      // Update the user document with the modified chansonsEcoute
      await updateDoc(userDocRef, {
        chansonsEcoute: userData.chansonsEcoute,
      });
    } catch (error) {
      console.error("Error recording listening history:", error);
    }
  };

  if (!selectedMusicObj) {
    return console.log("Aucune Musique en cours");
  }

  const style = {
    width: "95%",
  };

  const updateProgress = (e) => {
    if (isDragging) {
      let width = clickRef.current.clientWidth;
      const offset =
        e.touches[0].clientX - clickRef.current.getBoundingClientRect().left;
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

  return isReady ? (
    <motion.div
      initial={{ height: "0" }}
      animate={
        isExpanded ? { height: "90vh", width: "100%" } : { height: "4rem" }
      }
      transition={{ duration: 0.3 }}
      className='flex flex-row rounded-lg overflow-hidden top-7 z-10 bg-perso-mauveLecteur mb-2  relative pb-1'
      style={style}>

        
      {isExpanded && (
        <DetailsMusicFull
          playlistMusic={playlistMusic}
          duration={duration}
          volume={volume}
          changeVolume={changeVolume}
          isPaused={isPaused}
          pause={pause}
          togglePause={togglePause}
          changeProgress={changeProgress}
          progress={progress}
          music={selectedMusicObj}
          closeFn={() => setIsExpanded(false)}
        />
      )}
      <motion.img
        animate={isExpanded ? { opacity: 0, display: "none" } : { opacity: 1 }}
        className={"h-full"}
        src={selectedMusicObj.album.cover}
        alt='cover'
      />

      <motion.div
        animate={isExpanded ? { opacity: 0, display: "none" } : { opacity: 1 }}
        className='flex w-10/12 md:w-[88%] h-full justify-between items-center gap-5 pl-5'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex flex-col overflow-hidden w-10/12'>
          {selectedMusicObj.title.length > 35 ? (
            <RollingTitle title={selectedMusicObj.title} />
          ) : (
            <h3>{selectedMusicObj.title}</h3>
          )}

          <h4 className='text-sm'>{selectedMusicObj.artist.name}</h4>
        </button>

        <button onClick={togglePause}>
          <PlayPauseButton
            isPaused={isPaused}
            couleur={"#492F75"}
            sizePlay={"xl"}
            sizePause={"2xl"}
          />
        </button>
      </motion.div>

      <motion.div
        animate={isExpanded ? { opacity: 0, display: "none" } : { opacity: 1 }}
        className='bg-gray-600 absolute w-full -bottom-0 left-0 h-1 cursor-pointer'
        onClick={(e) => updateProgress(e)}
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
      </motion.div>

      <div className='hidden xl:block'>
        <input
          type='range'
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          min={0}
          max={1}
          step={0.01}
        />

        <p>Volume: {Math.floor(volume * 100)}%</p>
      </div>
      {/* <AudioVisualizer /> */}
    </motion.div>
  ) : (
    <motion.div
      initial={{ height: "0" }}
      animate={
        isExpanded ? { height: "90vh", width: "100%" } : { height: "4rem" }
      }
      transition={{ duration: 0.3 }}
      className='flex flex-row rounded-lg overflow-hidden top-7 z-10 bg-perso-mauveLecteur mb-2  relative pb-1'
      style={style}>
      {!isExpanded ? (
        <>
          <span
            className='h-full'
            style={{ verticalAlign: "top", lineHeight: "0" }}>
            <Skeleton
              width={"4rem"}
              height={"4rem"}
              style={{ display: "block" }}
            />
          </span>
          <div className='flex w-10/12 h-full items-center justify-between pl-5'>
            <div className='w-6/12'>
              <Skeleton
                width={"100%"}
                height={"1rem"}
              />
              <Skeleton
                width={"50%"}
                height={"1rem"}
              />
            </div>
            <button
              className='text-perso-mauveFonce'
              onClick={togglePause}>
              <PlayPauseButton
                isPaused={isPaused}
                couleur={"#492F75"}
              />
            </button>
          </div>
        </>
      ): <DetailMusicFullSkeleton closeFn={() => setIsExpanded(false)}/>}
    </motion.div>
  );
};

export default DetailsMusicMobile;
