import { useEffect, useState } from "react";
import fetchJsonp from "fetch-jsonp";

import ItemAlbum from "./ItemAlbum";

const AlbumRandom = () => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchRandomAlbums = async () => {
            try {
                const response = await fetchJsonp(
                    'https://api.deezer.com/chart/0/albums?limit=100&output=jsonp' // Augmentez la limite pour avoir plus d'options
                );
                const data = await response.json();

                // Choisissez 8 albums uniques de manière aléatoire
                const uniqueAlbums = chooseRandomUniqueAlbums(data.data, 18);

                setAlbums(uniqueAlbums);
            } catch (error) {
                console.error('Erreur lors de la récupération des albums', error);
            }
        };

        fetchRandomAlbums();
    }, []);

    // Fonction pour choisir un éléments uniques au hasard depuis un tableau
    const chooseRandomUniqueAlbums = (array, count) => {
        const shuffledArray = array.sort(() => Math.random() - 0.5);
        return shuffledArray.slice(0, count);
    };

    return (
        <div className="lg:w-[90%] lg:px-0 md:w-[90%] w-full flex flex-col gap-9">
            <h1 className="font-tanker text-4xl ml-5">Albums tendances</h1>
            <div className="w-full overflow-x-scroll overflow-y-hidden h-[530px]">
                <div className="flex flex-col gap-10">
                    <ul className="flex gap-28 px-5">
                        {albums.slice(0, Math.ceil(albums.length / 2)).map(album => (
                            <ItemAlbum key={album.id} album={album} />
                        ))}
                    </ul>
                    <ul className="flex gap-28 px-5">
                        {albums.slice(Math.ceil(albums.length / 2)).map(album => (
                            <ItemAlbum key={album.id} album={album} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default AlbumRandom;
