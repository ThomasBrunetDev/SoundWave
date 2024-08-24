import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import FormatMinutesSecondes from "../FormatMinutesSecondes";
import LikeBtn from "../LikeBtn";
import SousMenu from "../SousMenu";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ItemMusiques = ({ resultat, setGetResultat,  index, click, like, addToPlaylist, addToPublicPlaylist, openPopUp }) => {
    const [showSousMenu, setShowSousMenu] = useState(false);
    
    return (
        <motion.div
            initial={{ opacity: 0, translateY: 10 }}
            animate={{
                opacity: 1,
                translateY: 1,
                transition: { delay: index * 0.03 },
            }}
            exit={{ opacity: 0, translateY: 10 }}
            className="flex flex-row h-24 items-center list-none lg:bg-perso-bleuPale rounded-lg px-2"
            key={index}>
            <div onClick={() => click(resultat)} key={index}>
                {resultat.album && resultat.album.cover && (
                    <img
                        className='h-[70%] w-[70%] rounded-lg cursor-pointer'
                        src={resultat.album.cover}
                        alt=''
                    />
                )}
            </div>

            <div className="flex flex-row w-full items-center justify-center text-sm md:text-base lg:text-lg">
                <div className="truncate w-1/3 ml-2">
                    {resultat.title.length > 30 ? (
                        <span className="text-ellipsis font-bold ">{`${resultat.title.substring(0, 30)}...`}</span>
                    ) : (
                        <span className="font-bold">{resultat.title}</span>
                    )}
                    <li className="">{resultat.artist.name}</li>
                </div>

                <div className="w-1/3 ml-2">
                    {resultat.album.title.length > 30 ? (
                        <span className="text-ellipsis font-bold">{`${resultat.album.title.substring(0, 30)}...`}</span>
                    ) : (
                        <span className="font-bold">{resultat.album.title}</span>
                    )}
                </div>

                <div className="font-bold w-1/6 text-center">
                    <FormatMinutesSecondes secondes={resultat.duration} />
                </div>

                <div className="flex items-center justify-end gap-6 mr-5 w-1/6">
                    <div className=" flex flex-row-reverse items-center justify-center text-center">
                        <button
                            className='bg-transparent w-7 h-7'
                            onClick={() =>
                                like(resultat.id, {
                                    title: resultat.title,
                                    artist: resultat.artist.name,
                                    album: resultat.album && resultat.album.cover,
                                })
                            }>
                            <LikeBtn id={resultat.id} />
                        </button>
                    </div>

                    <div className="relative text-center">
                        <AnimatePresence>
                            {showSousMenu && (
                                <div className='absolute -top-32 -left-[21.5rem]'>
                                    <SousMenu elements={[
                                        {
                                            nom: "Ajouter à une liste de lecture privée",
                                            clicFn: () => {
                                                setShowSousMenu(false)
                                                openPopUp("private")
                                                setGetResultat(resultat.id)
                                            }
                                        },
                                        {
                                            nom: "Ajouter à une liste de lecture publique",
                                            clicFn: () => {
                                                setShowSousMenu(false)
                                                openPopUp("public")
                                                setGetResultat(resultat.id)
                                            }
                                        },
                                    ]} />
                                </div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setShowSousMenu(!showSousMenu)}>
                            <BsThreeDotsVertical className='mt-2 text-xl' />
                            <div className="text-sm"></div>
                        </button>
                        {/* <button
                            onClick={() =>
                                isPublic
                                    ? addToPublicPlaylist(resultat.id)
                                    : addToPlaylist(resultat.id)
                            }>
                            <BsThreeDotsVertical className='mt-2 text-xl' />
                            <div className="text-sm"></div>
                        </button> */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ItemMusiques;
