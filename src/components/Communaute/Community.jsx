import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useInfos } from "../../context/userContext";
import CreatePlaylistForm from "./CreatePlaylistForm";
import { db } from "../../config/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Helmet } from "react-helmet";
import { FaPlus } from "react-icons/fa";

import PlaylistPublicCommu from "./PlaylistsPublicCommu";
const Community = () => {
  const { user, addCommentToPlaylist, likePublicPlaylist } = useInfos();
  const { theme } = useParams();
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const musicGenres = [
    "Jazz",
    "Rock",
    "Pop",
    "Classical",
    "Hip Hop",
    "Country",
    "Electronic",
  ];

  const handleCommentSubmit = async (playlistId, commentContent) => {
    await addCommentToPlaylist(playlistId, commentContent);
  };

  useEffect(() => {
    const fetchPublicPlaylists = async () => {
      try {
        const publicPlaylistsColRef = collection(db, "publicPlaylists");

        const unsubscribe = onSnapshot(publicPlaylistsColRef, (snapshot) => {
          const fetchedPublicPlaylists = snapshot.docs.map((doc) => {
            const playlistData = doc.data();

            return {
              id: doc.id,
              titre: playlistData.titre,
              creator: playlistData.creator,
              evaluations: playlistData.evaluations || 0,
              comments: playlistData.comments || [],
              songs: playlistData.songs || [],
              likes: playlistData.likes || [],
              theme: playlistData.theme,
              genres: playlistData.genres || [],
            };
          });

          const filteredPlaylists = fetchedPublicPlaylists.filter(
            (playlist) =>
              (!selectedTheme || playlist.theme === selectedTheme) &&
              (!selectedGenre || playlist.genres.includes(selectedGenre))
          );
          setPublicPlaylists(filteredPlaylists);
        });

        // Remember to unsubscribe when the component unmounts
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching public playlists:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersColRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersColRef);
        const fetchedUsers = usersSnapshot.docs.map((userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      console.log("user", user);
    };

    // Call both functions independently
    fetchPublicPlaylists();
    fetchUsers();
  }, [user, selectedTheme, selectedGenre]);

  return (
    <div className='w-[90%] pt-20 pb-40 lg:pb-22 min-h-screen flex flex-col gap-10 items-start'>
      <Helmet>
        <title>SoundWave | Communauté</title>
      </Helmet>

      <CreatePlaylistForm
        open={createPlaylist}
        setOpen={() => setCreatePlaylist(!createPlaylist)}
      />

      {/* <h1>Playlists Publiques {selectedTheme}</h1> */}
      <div className='w-full flex flex-col gap-10'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='font-tanker text-5xl'>Communauté</h1>
          {/* Creation playlist */}
          {user && (
            <button
              className='bg-[#6744A3] h-9 w-9 flex items-center justify-center text-sm  border-2 rounded-full border-perso-mauvePale'
              onClick={() => setCreatePlaylist(!createPlaylist)}>
              <FaPlus />
            </button>
          )}
        </div>
        <ul className='flex whitespace-nowrap gap-7 w-full pb-2 overflow-x-scroll'>
          <li
            style={{
              backgroundColor: selectedGenre == "" ? "#8D5DDE" : "#633F9E",
            }}
            className='bg-[#8D5DDE] px-10 py-2 rounded-lg'>
            <button onClick={() => setSelectedGenre("")}>
              Tous les genres
            </button>
          </li>
          {musicGenres.map((genre) => (
            <li
              style={{
                backgroundColor: selectedGenre == genre ? "#8D5DDE" : "#633F9E",
              }}
              className='bg-[#8D5DDE] rounded-lg'
              key={genre}>
              <button
                className='px-14 py-2'
                onClick={() => setSelectedGenre(genre)}>
                {genre}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <PlaylistPublicCommu publicPlaylists={publicPlaylists} />
      {/* {publicPlaylists.length > 0 ? (
        <ul>
          {publicPlaylists.map((playlist) => (
            <li key={playlist.id}>
              {console.log(playlist)}
              <Link to={`/playlists/public/${playlist.id}`}>{playlist.titre}</Link>
              <p>Createur: {playlist.creator}</p>
              <h3>Genres:</h3>
              <h3>Musiques:</h3>
              {playlist.songs && playlist.songs.length > 0 ? (
                <ul>
                  {playlist.songs.map((song, index) => (
                    <li key={index}>{song.title} by {song.artist}</li>
                  ))}
                </ul>
              ) : (
                <p>Pas de chansons pour cette playlist.</p>
              )}
              <h3>Commentaires:</h3>
              {playlist.comments.length > 0 ? (
                <ul>
                  {playlist.comments.map((comment, index) => (
                    <li key={index}>
                      {users.find((u) => u.id === comment.user)?.displayName || 'User Mystère?'}: {comment.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Pas de commentaires pour cette playlist.</p>
              )}
              <h3>Likes: {playlist.likes ? playlist.likes.length : 0}</h3>

              <button onClick={() => likePublicPlaylist(playlist.id)}>
                {playlist.likes && playlist.likes.includes(user.uid) ? 'Unlike Playlist' : 'Like Playlist'}
              </button>
              <CreateCommentaireForm playlistId={playlist.id} onCommentSubmit={handleCommentSubmit} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Pas de playlists pour ce genre de musique</p>
      )} */}
    </div>
  );
};

export default Community;
