import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import ItemArtisteListe from './ItemArtisteListe';
const ListeArtiste = ({ chansonsEcoute, screenWidth }) => {
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);

  const artistStats = chansonsEcoute.reduce((accumulator, chanson) => {
    const { artist, nbFoisEcoute, title, cover } = chanson;

    accumulator[artist] = accumulator[artist] || {
      totalNbFoisEcoute: 0,
      songs: [],
      artistImg: chanson.artistImg,
    };

    accumulator[artist].totalNbFoisEcoute += nbFoisEcoute;
    accumulator[artist].songs.push({ title, nbFoisEcoute, cover });

    return accumulator;
  }, {});

  const topArtists = Object.entries(artistStats)
    .sort(([ , aStats], [ , bStats]) => bStats.totalNbFoisEcoute - aStats.totalNbFoisEcoute)
    .slice(0, 3);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentArtistIndex((prevIndex) => (prevIndex + 1) % topArtists.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [topArtists]);

  const currentArtist = topArtists[currentArtistIndex];

  return (
    <ul className='w-full relative h-96  overflow-hidden rounded-xl'>
      <AnimatePresence initial={false}>
        {currentArtist && (
          <motion.div
            className='w-full h-full absolute top-0 left-0'
            key={currentArtist[0]}
            initial={{ opacity: 0, translateY: 5 }}
            animate={{ opacity: 1, translateY: 0, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 1 } }}>
            <ItemArtisteListe
              artist={currentArtist[0]}
              stats={currentArtist[1]}
              screenWidth={screenWidth}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ul>
  );
};

export default ListeArtiste;

