import { motion } from 'framer-motion';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FaLock } from "react-icons/fa";
import ImgListe from '../../assets/img/svg/ListeLecture.svg';

const ListeLecutre = ({ index, playlist, handleDeletePlaylist }) => {
    return (
        <>
            <motion.li
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: .2, delay: index * 0.1 }}
                exit={{ opacity: 0, translateY: 10 }}
                className='flex flex-col gap-3 items-center w-24 text-white relative'
            >
                <Link className='relative' to={`/playlists/${playlist.id}`}>
                    <FaLock className='text-3xl absolute top-12 left-8 text-white' />
                    <img className='w-24' src={ImgListe} alt="" />
                </Link>
                <h1 className='font-supremeBold text-center text-md w-24'>
                    {playlist.titre.length > 10 ? `${playlist.titre.substring(0, 10)}...` : playlist.titre}
                    {/* {playlist.titre} */}
                </h1>
                <button className='text-3xl absolute top-0 -right-3' onClick={handleDeletePlaylist}>
                    <IoIosCloseCircleOutline />
                </button>
            </motion.li>
        </>
    );
}
export default ListeLecutre;