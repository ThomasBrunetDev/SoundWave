import ListeImg from '../../../assets/img/svg/ListeLecture.svg';
import { IoAdd, IoPeopleSharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { motion } from 'framer-motion';

const ItemListe = ({ playlist, isPublic, index, clicFn }) => {
    return (
        <motion.li initial={{ translateX: -10, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }} transition={{ delay: 0.03 * index }} className={'flex w-[95%] items-center justify-between'} value={playlist.id}>
            <div className='flex items-center gap-3'>
                <div className='relative'>
                    {isPublic ? <IoPeopleSharp className='text-md absolute top-4 left-2.5 text-white' /> : <FaLock className='text-md absolute top-4 left-2.5 text-white' />}
                    <img src={ListeImg} className='w-9' alt='Liste de lecture' />
                </div>
                <h1>
                    {playlist.titre}
                </h1>
            </div>
            <button onClick={clicFn}>
                <IoAdd className='text-xl' />
            </button>
        </motion.li>

    );
}
export default ItemListe;