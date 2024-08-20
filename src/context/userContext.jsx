import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc, setDoc, collection, addDoc, deleteDoc, increment } from "firebase/firestore";
import { db } from "../config/firebase";
import React, { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';


const auth = getAuth();




const userContext = React.createContext({
  createPlaylist: async (playlistTitle) => { },
  fetchPlaylistDetails: async (playlistId) => { },
  deleteSongFromPlaylist: async (playlistId, songId) => { },
  addCommentToPlaylist: async (playlistId, onCommentSubmit) => { },
  createPublicPlaylist: async (playlistTitle, selectedGenres) => { },
  fetchPublicPlaylistDetails: async (playlistId) => { },
  deletePlaylist: async (playlistId) => { },
  deleteComment: async (playlistId, commentId) => { },
  rearrangePlaylist: async (newOrder) => { },
  rearrangeSongsInPlaylist: async (playlistId, newOrder) => { },
  likePublicPlaylist: async (playlistId) => { },
  addToLikedSongs: async (songId, additionalInfo) => { },
  deletePublicPlaylist: async (playlistId, user) => { },
  changePlaylistName: async (playlistId, newName) => { },
  deleteSongFromPublicPlaylist: async (playlistId, songId) => { },
  changePublicPlaylistName: async (newPlaylistName, playlistId) => { },
  checkIfLiked: async (songId) => { },
  user: null,
  v_: 0,
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const deletePlaylist = async (playlistId) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {

        const updatedPlaylists = userDocSnap
          .data()
          .playlists.filter((playlist) => playlist.id !== playlistId);

        await updateDoc(userDocRef, {
          playlists: updatedPlaylists,
        });

        console.log(`Playlist ${playlistId} deleted successfully`);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };
  const changePlaylistName = async (newPlaylistName, playlistId) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userPlaylists = userDocSnap.data().playlists || [];

        // Find the index of the playlist with the specified ID
        const indexToUpdate = userPlaylists.findIndex(playlist => playlist.id === playlistId);

        if (indexToUpdate !== -1) {
          // Update the 'titre' field of the playlist in the local array
          userPlaylists[indexToUpdate].titre = newPlaylistName;

          // Update the user document with the modified playlists array
          await updateDoc(userDocRef, { playlists: userPlaylists });

          console.log(`Playlist ${playlistId} name updated successfully`);
        } else {
          console.error(`Playlist with ID ${playlistId} not found in user's playlists`);
        }
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error updating playlist name:', error);
    }
  };
  const changePublicPlaylistName = async (newPlaylistName, playlistId) => {
    try {

      const publicPlaylistDocRef = doc(db, 'publicPlaylists', playlistId);
      const publicPlaylistDocSnap = await getDoc(publicPlaylistDocRef);

      if (publicPlaylistDocSnap.exists()) {
        // Update the 'titre' field of the public playlist
        await updateDoc(publicPlaylistDocRef, { titre: newPlaylistName });

        console.log(`Public playlist ${playlistId} name updated successfully`);
      } else {
        console.error(`Public playlist with ID ${playlistId} not found`);
      }
    } catch (error) {
      console.error('Error updating public playlist name:', error);
    }
  };




  const deletePublicPlaylist = async (playlistId, user) => {
    try {
      // Delete from publicPlaylists collection
      const publicPlaylistDocRef = doc(db, "publicPlaylists", playlistId);
      await deleteDoc(publicPlaylistDocRef);

      // Find and delete from users collection
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userPlaylists = userDocSnap.data().publicPlaylists || [];
        const updatedPlaylists = userPlaylists.filter((playlist) => playlist.id
          !== playlistId);

        if (userPlaylists.length !== updatedPlaylists.length) {
          await updateDoc(userDocRef, {
            publicPlaylists: updatedPlaylists,
          });

          console.log(`Public playlist ${playlistId} deleted successfully`);
        } else {
          console.error("Playlist not found in user's public playlists");
        }
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error deleting public playlist:", error);
    }
  };

  const createPlaylist = async (playlistTitle) => {
    try {
      if (!user) {
        console.error("User not logged in");
        return;
      }

      const newPlaylistId = uuidv4();

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {

        await updateDoc(userDocRef, {
          playlists: [
            ...(userDocSnap.data().playlists || []),
            { id: newPlaylistId, titre: playlistTitle },
          ],
        });
      } else {

        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          playlists: [{ id: newPlaylistId, titre: playlistTitle }],
        });
      }

      console.log('Playlist created successfully:', playlistTitle);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };
  const rearrangeSongsInPlaylist = async (playlistId, newOrder) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {

        const rearrangedSongs = newOrder.map((songId) => {
          return userDocSnap.data().playlists
            .find((playlist) => playlist.id === playlistId)
            .songs.find((song) => song.id === songId);
        });

        await updateDoc(userDocRef, {
          playlists: userDocSnap.data().playlists.map((p) =>
            p.id === playlistId ? { ...p, songs: rearrangedSongs } : p
          ),
        });

        console.log('Songs rearranged successfully:', rearrangedSongs);
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error rearranging songs in the playlist:', error);
    }
  };
  const fetchPlaylistDetails = async (playlistId) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userPlaylists = userDocSnap.data().playlists;
        const selectedPlaylist = userPlaylists.find((playlist) => playlist.id === playlistId);

        if (selectedPlaylist) {
          return selectedPlaylist;
        } else {
          console.error('Playlist not found');
          return null;
        }
      } else {
        console.error('User not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching playlist details:', error);
      return null;
    }
  };
  const rearrangePlaylist = async (newOrder) => {
    try {
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {

        const rearrangedPlaylists = newOrder.map((playlistId) => {
          return userDocSnap.data().playlists.find((p) => p.id === playlistId);
        });


        await updateDoc(userDocRef, { playlists: rearrangedPlaylists });

        console.log('Playlists rearranged successfully:', rearrangedPlaylists);
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error rearranging playlists:', error);
    }
  };
  const deleteSongFromPlaylist = async (playlistId, songId) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const updatedSongs = userDocSnap.data().playlists
          .find((playlist) => playlist.id === playlistId)
          .songs.filter((song) => song.id !== songId);


        await updateDoc(userDocRef, {
          playlists: userDocSnap.data().playlists.map((p) =>
            p.id === playlistId ? { ...p, songs: updatedSongs } : p
          ),
        });
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const deleteSongFromPublicPlaylist = async (playlistId, songId) => {
    try {
      const publicPlaylistRef = doc(db, "publicPlaylists", playlistId);
      const publicPlaylistSnap = await getDoc(publicPlaylistRef);

      if (publicPlaylistSnap.exists()) {
        const updatedSongs = publicPlaylistSnap.data().songs.filter(
          (song) => song.id !== songId
        );

        await updateDoc(publicPlaylistRef, {
          songs: updatedSongs,
        });
      } else {
        console.error("Public playlist not found");
      }
    } catch (error) {
      console.error("Error deleting song from public playlist:", error);
    }
  };

  const deleteComment = async (playlistId, commentId) => {
    try {
      // Assuming you have a 'publicPlaylists' collection
      const playlistRef = doc(db, 'publicPlaylists', playlistId);

      // Get the playlist document
      const playlistDoc = await getDoc(playlistRef);

      if (playlistDoc.exists()) {
        // Remove the comment from the comments array
        const updatedComments = playlistDoc.data().comments.filter((comment) => comment.id !== commentId);

        // Update the playlist document with the modified comments array
        await updateDoc(playlistRef, { comments: updatedComments });

        console.log('Comment deleted successfully!');
      } else {
        console.error('Playlist not found');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const createPublicPlaylist = async (playlistTitle, selectedGenres) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User not logged in");
        return;
      }


      const playlistId = uuidv4();


      const newPlaylist = {
        creatorId: user.uid,
        id: playlistId,
        titre: playlistTitle,
        genres: selectedGenres,
        creator: user.displayName || user.email,
        evaluations: 0,
        comments: [],
        likes: [],
      };

      const publicPlaylistsRef = doc(db, 'publicPlaylists', playlistId);
      await setDoc(publicPlaylistsRef, newPlaylist);


      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {

        await updateDoc(userDocRef, {
          publicPlaylists: [
            ...(userDocSnap.data().publicPlaylists || []),
            { id: playlistId, titre: playlistTitle },
          ],
        });
      } else {

        await setDoc(userDocRef, {
          uid: user.uid,
          creatorId: user.uid,
          displayName: user.displayName,
          email: user.email,
          publicPlaylists: [{ id: playlistId, titre: playlistTitle }],
        });
      }
    } catch (error) {
      console.error('Error creating public playlist:', error);
    }
  };

  const fetchPublicPlaylistDetails = async (playlistId) => {
    try {
      const publicPlaylistsColRef = collection(db, 'publicPlaylists');
      const playlistDocRef = doc(publicPlaylistsColRef, playlistId);

      const playlistDocSnap = await getDoc(playlistDocRef);

      if (playlistDocSnap.exists()) {
        const publicPlaylistDetails = playlistDocSnap.data();
        return publicPlaylistDetails;
      } else {
        console.error('Public playlist not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching public playlist details:', error);
      return null;
    }
  };
  const likePublicPlaylist = async (playlistId) => {
    try {
      // Fetch the public playlist document
      const publicPlaylistsColRef = collection(db, 'publicPlaylists');
      const playlistDocRef = doc(publicPlaylistsColRef, playlistId);
      const playlistDocSnap = await getDoc(playlistDocRef);

      if (playlistDocSnap.exists()) {
        // Get the current likes and user information
        const currentLikes = playlistDocSnap.data().likes || [];
        const userId = user.uid;

        // Check if the user has already liked the playlist
        if (currentLikes.includes(userId)) {
          // User has already liked the playlist, so unlike it
          const updatedLikes = currentLikes.filter((id) => id !== userId);
          await updateDoc(playlistDocRef, { likes: updatedLikes });
          console.log('Playlist unliked successfully!');
        } else {
          // User has not liked the playlist, so like it
          const updatedLikes = [...currentLikes, userId];
          await updateDoc(playlistDocRef, { likes: updatedLikes });
          console.log('Playlist liked successfully!');
        }
      } else {
        console.error('Public playlist not found');
      }
    } catch (error) {
      console.error('Error liking/unliking public playlist:', error);
    }
  };

  const addToLikedSongs = async (songId, additionalInfo) => {
    try {
      console.log('songId', songId + " " + additionalInfo.title + " " + additionalInfo.artist + " " + additionalInfo.album);
      const userUid = user.uid;
      const userRef = doc(db, 'users', userUid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      userData.likedsongs = userData.likedsongs || [];
      const existingLikedSongIndex = userData.likedsongs.findIndex((song) => song.id === songId);

      if (existingLikedSongIndex !== -1) {
        userData.likedsongs.splice(existingLikedSongIndex, 1);

        addPublicLike(songId, additionalInfo, -1);
      } else {
        const newLikedSong = {
          id: songId,
          title: additionalInfo.title,
          artist: additionalInfo.artist,
          album: additionalInfo.album,
        };

        userData.likedsongs.push(newLikedSong);
        addPublicLike(songId, additionalInfo, 1);
      }

      await updateDoc(userRef, {
        likedsongs: userData.likedsongs,
      });

    } catch (error) {
      console.error('erreur', error);
    }
  };

  const addPublicLike = async (songId, songDetails, incrementValue) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("Aucun utilisateur connecté"); s
        return;
      }
      const songDocRef = doc(db, 'TousLesFavoris', '' + songId);
      await setDoc(songDocRef, {
        likeCount: increment(incrementValue),
        details: {
          id: songId,
          title: songDetails.title,
          artist: songDetails.artist,
          album: songDetails.album,
        },
      }, { merge: true });
    } catch (error) {
      console.log('Erreur', error);
    }
  };





  const addCommentToPlaylist = async (playlistId, commentContent) => {
    console.log('Adding comment:', commentContent)

    try {
      const publicPlaylistsColRef = collection(db, 'publicPlaylists');
      const playlistDocRef = doc(publicPlaylistsColRef, playlistId);
      console.log('playlistDocRef', playlistDocRef);


      const playlistDocSnap = await getDoc(playlistDocRef);
      const currentComments = playlistDocSnap.data().comments || [];


      const updatedComments = [...currentComments, { content: commentContent, user: user.uid, id: uuidv4(), username: user.displayName, userImg: user.photoURL }];


      await updateDoc(playlistDocRef, { comments: updatedComments });

      console.log('Comment added successfully:', commentContent);
    } catch (error) {
      console.error('Error adding comment:', error);
    }


  };

  const checkIfLiked = async (songId) => {
    try {
      const userUid = user.uid;
      const userRef = doc(db, 'users', userUid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const likedSongs = userData.likedsongs || [];
      const result = likedSongs.some((song) => song.id === songId);
      return result;
    } catch (error) {
      console.error('error', error);
    }
  };



  return (
    <userContext.Provider
      value={{
        v_: 1,
        createPlaylist,
        user,
        fetchPlaylistDetails,
        changePlaylistName,
        fetchPublicPlaylistDetails,
        deleteSongFromPlaylist,
        deletePlaylist,
        deleteComment,
        rearrangePlaylist,
        createPublicPlaylist,
        addCommentToPlaylist,
        rearrangeSongsInPlaylist,
        likePublicPlaylist,
        addToLikedSongs,
        deletePublicPlaylist,
        deleteSongFromPublicPlaylist,
        changePublicPlaylistName,
        checkIfLiked,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

const useInfos = () => {
  const context = useContext(userContext);
  if (context.v_ === 0) {
    console.error('Le contexte est consommé depuis l\'extérieur du provider');
  } else {
    // console.log('Le contexte fonctionne');
  }
  return context;
};

export { UserProvider, userContext, useInfos };
