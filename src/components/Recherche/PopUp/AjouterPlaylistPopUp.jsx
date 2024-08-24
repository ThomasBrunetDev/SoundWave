import { motion, AnimatePresence, useAnimation } from "framer-motion";
import SwitchType from "./SwitchType";
import ItemListe from "./ItemListe";
import React from "react";


const AjouterPlaylistPopUp = ({ selectPlaylist, resultat, open, setOpen, playlists, publicPlaylists, isPublic, setIsPublic, selectedPlaylist }) => {


    return (
        <AnimatePresence>
            {open && (

                <motion.div
                    className='fixed left-0 top-0 w-screen h-screen flex flex-col backdrop-blur-md backdrop-brightness-50 z-30 items-center justify-center text-white'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <motion.div
                        initial={{ translateY: -10, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ translateY: -10, opacity: 0 }}
                        className='flex flex-col gap-5 items-start justify-center bg-gray-600 p-6 max-w-[500px] w-[90%] rounded-2xl'>

                        <h1 className='font-supremeBold text-xl'>
                            Ajouter à une liste de lecture
                        </h1>
                        <SwitchType isPublic={isPublic} setIsPublic={setIsPublic} />
                        {/* <ul className='flex w-28 self-center justify-center items-center gap-9 py-3 bg-perso-mauvePale rounded-full text-lg relative'>
                            <li className='flex z-10 justify-center items-center'>
                                <motion.button
                                    onClick={() => {
                                        setIsPublic()
                                    }}>
                                    <FaLock />
                                </motion.button>
                            </li>
                            <li className='text-xl z-10 flex justify-center items-center'>
                                <motion.button
                                    onClick={() => {
                                        setIsPublic()
                                    }}>
                                    <IoPeopleSharp />
                                </motion.button>
                            </li>
                            <motion.span
                                initial={isPublic ? { translateX: 56 } : { translateX: 0 }}
                                animate={isPublic ? { translateX: 56 } : { translateX: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className='position absolute left-3 bg-perso-mauve w-8 h-8 rounded-full'
                            />
                        </ul> */}
                        <ul className="flex flex-col gap-3 min-h-[400px] max-h-[400px] overflow-y-auto w-full ">
                            {isPublic
                                ? publicPlaylists.map((playlist, index) => (
                                    <React.Fragment key={playlist.id}>
                                        <ItemListe clicFn={() => selectPlaylist(playlist.id, resultat)} index={index} playlist={playlist} isPublic={isPublic} />
                                        {index !== publicPlaylists.length - 1 && <hr className="w-[95%] opacity-10" />} {/* Ajoute une ligne si ce n'est pas le dernier élément */}
                                    </React.Fragment>
                                ))
                                : playlists.map((playlist, index) => (
                                    <React.Fragment key={playlist.id}>
                                        <ItemListe clicFn={() => selectPlaylist(playlist.id, resultat)} index={index} playlist={playlist} isPublic={isPublic} />
                                        {index !== playlists.length - 1 && <hr className="w-[95%] opacity-10" />} {/* Ajoute une ligne si ce n'est pas le dernier élément */}
                                    </React.Fragment>
                                ))}
                        </ul>

                        <div className='flex gap-7 text-lg'>
                            <button
                                onClick={setOpen}
                                className='text-gray-400'>
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
export default AjouterPlaylistPopUp;