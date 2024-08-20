import { useEffect, useState } from "react";
import { collection, orderBy, limit, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import { IoPlay } from "react-icons/io5";
import { useMusic } from "../../context/musicContext";

import ItemPopulaire from "./ItemPopulaire";

const AccueilFavoris = () => {
  const [favoris, setFavoris] = useState([]);
  const { addMusicPlaying, playlistDetails } = useMusic();
  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const favorisColRef = collection(db, "TousLesFavoris");
        const favorisSnapshot = await getDocs(
          query(favorisColRef, orderBy("likeCount", "desc"), limit(12))
        );
        const favorisData = favorisSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavoris(favorisData);
      } catch (error) {
        console.error("erreur", error);
      }
    };

    fetchFavoris();
  }, []);

  const click = () => {
    if (favoris.length > 0) {
      const playlist = favoris.map((song) => song.id);
      addMusicPlaying(playlist[0]);
      playlistDetails({
        titre: "Populaire",
        songs: favoris,
      });
    }
  };


  return (
    <div className='bg-perso-mauvePale py-7 pb-10 w-full md:w-[90%] lg:h-[450px] px-10 flex flex-col items- justify-center gap-10 rounded-3xl'>
      <div className='flex justify-between items-center'>
        <h1 className='font-tanker text-4xl'>Populaire</h1>
        <button onClick={() => click()}><IoPlay /></button>
      </div>

      <ul className='lg:grid lg:grid-cols-3 lg:gap-y-7 lg:gap-x-12 flex flex-col gap-7 w-full '>
        {favoris.map(
          (favori, index) => (
            (
              <ItemPopulaire key={index} favori={favori} index={index} />
            )
          )
        )}
      </ul>
    </div>
  );
};

export default AccueilFavoris;
