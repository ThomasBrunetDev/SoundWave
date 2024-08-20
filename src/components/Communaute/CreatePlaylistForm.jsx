import { useState } from "react";
import { useInfos } from "../../context/userContext";
import { motion, AnimatePresence } from "framer-motion";
import Checkbox from "./Checkbox";
import "./checkbox.css";
const CreatePlaylistForm = ({ open, setOpen }) => {
  const { createPublicPlaylist } = useInfos();
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const musicGenres = [
    "Jazz",
    "Rock",
    "Pop",
    "Classical",
    "Hip Hop",
    "Country",
    "Electronic",
  ];

  const handleGenreChange = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const handleCreatePlaylist = () => {
    if (playlistTitle.trim() === "") {
      createPublicPlaylist("Liste publique", selectedGenres);
    } else {
      createPublicPlaylist(playlistTitle, selectedGenres);
    }
    setPlaylistTitle("");
    setSelectedGenres([]);
    setOpen();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed left-0 top-0 w-screen h-screen flex backdrop-blur-md backdrop-brightness-50 z-30 items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            initial={{ translateY: -10, opacity: 0 }}	
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -10, opacity: 0 }}
            className='flex flex-col gap-5 items-center justify-center'>
            <h1 className='font-supremeBold text-xl'>
              Créer ma liste publique
            </h1>
            <input
              className='bg-transparent text-center border-b text-xl font-supremeBold border-white w-80 pb-4 h-10 p-2 text-white '
              type='text'
              autoFocus
              placeholder='Nommez votre liste'
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
            />

            <div className='flex items-center justify-center gap-3 w-[80%] flex-wrap'>
              {musicGenres.map((genre) => (
                <label
                  className='flex gap-2 bg-perso-mauve pr-5 py-1 rounded-full text-white'
                  key={genre}>
                  <span className='w-6 h-6 flex items-center justify-center'>
                    <Checkbox
                      change={() => handleGenreChange(genre)}
                      check={selectedGenres.includes(genre)}
                    />
                  </span>
                  {genre}
                </label>
              ))}
            </div>
            <div className='flex gap-7 text-lg'>
              <button
                onClick={setOpen}
                className='text-gray-400'>
                Fermer
              </button>
              <button onClick={handleCreatePlaylist}>Créer</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlaylistForm;
