import { Link } from "react-router-dom";
import { FaPlay, FaComments } from "react-icons/fa6";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { useEffect, useState } from "react";
import Commentaires from "./Commentaires";
import { motion } from "framer-motion";

const ItemPlaylistCommu = ({ playlist, likePublicPlaylist, user, index }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [commentairesVisible, setCommentairesVisible] = useState(false);

  const style = {
    backgroundImage:
      playlist.songs && playlist.songs.length > 0
        ? `url(${playlist.songs[playlist.songs.length - 1].album})`
        : "none",
    backgroundColor: "#76AACE",
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
    <motion.li
      initial={{ translateY: -10, opacity: 0 }}
      animate={{
        translateY: 0,
        opacity: 1,
        transition: { delay: index * 0.05 },
      }}
      style={style}
      className='relative flex items-center bg-no-repeat bg-cover bg-center w-full h-[115px] overflow-hidden rounded-lg'>
      <div
        className=' my-10 w-full h-full backdrop-blur-[2px] backdrop-brightness-[0.60] flex items-center justify-between px-5 gap-10 '
        key={playlist.id}>
        {console.log(playlist)}
        <div className='flex gap-5 items-center'>
          <button className='bg-perso-mauveFonce h-12 w-12 flex items-center justify-center rounded-full text-xl'>
            <FaPlay />
          </button>
          <Link
            to={`/playlists/public/${playlist.id}`}
            className='flex flex-col justify-start items-start gap-0'>
            <h1 className='font-supremeMedium text-xl text-ellipsis'>
              {screenWidth < 1024 && playlist.titre.length > 20
                ? `${playlist.titre.substring(0, 20)}...`
                : playlist.titre}
            </h1>
            {/* <Link className="font-supremeMedium text-xl truncate" to={`/playlists/public/${playlist.id}`}>{playlist.titre}</Link> */}
            <p className='text-[#C2C2C2]'>{playlist.creator}</p>
          </Link>
        </div>
        {user && (
          <button
            onClick={likePublicPlaylist}
            className='flex items-center text-xl font-supremeBold justify-center gap-2 w-[5%]'>
            <i className='text-3xl mb-1'>
              {playlist.likes && playlist.likes.includes(user.uid) ? (
                <BiSolidLike />
              ) : (
                <BiLike />
              )}
            </i>
            <h3>{playlist.likes ? playlist.likes.length : 0}</h3>
          </button>
        )}

        {commentairesVisible && <Commentaires playlist={playlist} />}

        {/* Formulaire de commentaire */}
        {/* <CreateCommentaireForm playlistId={playlist.id} onCommentSubmit={handleCommentSubmit} /> */}
      </div>
    </motion.li>
  );
};
export default ItemPlaylistCommu;
