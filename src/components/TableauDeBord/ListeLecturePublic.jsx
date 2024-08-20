import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoPeopleSharp, IoCloseCircleOutline } from 'react-icons/io5';
import ImgListe from '../../assets/img/svg/ListeLecture.svg';

const ListeLecturePublic = ({ publicPlaylist, index, handleDeletePublicPlaylist }) => {
  return (
    <motion.li
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      exit={{ opacity: 0, translateY: 10 }}
      key={publicPlaylist.id}
      className='flex flex-col gap-3 items-center w-24 text-white relative'
    >
      <Link className='relative' to={`/playlists/public/${publicPlaylist.id}`}>
        <IoPeopleSharp className='text-4xl absolute top-12 left-7 text-white' />
        <img className='w-24' src={ImgListe} alt='' />
      </Link>
      <h1 className='font-supremeBold text-center text-md w-24'>
        {publicPlaylist.titre.length > 10
          ? `${publicPlaylist.titre.substring(0, 10)}...`
          : publicPlaylist.titre}
      </h1>
      <button
        className='text-3xl absolute top-0 -right-3'
        onClick={() => handleDeletePublicPlaylist(publicPlaylist.id)}
      >
        <IoCloseCircleOutline />
      </button>
    </motion.li>
  );
};

export default ListeLecturePublic;
