import { useEffect, useState } from "react";
import fetchJsonp from "fetch-jsonp";
import { useInfos as useAuth } from "../../context/authContext";
import { useInfos } from "../../context/userContext";
import { useMusic } from "../../context/musicContext";
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, arrayUnion, } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import LikeBtn from "../LikeBtn";
import FormatMinutesSecondes from "../FormatMinutesSecondes";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ClipLoader from "react-spinners/ClipLoader";
import ListeArtiste from "./ListeArtiste";
import ListeAlbum from "./ListeAlbum";
import ItemMusiques from "./ItemMusiques";
import "./boutonsTri.css";
import "./listeRecherche.css";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import AjouterPlaylistPopUp from "./PopUp/AjouterPlaylistPopUp";


import { BsThreeDotsVertical } from "react-icons/bs";
// import { AnimatePresence, motion, useAnimation } from "framer-motion";

// ajout

const ListeRecherche = () => {
  const { createPlaylist, user } = useAuth();

  const { addMusicPlaying, playlistDetails } = useMusic();
  const { addToLikedSongs } = useInfos();

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [recherche, setRecherche] = useState([]);
  const [rechercheBtn, setRechercheBtn] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const debouncedSearchValue = useDebounce(rechercheBtn, 500);
  const [limitSearch, setLimitSearch] = useState(25);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isClickedTitre, setIsClickedTitre] = useState(true);
  const [clicTitre, setClicTitre] = useState(false);
  const [isClickedArtiste, setIsClickedArtiste] = useState(true);
  const [clicArtiste, setClicArtiste] = useState(false);
  const [isClickedAlbum, setIsClickedAlbum] = useState(true);
  const [clicAlbum, setClicAlbum] = useState(false);
  const [playlistPopUp, setPlaylistPopUp] = useState(false);

  const [getResultat, setGetResultat] = useState(null);

  const clicBoutonTitre = () => {
    setIsClickedTitre(true);
    setIsClickedArtiste(false);
    setIsClickedAlbum(false);
    setClicTitre(true);
    console.log(isClickedTitre);
  };



  const clicBoutonArtiste = () => {
    setIsClickedTitre(false);
    setIsClickedArtiste(true);
    setIsClickedAlbum(false);
    setClicArtiste(true);
    console.log(isClickedArtiste);
  };

  const clicBoutonAlbum = () => {
    setIsClickedTitre(false);
    setIsClickedArtiste(false);
    setIsClickedAlbum(true);
    console.log(isClickedAlbum);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [rechercheBtn, limitSearch]);

  const handleIsPublicChange = (e) => {
    setIsPublic(e.target.value === "public");
  };

  const selectPlaylist = (playlistId, resultat) => {
    setSelectedPlaylist(playlistId); // Met à jour l'état, mais sans dépendre de sa valeur immédiatement après
    console.log("SelectedPlaylist " + playlistId); // Affiche l'ID de la playlist sélectionnée

    if (isPublic) {
      addToPublicPlaylist(resultat, playlistId); // Passe l'ID de la playlist directement à la fonction
    } else {
      addToPlaylist(resultat, playlistId); // Passe l'ID de la playlist directement à la fonction
    }
  };


  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        console.log(userDoc);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.playlists) {
            setPlaylists(userData.playlists);
            console.log(userData.playlists);
          }
        }
      } catch (error) {
        console.error("Error fetching user's playlists:", error);
      }
    };
    const fetchPublicPlaylists = async () => {
      try {
        const publicPlaylistsColRef = collection(db, "publicPlaylists");
        const publicPlaylistsSnapshot = await getDocs(publicPlaylistsColRef);
        const fetchedPublicPlaylists = publicPlaylistsSnapshot.docs.map(
          (doc) => {
            const playlistData = {
              id: doc.id,
              ...doc.data(),
            };
            // console.log(playlistData.id);
            return playlistData;
          }
        );

        setPublicPlaylists(fetchedPublicPlaylists);
      } catch (error) {
        console.error("Error fetching public playlists:", error);
      }
    };

    fetchUserPlaylists();
    fetchPublicPlaylists();
  }, [user]);

  const addToPlaylist = async (songId, playlistId) => {
    try {
      const userUid = user.uid;
      const userRef = doc(db, "users", userUid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      console.log("Adding song to playlist " + playlistId);

      if (Array.isArray(userData.playlists) && userData.playlists.length > 0) {
        const selectedPlaylistObject = userData.playlists.find(
          (playlist) => playlist.id === playlistId
        );

        if (selectedPlaylistObject) {
          if (!selectedPlaylistObject.songs) {
            selectedPlaylistObject.songs = [];
          }

          const songData = recherche.find((song) => song.id === songId);

          const songObject = {
            id: songId,
            title: songData.title,
            artist: songData.artist.name,
            album: songData.album.cover_big,
          };

          selectedPlaylistObject.songs.push(songObject);

          await updateDoc(userRef, {
            playlists: userData.playlists,
          });

          console.log(`Added song ${songId} to playlist ${playlistId}`);
        } else {
          console.error("Selected playlist not found in user playlists data.");
        }
      } else {
        console.error("User playlists data is invalid or empty.");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };


  const addToPublicPlaylist = async (songId, playlistId) => {
    console.log(songId);
    try {
      const publicPlaylistsColRef = collection(db, "publicPlaylists");
      const publicPlaylistsSnapshot = await getDocs(publicPlaylistsColRef);
      const publicPlaylistsData = publicPlaylistsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const selectedPublicPlaylist = publicPlaylistsData.find(
        (playlist) => playlist.id === playlistId
      );

      if (selectedPublicPlaylist) {
        if (!selectedPublicPlaylist.songs) {
          selectedPublicPlaylist.songs = [];
        }

        const songData = recherche.find((song) => song.id === songId);
        const songObject = {
          id: songId,
          title: songData.title,
          artist: songData.artist.name,
          album: songData.album.cover_big,
        };

        selectedPublicPlaylist.songs.push(songObject);

        await updateDoc(doc(db, "publicPlaylists", selectedPublicPlaylist.id), {
          songs: selectedPublicPlaylist.songs,
        });

        console.log(
          `Added song ${songId} to public playlist ${selectedPublicPlaylist.id}`
        );
      } else {
        console.error(
          "Selected public playlist not found in public playlists data."
        );
      }
    } catch (error) {
      console.error("Error adding song to public playlist:", error);
    }
  };




  const like = (songId, additionalInfo) => {
    addToLikedSongs(songId, additionalInfo);
  };


  const resetSearch = () => {
    setRechercheBtn("");
    setRecherche([]);
    setLimitSearch(25);
  };

  const updateState = (e) => {
    setRechercheBtn(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Ne faire la requête que si debouncedSearchValue n'est pas vide
      if (debouncedSearchValue.trim() !== "") {
        try {
          setLoading(true);
          const response = await fetchJsonp(
            `https://api.deezer.com/search?q=track:\"${debouncedSearchValue}\"&output=jsonp&limit=${limitSearch}`
          );
          const json = await response.json();
          setRecherche(json.data);
          setLoading(false);
        } catch (error) {
          console.log("Error fetching data", error);
          setLoading(false);
        }
      } else {
        // Si debouncedSearchValue est vide, on s'assure qu'il n'y a pas de résultats affichés
        setRecherche([]);
      }
    };
    fetchData();
  }, [debouncedSearchValue, limitSearch]);

  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetchJsonp(
  //         // `https://api.deezer.com/search?q=${rechercheFiltre}:\"${debouncedSearchValue}\"&output=jsonp&limit=${limitSearch}`
  //         `https://api.deezer.com/search?q=track:\"${debouncedSearchValue}\"&output=jsonp&limit=${limitSearch}`
  //       );
  //       const json = await response.json();
  //       setRecherche(json.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("Error fetching data", error);
  //     }
  //   };
  //   fetchData();
  // }, [debouncedSearchValue, limitSearch]);


  const click = (resul) => {
    playlistDetails(null);
    addMusicPlaying(resul.id);
  };

  const loadMore = () => {
    setLimitSearch(limitSearch + 25);
  };


  const openPopUp = (type) => {
    if (type === "public") {
      setIsPublic(true);
      setPlaylistPopUp(!playlistPopUp);
    } else {
      setIsPublic(false);
      setPlaylistPopUp(!playlistPopUp);
    }
  }

  if (recherche === null) return null;



  return (
    <div className='flex flex-col gap-6 lg:w-[80%] w-full items-center min-h-screen text-white mt-20 relative lg:text-black  lg:items-start'>

      <Helmet>
        <title>SoundWave | Recherche</title>
      </Helmet>

      <AjouterPlaylistPopUp selectedPlaylist={selectedPlaylist} setSelectedPlaylist={setSelectedPlaylist} selectPlaylist={selectPlaylist} addToPlaylist={addToPlaylist} addToPublicPlaylist={addToPublicPlaylist} resultat={getResultat} setIsPublic={() => setIsPublic(!isPublic)} open={playlistPopUp} setOpen={() => setPlaylistPopUp(!playlistPopUp)} isPublic={isPublic} playlists={playlists} publicPlaylists={publicPlaylists} />

      <div className="w-[100%] relative">
        <IoMdSearch className={`text-3xl z-10 absolute top-[0.82rem] left-5 text-perso-mauvePale`} />

        <AnimatePresence>
          {rechercheBtn.length !== 0 && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRechercheBtn("")}>
              <IoMdClose className={`text-3xl p-1 z-10  absolute top-[0.8rem] right-5 bg-perso-mauveLecteur border-2 rounded-full border-perso-mauvePale text-white`} />
            </motion.button>
          )}
        </AnimatePresence>
        <motion.input
          initial={{ width: "10%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, type: "spring" }}
          className='bg-perso-mauve border-perso-mauvePale border-2 w-full h-14 pl-16 rounded-full text-xl focus:outline-none placeholder-perso-mauveLecteur text-white'
          type='input'
          name='recherche'
          value={rechercheBtn}
          autoComplete="off"
          onChange={updateState}
          placeholder='Rechercher'>
        </motion.input>
      </div>

      {/* GESTION DE L'AFFICHAGE*/}

      {/* Avant la recherche */}
      {recherche.length === 0 ? (
        <div className="w-full h-full justify-center relative flex text-white font-bold text- mt-4">
          <span>
            Recherchez un titre pour afficher les résultats
          </span>
        </div>
      ) :
        (

          // Après la recherche
          <div className="w-full flex flex-col gap-3" >
            {/* Boutons pour type de tri */}
            {/* <div className=" pt-6 pb-12 lg:pb-16">
              <div className='flex flex-row self-center mt-4 justify-evenly -top-6 text-white text-center lg:-top-16'>
                <button onClick={clicBoutonTitre} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-perso-mauvePale to-perso-bleuFonce group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:white  md:w-36 md:text-lg md:mx-2 xl:w-60 xl:text-xl">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-whiterounded-md group-hover:bg-opacity-0">
                    Par titre
                  </span>
                </button>

                <button onClick={clicBoutonArtiste} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-perso-mauvePale to-perso-bleuFonce group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:white  md:w-36 md:text-lg md:mx-2 xl:w-60 xl:text-xl">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-whiterounded-md group-hover:bg-opacity-0">
                    Par artiste
                  </span>
                </button>

                <button onClick={clicBoutonAlbum} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-perso-mauvePale to-perso-bleuFonce group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:white  md:w-36 md:text-lg md:mx-2 xl:w-60 xl:text-xl">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-whiterounded-md group-hover:bg-opacity-0">
                    Par album
                  </span>
                </button>
              </div>
            </div> */}


            {/* Ajout à une liste de lecture */}
            {/* <div className="text-center pt-4 text-base text-white lg:pt-0 lg:text-lg xl:text-xl">
              <button onClick={AjouterPlaylist} className='mr-4'>Ajouter à une liste</button>
              <select className="border rounded-lg" onChange={(e) => {setSelectedPlaylist(e.target.value); console.log(e.target.value);}}>
                <option value=''>Choisir</option>
                {isPublic
                  ? publicPlaylists.map((playlist) => (
                    <option
                      key={playlist.id}
                      value={playlist.id}>
                      {playlist.titre}
                    </option>
                  ))
                  : playlists.map((playlist) => (
                    <option
                      key={playlist.id}
                      value={playlist.id}>
                      {playlist.titre}
                    </option>
                  ))}
              </select>
              <div className="mt-2 text-base lg:text-lg xl:text-xl">
                <label className="mr-2">
                  <input
                    className='mr-1'
                    type='radio'
                    value='public'
                    checked={isPublic}
                    onChange={handleIsPublicChange}
                  />
                  Publique
                </label>
                <label className="ml-2">
                  <input
                    className='mr-1'
                    type='radio'
                    value='private'
                    checked={!isPublic}
                    onChange={handleIsPublicChange}
                  />
                  Privée
                </label>
              </div>
            </div> */}

            {/* Affichage des résultats par défaut*/}

            {isClickedTitre ? (
              <div className="flex flex-col w-full mt-12 pb-24 lg:pb-0">
                <InfiniteScroll
                  dataLength={recherche.length}
                  next={loadMore}
                  hasMore={true}
                  loader={null}
                  style={{ overflow: "visible" }}
                  className="flex flex-col w-full gap-4"
                >



                  {recherche.map((resultat, index) => (
                    <ItemMusiques
                      resultat={resultat}
                      setGetResultat={setGetResultat}
                      index={index}
                      click={click}
                      like={like}
                      addToPlaylist={() => addToPlaylist(resultat.id)}
                      addToPublicPlaylist={() => addToPublicPlaylist(resultat.id)}
                      openPopUp={openPopUp}
                    />
                    // <div className="flex flex-row h-24 items-center list-none lg:bg-perso-bleuPale rounded-lg px-2" key={index}>
                    //   <div
                    //     onClick={() => click(resultat)}
                    //     key={index}>
                    //     {resultat.album && resultat.album.cover && (
                    //       <img
                    //         className='h-[70%] w-[70%] rounded-lg cursor-pointer'
                    //         src={resultat.album.cover}
                    //         alt=''
                    //       />
                    //     )}
                    //   </div>

                    //   <div className="flex flex-row w-full items-center justify-center text-sm md:text-base lg:text-lg">
                    //     <div className="truncate w-1/3 ml-2">
                    //       {resultat.title.length > 30 ? (
                    //         <span className="text-ellipsis font-bold ">{`${resultat.title.substring(0, 30)}...`}</span>
                    //       ) : (
                    //         <span className="font-bold">{resultat.title}</span>
                    //       )}
                    //       <li className="">{resultat.artist.name}</li>
                    //     </div>

                    //     <div className="w-1/3 ml-2">
                    //       {resultat.album.title.length > 30 ? (
                    //         <span className="text-ellipsis font-bold">{`${resultat.album.title.substring(0, 30)}...`}</span>
                    //       ) : (
                    //         <span className="font-bold">{resultat.album.title}</span>
                    //       )}
                    //     </div>

                    //     <div className="font-bold w-1/6 text-center">
                    //       <FormatMinutesSecondes secondes={resultat.duration} />
                    //     </div>

                    //     <div className="flex items-center justify-end gap-6 mr-5 w-1/6">

                    //       <div className=" flex flex-row-reverse items-center justify-center text-center">
                    //         <button
                    //           className='bg-transparent w-7 h-7'
                    //           onClick={() =>
                    //             like(resultat.id, {
                    //               title: resultat.title,
                    //               artist: resultat.artist.name,
                    //               album: resultat.album && resultat.album.cover,
                    //             })
                    //           }
                    //         >
                    //           <LikeBtn id={resultat.id} />
                    //         </button>
                    //       </div>

                    //       <div className="relative text-center">

                    //         <button
                    //           onClick={() =>
                    //             isPublic
                    //               ? addToPublicPlaylist(resultat.id)
                    //               : addToPlaylist(resultat.id)
                    //           }
                    //         >
                    //           <BsThreeDotsVertical className='mt-2 text-xl' />
                    //           <div className="text-sm"></div>
                    //         </button>
                    //       </div>
                    //     </div>
                    //   </div>

                    // </div>
                  ))}

                </InfiniteScroll>
                {loading && (
                  <div className='text-white text-center mt-4'>
                    <ClipLoader
                      color={"#ffffff"}
                      loading={loading}
                      size={150}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )}
              </div>) : null}
            {!isClickedTitre && isClickedArtiste ? <ListeArtiste recherche={recherche} /> : null}
            {!isClickedTitre && isClickedAlbum ? <ListeAlbum recherche={recherche} /> : null}
          </div>
        )}
    </div>
  );
};

export default ListeRecherche;

