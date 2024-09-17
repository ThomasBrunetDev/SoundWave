import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import SousMenu from "../SousMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import { IoPlay } from "react-icons/io5";
import { useInfos } from "../../context/userContext";

const ItemPopulaire = ({ favori, index, clicFn }) => {
  const [sousMenuVisible, setSousMenuVisible] = useState(false);
  const controls = useAnimation();
  const [animated, setAnimated] = useState(false);
  const [hover, setHover] = useState(false);
  const [largeurEcran, setLargeurEcran] = useState(window.innerWidth);

  const { addToLikedSongs } = useInfos();

  const handleScrollAnimation = async () => {
    const isInView = await controls.start({
      opacity: 1,
      translateY: 0,
      transition: { delay: index * 0.05 },
    });

    // Si l'élément est dans la vue, mettez à jour le state
    if (isInView) {
      setAnimated(true);
    }
  };

  useEffect(() => {
    if (!animated) {
      controls.start({ opacity: 0, translateY: 10 });
    }
  }, [animated, controls]);

  // Fonction pour mettre à jour la largeur de l'écran
  const majLargeurEcran = () => {
    setLargeurEcran(window.innerWidth);
  };

  // Ajouter un écouteur d'événements pour le changement de taille de l'écran lors du montage du composant
  useEffect(() => {
    window.addEventListener('resize', majLargeurEcran);

    // Nettoyer l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener('resize', majLargeurEcran);
    };
  }, []); // La dépendance vide signifie que cet effet s'exécute uniquement une fois après le montage initial

  const Like = (songId, favoris) => {
    const additionalInfo = {
      title: favoris.title,
      artist: favoris.artist,
      album: favoris.album,
    };
    addToLikedSongs(songId, additionalInfo);
  };
  return (
    <>
      <motion.li
        initial={{ opacity: 0, translateY: 10 }}
        animate={controls}
        className='flex items-center w-full h-[48px] cursor-default'
        key={favori.id}
        title={favori.details.title}
        onViewportEnter={handleScrollAnimation} // Cette partie dépend de votre bibliothèque d'intersection observer
        onHoverStart={largeurEcran > 1024 ? () => setHover(true) : null}
        onHoverEnd={largeurEcran > 1024 ? () => setHover(false) : null}
      >
        <div className='flex items-center justify-between w-full'>
          <div className="flex items-center gap-5 w-[70%]">
            <h1 className='font-tanker text-3xl text-[#2B2B2B]'>{index + 1}</h1>
            <div className='flex items-center gap-3 w-full'>
              <div className="w-14 h-12 rounded-lg flex items-center justify-center overflow-hidden">

                <AnimatePresence>
                  {hover && (

                    <motion.button onClick={clicFn} initial={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} exit={{ opacity: 0, translateY: 10 }} className="absolute text-2xl z-10 drop-shadow-md text-perso-orangePale">
                      <IoPlay />
                    </motion.button>

                  )}
                </AnimatePresence>

                {largeurEcran < 1024 && (
                  <motion.button initial={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} exit={{ opacity: 0, translateY: 10 }} className="absolute text-2xl z-10 drop-shadow-md text-perso-orangePale">
                    <IoPlay />
                  </motion.button>
                )}
                <img
                  className={`w-full h-full object-cover rounded-lg transition-all ${hover && largeurEcran > 1024 && "blur-[2px] "}`}
                  src={favori.details.album}
                  alt=''
                />

              </div>

              <div className='flex flex-col w-full overflow-hidden'>
                <p className="truncate">
                  {favori.details.title}
                </p>
                <p className='font-bold text-[#4B4B4B] text-sm truncate'>{favori.details.artist}</p>
              </div>
            </div>
          </div>
          <div className='relative flex'>
            <AnimatePresence>
              {sousMenuVisible && (
                <span className='absolute -top-32 -left-[16.5rem]'>
                  <SousMenu elements={[
                    {
                      nom: "Ajouter aux chansons aimées",
                      clicFn: () => {
                        Like(favori.id, favori.details);
                        setSousMenuVisible(false);
                      },
                    },
                    {
                      nom: "Ajouter à une liste de lecture",
                      clicFn: () => {
                        console.log("Ajouter à une liste de lecture");
                        setSousMenuVisible(false);
                      },
                    },
                  ]} />
                </span>
              )}
            </AnimatePresence>
            <button
              className='flex items-center justify-center'
              onClick={() => setSousMenuVisible(!sousMenuVisible)}
            >
              <BsThreeDotsVertical />
            </button>
          </div>
        </div>
      </motion.li>
    </>
  );
};

export default ItemPopulaire;
