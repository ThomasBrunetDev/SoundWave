import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useInfos } from "../../context/userContext";
import { db } from "../../config/firebase";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ButtonChansonsAimee from "./ButtonChansonsAimee";

import Loading from "./Loading";
import { FaPlus, FaLock } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import PlaylistPopUp from "./PlaylistPopUp";
import ChansonsAimee from "./ChansonsAimee";
import ListeLecutre from "./ListeLecture";
import ListeLecturePublic from "./ListeLecturePublic";
import TabSelector from "./TabSelector";
import ItemTopMusique from "./ItemTopMusique";
import ItemMusiqueArtiste from "./ItemMusiqueArtiste";
import ItemArtisteListe from "./ItemArtisteListe";
import ListeArtiste from "./ListeArtiste";
import { Helmet } from "react-helmet";

const TableauDeBord = () => {
  const {
    user,
    rearrangePlaylist,
    deletePlaylist,
    createPlaylist,
    deletePublicPlaylist,
    addToLikedSongs,
    logout,
  } = useInfos();
  const [profilUtilisateur, setProfilUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [chansonsEcoute, setChansonsEcoute] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [totalNbFoisEcoute, setTotalNbFoisEcoute] = useState(0);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [selection, setSelection] = useState("chansons");
  const [privatePlaylistCreate, setPrivatePlaylistCreate] = useState(false);
  const [typeListeAffiche, setTypeListeAffiche] = useState("privee");

  const [listeLike, setListeLike] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };
  const controls = useAnimation();
  useEffect(() => {
    // Calculate total nbFoisEcoute

    const total = chansonsEcoute.reduce(
      (acc, chanson) => acc + chanson.nbFoisEcoute,
      0
    );
    setTotalNbFoisEcoute(total);
  }, [chansonsEcoute]);

  useEffect(() => {
    const obtenirProfilUtilisateur = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const userColRef = collection(db, "users");
        const userDoc = await getDoc(doc(userColRef, user.uid));
        console.log(user);

        if (userDoc.exists()) {
          const currentUser = {
            id: userDoc.id,
            ...userDoc.data(),
          };

          setProfilUtilisateur(currentUser);
          setPlaylists(currentUser.playlists);
          setListeLike(currentUser.likedsongs);

          const ecoute = currentUser.chansonsEcoute || [];
          setChansonsEcoute(ecoute);
        } else {
          setProfilUtilisateur(null);
          setPlaylists([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    const fetchPublicPlaylists = async () => {
      try {
        const publicPlaylistsColRef = collection(db, "publicPlaylists");
        const publicPlaylistsSnapshot = await getDocs(publicPlaylistsColRef);
        const fetchedPublicPlaylists = publicPlaylistsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((publicPlaylist) => publicPlaylist.creatorId === user.uid);

        setPublicPlaylists(fetchedPublicPlaylists);
        console.log("Fetched public playlists:", fetchedPublicPlaylists);
      } catch (error) {
        console.error("Error fetching public playlists:", error);
      }
    };

    obtenirProfilUtilisateur();
    fetchPublicPlaylists();
  }, [user]);

  const handleDeletePublicPlaylist = async (playlistId) => {
    deletePublicPlaylist(playlistId, user);
    setPublicPlaylists(
      publicPlaylists.filter((playlist) => playlist.id !== playlistId)
    );
  };

  const handleDeleteLikedSong = async (chansonId, additionalInfos) => {
    try {
      await addToLikedSongs(chansonId, additionalInfos);
      setListeLike(listeLike.filter((chanson) => chanson.id !== chansonId));
    } catch (error) {
      console.error(error);
    }
  };

  const AjouterPlaylist = async () => {
    await createPlaylist(newPlaylistTitle);
    setNewPlaylistTitle("");
    setPlaylists([...playlists, { titre: newPlaylistTitle, songs: [] }]);
  };
  const handleDeletePlaylist = async (playlistId) => {
    await deletePlaylist(playlistId);
    setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
  };

  // const handleDragEndPlaylists = (result) => {
  //   if (!result.destination) {
  //     return;
  //   }

  //   const reorderedPlaylists = Array.from(profilUtilisateur.playlists);
  //   const [movedPlaylist] = reorderedPlaylists.splice(result.source.index, 1);
  //   reorderedPlaylists.splice(result.destination.index, 0, movedPlaylist);

  //   setProfilUtilisateur({
  //     ...profilUtilisateur,
  //     playlists: reorderedPlaylists,
  //   });

  //   rearrangePlaylist(reorderedPlaylists.map((playlist) => playlist.id));
  // };

  const calculateTotalLikes = (playlists) => {
    let totalLikes = 0;

    playlists
      .filter((publicPlaylist) => publicPlaylist.creatorId === user.uid)
      .forEach((publicPlaylist) => {
        totalLikes += publicPlaylist.likes.length;
      });

    return totalLikes;
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

  if (loading || !profilUtilisateur) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <Loading />
      </div>
    );
  }

  const calculateTopGenres = (playlists) => {
    const genreCounts = {};

    // Count the occurrences of each genre in playlists
    playlists.forEach((playlist) => {
      playlist.genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    // Sort genres by count in descending order
    const sortedGenres = Object.keys(genreCounts).sort(
      (a, b) => genreCounts[b] - genreCounts[a]
    );

    // Take the top 3 genres
    return sortedGenres.slice(0, 3);
  };

  return (
    <div className='flex flex-col pb-40 lg:pb-22 mt-20 gap-20 items-start lg:w-[90%] w-full'>
      <Helmet>
        <title>SoundWave | Tableau de bord</title>
      </Helmet>
      <div className='w-full flex flex-col gap-10'>
        {user && (
          <div className='flex justify-between items-center self-center lg:w-full w-[90%]'>
            <h1 className='font-tanker text-5xl'>Tableau de bord</h1>
            <div className='flex gap-3 self-start items-center justify-center text-white'>
              <img
                className='rounded-full w-10'
                src={user.photoURL}
                alt={user.displayName}
              />
              {/* <h2 className='font-tanker text-2xl'>{user.displayName}</h2> */}
              {/* <button
                className='text-xl rounded-lg p-2 bg-perso-mauvePale '
                onClick={handleLogout}>
                <LuLogOut />
              </button> */}
            </div>
          </div>
        )}
        <div className='flex flex-col items-center gap-7 w-full'>
          <TabSelector
            selection={selection}
            setSelection={setSelection}
            setTypeListeAffiche={setTypeListeAffiche}
          />

          {selection === "playlists" && (
            <motion.div
              initial={{ opacity: 0, translateY: 10 }}
              transition={{ duration: 0.2 }}
              animate={{ opacity: 1, translateY: 0 }}
              className='w-full flex flex-col gap-8 items-center'>
              <div className='flex flex-row lg:w-full w-[90%] justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-tanker text-4xl'>Listes de Lectures</h3>
                  <h4 className='font-supremeBoldItalic text-xl text-[#A497BA] flex items-center gap-2'>
                    <span>
                      <IoIosArrowForward />
                    </span>
                    {profilUtilisateur.playlists.length +
                      publicPlaylists.length}
                  </h4>
                </div>
                <AnimatePresence>
                  {typeListeAffiche === "privee" && (
                    <motion.span
                      initial={{ opacity: 0, translateX: 20 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      exit={{ opacity: 0, translateX: 20 }}>
                      <ButtonChansonsAimee
                        clicFn={() => setPrivatePlaylistCreate(true)}
                        text={<FaPlus />}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* <ButtonChansonsAimee clicFn={() => setPrivatePlaylistCreate(true)} text={<FaPlus />} /> */}
              </div>
              <PlaylistPopUp
                open={privatePlaylistCreate}
                changeFn={setNewPlaylistTitle}
                clicFn={AjouterPlaylist}
                playlistTitle={newPlaylistTitle}
                isOpen={() => setPrivatePlaylistCreate(false)}
              />
              <ul className='flex w-28 justify-center items-center gap-9 py-3 bg-perso-mauvePale rounded-full text-lg relative'>
                <li className='flex z-10 justify-center items-center'>
                  <motion.button
                    onClick={() => {
                      setTypeListeAffiche("privee");
                      controls.start({
                        translateX: 0,
                        transition: { duration: 0.2, ease: "easeOut" },
                      });
                    }}>
                    <FaLock />
                  </motion.button>
                </li>
                <li className='text-xl z-10 flex justify-center items-center'>
                  <motion.button
                    onClick={() => {
                      setTypeListeAffiche("publique");
                      controls.start({
                        translateX: 56,
                        transition: { duration: 0.2, ease: "easeOut" },
                      });
                    }}>
                    <IoPeopleSharp />
                  </motion.button>
                </li>
                <motion.span
                  initial={{ translateX: 0 }}
                  animate={controls}
                  className='position absolute left-3 bg-perso-mauve w-8 h-8 rounded-full'
                />
              </ul>

              {/* Liste de lecture priver */}
              {typeListeAffiche === "privee" && (
                <div className='w-full'>
                  {profilUtilisateur.playlists &&
                  profilUtilisateur.playlists.length > 0 ? (
                    <ul className='grid grid-cols-3 w-full justify-items-center items-start gap-5 h-[316px] overflow-y-scroll relative'>
                      <AnimatePresence>
                        {playlists.map((playlist, index) => (
                          <ListeLecutre
                            key={playlist.id}
                            index={index}
                            playlist={playlist}
                            handleDeletePlaylist={() =>
                              handleDeletePlaylist(playlist.id)
                            }
                          />
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <div className='flex flex-col justify-center h-20 items-center w-full'>
                      <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
                        Aucune liste de lecture privée
                      </h1>
                    </div>
                  )}
                </div>
              )}
              {/* Listes de lecture publiques */}
              {typeListeAffiche === "publique" && (
                <div className='w-full'>
                  {publicPlaylists.length > 0 ? (
                    <ul className='grid grid-cols-3 w-full justify-items-center items-start gap-5 h-[316px] overflow-y-scroll relative'>
                      {publicPlaylists.map((publicPlaylist, index) => (
                        <ListeLecturePublic
                          key={publicPlaylist.id}
                          publicPlaylist={publicPlaylist}
                          index={index}
                          handleDeletePublicPlaylist={
                            handleDeletePublicPlaylist
                          }
                        />
                      ))}
                    </ul>
                  ) : (
                    <div className='flex flex-col justify-center h-20 items-center w-full'>
                      <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
                        Aucune liste de lecutre publique
                      </h1>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Chansons aimees */}
        {selection === "chansons" && (
          <motion.div
            initial={{ opacity: 0, translateY: 10 }}
            transition={{ duration: 0.2 }}
            animate={{ opacity: 1, translateY: 0 }}
            className='flex flex-col gap-8 w-full'>
            <div className='flex flex-row lg:w-full w-[90%] self-center justify-between items-center'>
              <div className='flex items-center gap-2'>
                <h3 className='font-tanker text-4xl'>Chansons aimées</h3>
                <h4 className='font-supremeBoldItalic text-xl text-[#A497BA] flex items-center gap-2'>
                  <span>
                    <IoIosArrowForward />
                  </span>
                  {listeLike.length}
                </h4>
              </div>

              <Link to="/favoris">
                <ButtonChansonsAimee text={"Voir plus"} />
              </Link>
            </div>
            {profilUtilisateur.likedsongs &&
            profilUtilisateur.likedsongs.length > 0 ? (
              <ul className='flex w-full overflow-x-scroll overflow-y-hidden px-3'>
                <AnimatePresence>
                  {listeLike
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((chanson, index) => (
                      <ChansonsAimee
                        index={index}
                        chanson={chanson}
                        key={chanson.id}
                        handleDeleteLikedSong={() =>
                          handleDeleteLikedSong(chanson.id, {
                            title: chanson.title,
                            artist: chanson.artist,
                            album: chanson.album,
                          })
                        }
                      />
                    ))}
                </AnimatePresence>
              </ul>
            ) : (
              <div className='flex flex-col justify-center h-20 items-center w-full'>
                <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
                  Aucune chanson aimée. <br /> Avez-vous du goût?
                </h1>
              </div>
            )}
          </motion.div>
        )}
        {/* Chansons aimees */}
      </div>

      {/* Chansons les plus ecoutees */}

      <motion.div
        initial={{ opacity: 0, translateY: 10 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        animate={{ opacity: 1, translateY: 0 }}
        className='lg:w-full w-[95%] self-center flex flex-col items-center bg-perso-mauvePale px-5 py-9 lg:px-9 rounded-xl gap-10'>
        <h3 className='font-tanker text-4xl w-full self-center'>
          Chansons les plus écoutées
        </h3>
        {chansonsEcoute.length > 0 ? (
          <ul className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-6 self-center w-full'>
            {chansonsEcoute
              .sort((a, b) => b.nbFoisEcoute - a.nbFoisEcoute) // Sort by nbFoisEcoute
              .slice(0, screenWidth < 1024 ? 3 : 6)
              .map((chanson, index) => (
                <ItemTopMusique
                  key={chanson.id}
                  chanson={chanson}
                  index={index}
                  screenWidth={screenWidth}
                />
              ))}
          </ul>
        ) : (
          <div className='flex flex-col justify-center h-20 items-center w-full'>
            <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
              Aucune statistique d'écoute disponible.
            </h1>
          </div>
        )}
      </motion.div>

      {/* Chansons les plus ecoutees */}

      {/* Artistes les plus ecoutees */}
      <div className='w-full flex flex-col gap-10'>
        <h3 className='font-tanker text-4xl self-center w-[90%] lg:w-full'>
          Artistes les plus écoutés
        </h3>
        {chansonsEcoute.length > 0 ? (
          <ListeArtiste
            chansonsEcoute={chansonsEcoute}
            screenWidth={screenWidth}
          />
        ) : (
          <div className='flex flex-col justify-center h-20 items-center w-full'>
            <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
              Aucune statistique d'écoute disponible.
            </h1>
          </div>
        )}
      </div>

      {/* Artistes les plus ecoutees */}
      <div className='self-center flex flex-col items-center gap-7  bg-perso-mauvePale lg:w-full w-[95%] px-5 py-9 lg:px-9 rounded-xl'>
        <h1 className='font-tanker text-4xl self-center w-full'>
          Statistiques
        </h1>
        <div className='flex items-center justify-between font-tanker text-2xl gap-11 w-full'>
          <h2 className='font-supremeMedium text-xl'>
            Total des chansons écoutées
          </h2>
          <p className='font-tanker text-2xl tracking-wider'>
            {totalNbFoisEcoute}
          </p>
        </div>

        <div className='w-full flex flex-col gap-5'>
          <h3 className='font-supremeBold text-2xl'>Infos communauté</h3>
          <div className='w-full flex flex-col gap-5'>
            <div className='flex items-center justify-between font-tanker text-2xl gap-11 w-full'>
              <h2 className='font-supremeMedium text-xl'>
                Like publique totaux
              </h2>
              <p className='font-tanker text-2xl tracking-wider'>
                {calculateTotalLikes(publicPlaylists)}
              </p>
            </div>
            <div className='flex flex-col gap-3 bg-black bg-opacity-20 rounded-xl p-4'>
              <h3 className='font-supremeMedium text-xl'>
                Vos genres préférés
              </h3>
              <ul className='flex justify-between'>
                {calculateTopGenres(publicPlaylists).map((genre, index) => (
                  <li
                    className='w-[30%] flex justify-center items-center bg-perso-mauve py-1 rounded-lg'
                    key={index}>
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauDeBord;
