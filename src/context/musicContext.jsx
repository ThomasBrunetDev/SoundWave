import React, { useEffect, useState } from "react";
import fetchjsonp from "fetch-jsonp";

const musicContext = React.createContext({
    addMusicPlaying: async (musiqueId) => { },
    selectedMusicObj: null,
    playlistDetails: async (playlistRecu) => { },
    playlistMusic: null,
    v_: 0,
});
// `https://api.example.com/track/${musiqueId}`
const MusicProvider = ({ children }) => {
    const [selectedMusicObj, setSelectedMusic] = useState(null);
    const [playlistMusic, setPlaylistMusic] = useState(null);
    const addMusicPlaying = async (musiqueId) => {
        try {
            const fetchData = await fetchjsonp(`https://api.deezer.com/track/${musiqueId}&output=jsonp`);
            const json = await fetchData.json();
            setSelectedMusic(json);
        } catch (error) {
            console.error(error);
        }
    };
    const playlistDetails = async (playlistRecu) => {
        setPlaylistMusic(playlistRecu);
      };
    return (
        <musicContext.Provider value={{ v_: 1, addMusicPlaying, selectedMusicObj, playlistDetails, playlistMusic }}>
            {children}
        </musicContext.Provider>
    );
};
const useMusic = () => {
    const context = React.useContext(musicContext);
    if (context.v_ === undefined) {
        throw new Error("Le contexte est consommé depuis l'extérieur du provider");
    }
    else {
        // console.log("Le contexte fonctionne");
    }
    return context;
};

export { MusicProvider, musicContext, useMusic };