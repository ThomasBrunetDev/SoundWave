import { FaHashtag } from "react-icons/fa";
import { motion } from "framer-motion";

const PopUpGenre = ({ genres }) => {
  return (
    <motion.div
      initial={{ translateY: -10, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: -10, opacity: 0 }}
      className='absolute top-32 z-20 bg-perso-mauve xl:w-[30%] lg:w-[50%] w-[70%] p-10 rounded-2xl flex flex-col items-center justify-center gap-2'>
      <div className='rounded-full p-3 absolute -top-9 bg-perso-mauvePale'>
        <FaHashtag className='text-4xl text-white' />
      </div>
      <ul className='flex flex-col self-start gap-4'>
        {genres.map((genre, index) => (
          <motion.li
            initial={{ translateX: -10, opacity: 0 }}
            animate={{
              translateX: 0,
              opacity: 1,
              transition: { delay: index * 0.05 },
            }}
            className='flex gap-2 items-center text-xl'
            key={index}>
            <FaHashtag />
            {genre}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
export default PopUpGenre;
