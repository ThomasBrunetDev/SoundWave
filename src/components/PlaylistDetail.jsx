import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInfos } from "../context/userContext";
import { useMusic } from "../context/musicContext";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Reorder } from "framer-motion";
import ItemPlaylist from "./ItemPlaylist";
import { MdModeEdit, MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

const PlaylistDetail = () => {
  const { idPlaylist } = useParams();
  const {
    user,
    fetchPlaylistDetails,
    deleteSongFromPlaylist,
    rearrangeSongsInPlaylist,
    addToLikedSongs,
    changePlaylistName,
  } = useInfos();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false); // Add state for editing name
  const [newPlaylistName, setNewPlaylistName] = useState(""); // Add state for the new playlist name
  const { addMusicPlaying, playlistDetails, selectedMusicObj } = useMusic();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [playlistSongs, setPlaylistSongs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistDetails = await fetchPlaylistDetails(idPlaylist);
        setPlaylistSongs(playlistDetails.songs); // Supposons que les chansons de la playlist soient dans la propriété "songs"
        setPlaylist(playlistDetails);
        setNewPlaylistName(playlistDetails.titre);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [idPlaylist, fetchPlaylistDetails]);

  const handleDeleteSong = async (songId) => {
    try {
      await deleteSongFromPlaylist(idPlaylist, songId);

      const updatedPlaylist = await fetchPlaylistDetails(idPlaylist);
      setPlaylist(updatedPlaylist);
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };
  const handleEditName = async () => {
    try {
      // Update the playlist name in Firebase
      await changePlaylistName(newPlaylistName, idPlaylist);

      // Refetch the playlist details with the updated name
      const updatedPlaylist = await fetchPlaylistDetails(idPlaylist);
      setPlaylist(updatedPlaylist);

      setEditingName(false); // Turn off editing mode
    } catch (error) {
      console.error("Error updating playlist name:", error);
    }
  };

  const handleReorderSongs = (playlist) => {
    setPlaylistSongs(playlist);
    rearrangeSongsInPlaylist(
      idPlaylist,
      playlistSongs.map((song) => song.id)
    );
  };


  const click = (music) => {
    addMusicPlaying(music.id);
    playlistDetails(playlist);
  };
  const like = (songId, song) => {
    const additionalInfo = {
      title: song.title,
      artist: song.artist,
      album: song.album,
    };
    console.log(additionalInfo);
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
    <div className='pb-40 min-h-screen w-full flex flex-col items-start'>
      {playlist !== null ? (
        <div className='w-full flex flex-col gap-10 items-center'>
          <div
            style={{
              backgroundImage: `url(${
                playlist.songs == null
                  ? "https://images.unsplash.com/photo-1701990630137-005958559f36?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  : playlist.songs[playlist.songs.length - 1].album
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
              <div className='flex gap-4'>
                {editingName ? (
                  <>
                    <input
                      type='text'
                      value={newPlaylistName}
                      className="w-full bg-transparent border-b-2 border-white text-white font-tanker text-4xl"
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                    <div className="flex gap-3 items-center text-xl">

                    <button onClick={handleEditName}>
                      <FaCheck  />
                    </button>
                    <button onClick={() => setEditingName(false)}>
                      <MdCancel  />
                    </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className='font-tanker text-4xl'>{playlist.titre}</h1>
                    <button onClick={() => setEditingName(true)}>
                      <MdModeEdit className='text-xl' />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='w-full flex items-center justify-center'>
            {playlist.songs && playlist.songs.length > 0 ? (
              <Reorder.Group
                className='flex flex-col gap-5 w-[80%] overflow-hidden'
                axis='y'
                onReorder={handleReorderSongs}
                values={playlistSongs}>
                {playlistSongs.map((song, index) => (
                  <ItemPlaylist
                    key={song.id} // Assure-toi d'avoir une propriété unique pour la clé
                    song={song}
                    index={index}
                    screenWidth={screenWidth} // Assure-toi d'avoir screenWidth défini dans ton composant parent
                    selectedMusicObj={selectedMusicObj} // Assure-toi d'avoir selectedMusicObj défini dans ton composant parent
                    click={click}
                    like={like} // Assure-toi d'avoir handleLikeSong défini dans ton composant parent
                    handleDeleteSong={handleDeleteSong}
                  />
                ))}
              </Reorder.Group>
            ) : (
              <div className='flex flex-col justify-center h-52 items-center w-full'>
                <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>
                  Il n'y a pas encore de <br /> musiques pour cette liste
                </h1>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PlaylistDetail;
