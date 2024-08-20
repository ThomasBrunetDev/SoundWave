import { useState, useEffect } from "react";
import { useInfos } from '../../context/userContext';
import ItemPlaylistCommu from "./ItemPlaylistCommu";



const PlaylistsPublicCommu = ({ publicPlaylists  }) => {
    const { user, addCommentToPlaylist, likePublicPlaylist } = useInfos();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [commentairesVisible, setCommentairesVisible] = useState(false);

    

    const handleCommentSubmit = async (playlistId, commentContent) => {
        await addCommentToPlaylist(playlistId, commentContent);
    };

    console.log(publicPlaylists);

    return (
        <>
            {publicPlaylists.length > 0 ? (
                <ul className="w-full flex flex-col gap-10">
                    {publicPlaylists.map((playlist, index) => (
                        <ItemPlaylistCommu index={index} key={index} playlist={playlist} likePublicPlaylist={() => likePublicPlaylist(playlist.id)} user={user} />
                    ))}
                </ul>
            ) : (
                <div className='flex flex-col justify-center h-80 items-center w-full'>
                    <h1 className='font-supremeBold text-xl opacity-50 mb-4 text-center'>Aucune liste de lecture publique pour ce genre</h1>
                </div>
            )}
        </>
    );
}
export default PlaylistsPublicCommu;