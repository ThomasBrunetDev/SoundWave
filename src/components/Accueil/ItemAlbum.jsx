import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import disqueSVG from '../../assets/img/svg/disqueSVG.svg';
import { IoPlay } from "react-icons/io5";


const generateRandomRotation = () => {
    return Math.floor(Math.random() * (100 - 50 + 1)) + 50;
};

const ItemAlbum = ({ album }) => {
    const [hover, setHover] = useState(false);
    const [largeurEcran, setLargeurEcran] = useState(window.innerWidth);
    const randomRotation = generateRandomRotation();

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


    return (
        <motion.li initial={{ translateX: -10, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }} exit={{ translateX: -10, opacity: 0 }} className='w-[160px] flex flex-col items-center gap-3' key={album.id}>
            <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='flex items-center relative'>
                <span className='w-32 object-cover h-44 rounded-2xl z-10 overflow-hidden'>

                    <AnimatePresence>
                        {hover && largeurEcran > 1024 && (
                            <motion.i initial={{ translateY: 5, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} exit={{ translateY: 5, opacity: 0 }} className='absolute bottom-2 right-2 z-10 pl-0.5 text-perso-mauvePale text-[20px] backdrop-blur-md font-supremeBold border-perso-mauvePale border-2 flex items-center justify-center w-8 h-8 rounded-full'>
                                <IoPlay />
                            </motion.i>

                        )}
                    </AnimatePresence>
                    {largeurEcran < 1024 && (

                        <motion.i initial={{ translateY: 10, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} exit={{ translateY: 10, opacity: 0 }} className='absolute bottom-16 right-[2.7rem] z-10 pl-0.5 text-perso-mauvePale text-2xl backdrop-blur-md font-supremeBold border-perso-mauvePale border-[3px] flex items-center justify-center w-12 h-12 rounded-full'>
                            <IoPlay />
                        </motion.i>
                    )}

                    <img className={`w-32 h-44 scale-110 object-cover transition-all ease-in duration-150 ${hover && "lg:scale-105 lg:blur-[2px] lg:brightness-50"}`} src={album.cover_medium} alt={album.title} />
                </span>
                <motion.img animate={hover && largeurEcran > 1024 ? { translateX: 25, rotate: randomRotation, transition: { duration: 0.2 } } : { translateX: 0, rotate: 0, transition: { duration: 0.2 } }} className='absolute left-10  w-32' src={disqueSVG} alt="disqueSVG" />
            </div>
            <h2 className='font-supremeMedium'>
                {/* {album.title} */}
                {album.title.length > 20 ? `${album.title.substring(0, 20)}...` : album.title}
            </h2>
        </motion.li>
    );
};

export default ItemAlbum;
