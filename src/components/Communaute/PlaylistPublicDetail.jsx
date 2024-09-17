import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../config/firebase";
import { useInfos } from "../../context/userContext";
import { useMusic } from "../../context/musicContext";
import LikeBtn from "../LikeBtn";
import IsPlaying from "../IsPlaying";
import PopUpGenre from "./PopUpGenre";
import Loading from "../TableauDeBord/Loading";
import CreateCommentaireForm from "./CreateCommentaireForm";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdModeEdit, MdCancel } from "react-icons/md";
import { FaPlay, FaHashtag, FaRegComment, FaCheck } from "react-icons/fa6";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import "./publicPlaylist.css";
const PlaylistPublicDetail = () => {
  const { idPlaylist } = useParams();
  const {
    user,
    fetchPublicPlaylistDetails,
    deleteComment,
    addToLikedSongs,
    likePublicPlaylist,
    addCommentToPlaylist,
    deleteSongFromPublicPlaylist,
    changePublicPlaylistName,
  } = useInfos();
  const [publicPlaylist, setPublicPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDisplayNames, setUserDisplayNames] = useState({});
  const { addMusicPlaying, playlistDetails, selectedMusicObj } = useMusic();
  const [commentairesVisible, setCommentairesVisible] = useState(false);
  const [genresVisible, setGenresVisible] = useState(false);
  const [createComment, setCreateComment] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(
    publicPlaylist ? publicPlaylist.titre : ""
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const publicPlaylistDetails = await fetchPublicPlaylistDetails(
          idPlaylist
        );
        setPublicPlaylist(publicPlaylistDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching public playlist details:", error);
        setLoading(false);
      }
    };

    const fetchUserDisplayNames = async () => {
      try {
        if (
          publicPlaylist &&
          publicPlaylist.comments &&
          publicPlaylist.comments.length > 0
        ) {
          const uniqueUserIds = Array.from(
            new Set(publicPlaylist.comments.map((comment) => comment.user))
          );

          const displayNames = {};

          for (const uid of uniqueUserIds) {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              displayNames[uid] = userDocSnap.data().displayName;
            } else {
              displayNames[uid] = "Unknown User";
            }
          }

          setUserDisplayNames(displayNames);
        }
      } catch (error) {
        console.error("Error fetching user display names:", error);
      }
    };

    fetchData();
    fetchUserDisplayNames();
  }, [idPlaylist, fetchPublicPlaylistDetails]);
  const handleLikeClick = async () => {
    // Call the likePublicPlaylist function
    await likePublicPlaylist(idPlaylist);

    // Fetch the updated playlist data
    const updatedPlaylist = await fetchPublicPlaylistDetails(idPlaylist);

    // Update the state with the new playlist data
    setPublicPlaylist(updatedPlaylist);
  };

  const handleCreateComment = async (content) => {
    try {
      const commentId = uuidv4();

      const newComment = {
        id: commentId,
        content,
        user: user.uid,
      };

      await addDoc(collection(db, "comments", idPlaylist), newComment);

      setPublicPlaylist((prevPlaylist) => {
        return {
          ...prevPlaylist,
          comments: [...prevPlaylist.comments, newComment],
        };
      });
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleCommentSubmit = async (playlistId, commentContent) => {
    console.log("Submitting comment:", commentContent);

    try {
      const commentId = uuidv4();

      const newComment = {
        id: commentId,
        content: commentContent, // Use commentContent parameter
        username: user.displayName,
        user: user.uid,
        userImg: user.photoURL,
      };

      // Add comment to the playlist
      await addCommentToPlaylist(playlistId, commentContent);

      // Update the local state to display the new comment
      setPublicPlaylist((prevPlaylist) => {
        return {
          ...prevPlaylist,
          comments: [...prevPlaylist.comments, newComment],
        };
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleEditTitle = () => {
    setEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    try {
      // Appelle la fonction pour changer le nom de la liste publique
      await changePublicPlaylistName(newTitle, idPlaylist);

      // Récupère les données mises à jour de la liste publique
      const updatedPlaylist = await fetchPublicPlaylistDetails(idPlaylist);

      // Met à jour l'état avec les nouvelles données de la liste publique
      setPublicPlaylist(updatedPlaylist);

      // Quitte le mode édition
      setEditingTitle(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du titre de la liste publique :", error);
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
      const commentToDelete = publicPlaylist.comments.find(
        (comment) => comment.id === commentId
      );

      if (!commentToDelete) {
        console.error("Comment not found in publicPlaylist data.");
        return;
      }

      await deleteComment(idPlaylist, commentId);

      setPublicPlaylist((prevPlaylist) => {
        const updatedComments = prevPlaylist.comments.filter(
          (comment) => comment.id !== commentId
        );

        return {
          ...prevPlaylist,
          comments: updatedComments,
        };
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      // console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      // Call the function from userContext to delete the song
      await deleteSongFromPublicPlaylist(idPlaylist, songId);

      // Fetch the updated playlist data
      const updatedPlaylist = await fetchPublicPlaylistDetails(idPlaylist);

      // Update the state with the new playlist data
      setPublicPlaylist(updatedPlaylist);
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const click = (music) => {
    addMusicPlaying(music.id);
    console.log(selectedMusicObj);
    playlistDetails(publicPlaylist);
  };

  const like = (songId, song) => {
    const additionalInfo = {
      title: song.title,
      artist: song.artist,
      album: song.album,
    };
    addToLikedSongs(songId, additionalInfo);
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
    <div
      className={`${selectedMusicObj && screenWidth < 1024 && commentairesVisible
        ? "pb-56"
        : "pb-40"
        } min-h-screen w-full flex flex-col items-start`}>
      {/* Fait un retour vers larriere */}

      {publicPlaylist !== null ? (
        <div className='w-full flex flex-col gap-10 items-center'>
          {console.log(publicPlaylist)}
          <div
            style={{
              backgroundImage: `url(${publicPlaylist.songs == null
                ? "https://images.unsplash.com/photo-1701990630137-005958559f36?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : publicPlaylist.songs[publicPlaylist.songs.length - 1].album
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
            {publicPlaylist.genres.length != 0 && screenWidth < 1024 && (
              <button
                onClick={() => setGenresVisible(!genresVisible)}
                className='absolute  top-5 right-5 text-2xl z-10 p-2 rounded-full bg-perso-mauve '>
                <FaHashtag />
              </button>
            )}

            <div className='public-playlist-cover flex w-full h-full backdrop-brightness-75 gap-1 items-end justify-start p-6 px-12'>
              <div className='flex items-center w-full justify-between'>
                <div>
                  <div className='flex gap-4'>
                    {editingTitle ? (
                      <>
                        <input
                          type='text'
                          value={newTitle}
                          className="w-full bg-transparent border-b-2 border-white text-white font-tanker text-4xl"
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <div className="flex gap-3 items-center text-xl">
                          <button onClick={handleSaveTitle}>
                            <FaCheck />
                          </button>
                          <button onClick={() => setEditingTitle(false)}>
                            <MdCancel />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h1 className='font-tanker text-4xl'>
                          {screenWidth < 1280 && publicPlaylist.titre.length > 15
                            ? `${publicPlaylist.titre.substring(0, 15)}...`
                            : publicPlaylist.titre}
                        </h1>
                        {user && user.uid === publicPlaylist.creatorId && (
                          <button onClick={() => {
                            setNewTitle(publicPlaylist.titre);  // Met à jour newTitle avec le titre actuel
                            setEditingTitle(true);
                          }}>
                            <MdModeEdit className='text-xl' />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <h2 className='text-gray-300'>
                    {publicPlaylist.creator || "Unknown User"}
                  </h2>
                  {publicPlaylist.genres.length > 0 && screenWidth > 1024 && (
                    <div className='flex gap-2 mt-2'>
                      {publicPlaylist.genres.map((genre, index) => (
                        <span
                          key={index}
                          className='text-xs px-2 py-1 bg-[#754ABA] text-white rounded-md'>
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {user && (
                  <button
                    onClick={() => handleLikeClick()}
                    className='flex items-center justify-center text-2xl gap-3'>
                    {publicPlaylist.likes &&
                      publicPlaylist.likes.includes(user.uid) ? (
                      <BiSolidLike />
                    ) : (
                      <BiLike />
                    )}
                    {publicPlaylist.likes ? publicPlaylist.likes.length : 0}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='flex justify-between w-[80%] h-10 rounded-xl overflow-hidden'>
            <button
              style={{
                backgroundColor: !commentairesVisible ? "#754ABA" : "#422a69",
              }}
              className='bg-[#422a69] w-[45%] rounded-xl'
              onClick={() => setCommentairesVisible(false)}>
              Musiques
            </button>
            <button
              style={{
                backgroundColor: commentairesVisible ? "#754ABA" : "#422a69",
              }}
              className='bg-[#754ABA] w-[45%] rounded-xl'
              onClick={() => setCommentairesVisible(true)}>
              Commentaires
            </button>
          </div>

          {!commentairesVisible ? (
            <div className='w-full flex items-center justify-center'>
              {publicPlaylist.songs && publicPlaylist.songs.length > 0 ? (
                <ul className='flex flex-col gap-5 w-[80%]'>
                  <AnimatePresence>
                    {publicPlaylist.songs.map((song, index) => (
                      <motion.li
                        initial={{ opacity: 0, translateY: 10 }}
                        animate={{
                          opacity: 1,
                          translateY: 1,
                          transition: { delay: index * 0.03 },
                        }}
                        exit={{ opacity: 0, translateY: 10 }}
                        className='flex items-center justify-between w-full transition-colors rounded-xl lg:pr-3 hover:bg-black hover:bg-opacity-30'
                        key={index}>
                        <div className='flex items-center gap-4'>
                          <img
                            src={song.album}
                            alt={`Album: ${song.title}`}
                            className='w-14 h-14 rounded-md'
                          />

                          <div className=''>
                            <h1>
                              {screenWidth < 1024 && song.title.length > 25
                                ? `${song.title.substring(0, 25)}...`
                                : song.title}
                            </h1>
                            <p className='text-[#C2C2C2]'>{song.artist}</p>
                          </div>
                        </div>
                        <div className='flex items-center gap-4'>
                          {selectedMusicObj &&
                            selectedMusicObj.id === song.id ? (
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
                          {user && (
                            <>
                              <button
                                className='w-7 h-7'
                                onClick={() => like(song.id, song)}>
                                <LikeBtn id={song.id} />
                              </button>
                              {user &&
                                user.uid === publicPlaylist.creatorId && (
                                  <button
                                    className='text-3xl text-red-500'
                                    onClick={() => handleDeleteSong(song.id)}>
                                    <IoClose />
                                  </button>
                                )}
                            </>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className='flex flex-col justify-center h-52 items-center w-full'>
                  <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
                    Il n'y a pas encore de <br /> musiques pour cette liste
                  </h1>
                </div>
              )}
            </div>
          ) : (
            <div className='w-full flex flex-col items-center justify-center'>
              {publicPlaylist.comments && publicPlaylist.comments.length > 0 ? (
                <ul className='flex flex-col gap-6 w-[80%] max-w-[80%]'>
                  {publicPlaylist.comments.map((comment, index) => (
                    <motion.li
                      initial={{ opacity: 0, translateY: 10 }}
                      animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: { delay: index * 0.05 },
                      }}
                      exit={{ opacity: 0, translateY: 10 }}
                      className='flex items-center justify-center gap-3'
                      key={index}>
                      <img
                        className='rounded-full self-start h-11'
                        src={comment.userImg}
                        alt={comment.username}
                      />
                      {user ? (
                        <>
                          {(user && user.uid === comment.user) ||
                            user.uid === publicPlaylist.creatorId ? (
                            <div className='flex w-full gap-3'>
                              <div className=' bg-[#754ABA] w-full  rounded-2xl p-3 flex flex-col gap-1'>
                                <h2 className='font-bold opacity-75'>
                                  {comment.username}
                                </h2>
                                <p
                                  style={{
                                    maxWidth: "100%",
                                    wordWrap: "break-word",
                                  }}>
                                  {comment.content}
                                </p>
                              </div>
                              <button
                                className='text-2xl'
                                onClick={() => handleDeleteComment(comment.id)}>
                                <IoClose />
                              </button>
                            </div>
                          ) : (
                            <div
                              key={index}
                              className=' bg-[#754ABA] w-full rounded-2xl p-3 flex flex-col gap-1'>
                              <h2 className='font-bold opacity-75'>
                                {comment.username}
                              </h2>
                              <p className=' max-w-[100%] break-words'>
                                {comment.content}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          key={index}
                          className=' bg-[#754ABA] w-full rounded-2xl p-3 flex flex-col gap-1'>
                          <h2 className='font-bold opacity-75'>
                            {comment.username}
                          </h2>
                          <p className=' max-w-[100%] break-words'>
                            {comment.content}
                          </p>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className='flex flex-col justify-center h-52 items-center w-full'>
                  <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
                    Aucun commentaire pour <br /> cette liste publique
                  </h1>
                </div>
              )}

              <CreateCommentaireForm
                setOpen={() => setCreateComment(false)}
                playlistId={idPlaylist}
                onCommentSubmit={handleCommentSubmit}
                open={createComment}
              />
              <AnimatePresence>
                {user && (
                  <>
                    {!createComment && (
                      <>
                        {screenWidth < 1024 ? (
                          <motion.button
                            initial={{ opacity: 0, translateY: 20 }}
                            animate={{
                              opacity: 1,
                              translateY: 1,
                            }}
                            exit={{ opacity: 0, translateY: 20 }}
                            onClick={() => setCreateComment(!createComment)}
                            style={{
                              bottom: selectedMusicObj ? "10rem" : "7rem",
                            }}
                            className={
                              "comment-bulle bg-perso-mauvePale p-3 text-2xl rounded-full fixed shadow-md"
                            }>
                            <FaRegComment />
                          </motion.button>
                        ) : (
                          <motion.button
                            initial={{ opacity: 0, translateY: 20 }}
                            animate={{
                              opacity: 1,
                              translateY: 1,
                            }}
                            exit={{ opacity: 0, translateY: 20 }}
                            onClick={() => setCreateComment(!createComment)}
                            style={{
                              bottom: selectedMusicObj ? "6rem" : "2rem",
                            }}
                            className={
                              "comment-bulle bg-perso-mauvePale p-3 text-2xl rounded-full fixed shadow-md"
                            }>
                            <FaRegComment />
                          </motion.button>
                        )}
                      </>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
          <AnimatePresence>
            {publicPlaylist.genres.length != 0 &&
              genresVisible &&
              screenWidth < 1024 && (
                <PopUpGenre genres={publicPlaylist.genres} />
              )}
          </AnimatePresence>
        </div>
      ) : (
        <div className='w-full h-screen flex items-center justify-center'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default PlaylistPublicDetail;
