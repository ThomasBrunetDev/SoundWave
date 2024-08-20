import { useEffect, useState } from "react";
import { useInfos } from "../context/userContext";
import { useMusic } from "../context/musicContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { IoMdArrowRoundBack } from "react-icons/io";
import LikeBtn from "./LikeBtn";
import IsPlaying from "./IsPlaying";
import { FaPlay } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ListeLike = () => {
  const { user, addToLikedSongs } = useInfos();
  const { selectedMusicObj, addMusicPlaying, playlistDetails } = useMusic();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [profilUtilisateur, setProfilUtilisateur] = useState(null);
  const [listeLike, setListeLike] = useState(null);

  useEffect(() => {
    const obtenirProfilUtilisateur = async () => {
      try {
        if (user) {
          const userColRef = collection(db, "users");
          const userDoc = await getDoc(doc(userColRef, user.uid));
          if (userDoc.exists()) {
            const currentUser = {
              id: userDoc.id,
              ...userDoc.data(),
            };
            setProfilUtilisateur(currentUser);
            setListeLike(currentUser.likedsongs);
          }
        } else {
          setProfilUtilisateur(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    obtenirProfilUtilisateur();
  }, []);

  // Check if listeLike is not null before creating sortedLikedList
  const sortedLikedList = listeLike?.length
    ? Array.from(listeLike).sort((a, b) => a.index - b.index)
    : [];

  console.log(profilUtilisateur);

  const click = (music) => {
    addMusicPlaying(music.id);
    playlistDetails({
      titre: "Chansons aimées",
      songs: sortedLikedList,
    });
  };

  const like = async (id, music) => {
    const additionalInfo = {
      title: music.title,
      artist: music.artist,
      album: music.album,
    };
    try {
      await addToLikedSongs(id, additionalInfo);
      setListeLike(listeLike.filter((song) => song.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Fonction pour mettre à jour la largeur de l'écran
  const majLargeurEcran = () => {
    setScreenWidth(window.innerWidth);
  };

  // Ajouter un écouteur d'événements pour le changement de taille de l'écran lors du montage du composant
  useEffect(() => {
    window.addEventListener("resize", majLargeurEcran);

    // Nettoyer l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("resize", majLargeurEcran);
    };
  }, []); // La dépendance vide signifie que cet effet s'exécute uniquement une fois après le montage initial

  return (
    <div className='pb-40 min-h-screen w-full flex flex-col items-start'>
      <Helmet>
        <title>SoundWave | Favoris</title>
      </Helmet>
      {profilUtilisateur && profilUtilisateur.likedsongs ? (
        <div className='w-full flex flex-col gap-10 items-center'>
          {console.log(profilUtilisateur)}
          <div
            style={{
              backgroundImage: `url(${
                profilUtilisateur.likedsongs <= 0
                  ? "https://images.unsplash.com/photo-1701990630137-005958559f36?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  : listeLike[listeLike.length - 1].album
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className='w-full relative h-64 bg-blend-darken'>
            <Link
              to={-1}
              className='absolute top-5 left-5 z-10 p-2 rounded-full bg-perso-mauve '>
              <IoMdArrowRoundBack className='text-2xl' />
            </Link>
            <div className='public-playlist-cover flex w-full h-full backdrop-brightness-75 gap-1 items-end justify-start p-6 px-12'>
              <h1 className='font-tanker text-4xl'>Liste des Likes</h1>
            </div>
          </div>
          <ul className='flex flex-col items-center gap-5 w-[80%] overflow-hidden'>
            {listeLike.map((song, index) => (
              <motion.li
                initial={{ opacity: 0, translateY: 10 }}
                animate={{
                  opacity: 1,
                  translateY: 1,
                  transition: { delay: index * 0.03 },
                }}
                exit={{ opacity: 0, translateY: 10 }}
                key={index}
                className='flex items-center justify-between w-full transition-colors rounded-xl lg:pr-3 hover:bg-black hover:bg-opacity-30'>
                <div className='flex items-center gap-4'>
                  <img
                    src={song.album}
                    alt={`Image de ${song.title}`}
                    className='w-14 h-14 rounded-md'
                  />
                  <div className=''>
                    {screenWidth < 1024 && song.title.length > 25
                      ? `${song.title.substring(0, 25)}...`
                      : song.title}
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
                    className='w-7 h-7'
                    onClick={() => like(song.id, song)}>
                    <LikeBtn id={song.id} />
                  </button>
                </div>
              </motion.li>
            ))}
            <p className='bg-perso-mauvePale px-6 py-3 mt-3 rounded-full'>
              Total : {profilUtilisateur.likedsongs.length}
            </p>
          </ul>
        </div>
      ) : (
        <div className='w-full flex flex-col gap-10 items-center'>
          <div className='w-full flex flex-col gap-10 items-center'>
            <div
              style={{
                backgroundImage: `url(${"https://images.unsplash.com/photo-1701990630137-005958559f36?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className='w-full relative h-64 bg-blend-darken'>
              <div className='public-playlist-cover flex w-full h-full backdrop-brightness-75 gap-1 items-end justify-start p-6 px-12'>
                <h1 className='font-tanker text-4xl'>Liste des Likes</h1>
              </div>
              <Link
                to={-1}
                className='absolute top-5 left-5 z-10 p-2 rounded-full bg-perso-mauve '>
                <IoMdArrowRoundBack className='text-2xl' />
              </Link>
            </div>
          </div>
          <div className='flex flex-col justify-center h-52 items-center w-full'>
            <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
              Vous n'avez pas encore <br /> de chansons aimées
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};
export default ListeLike;
