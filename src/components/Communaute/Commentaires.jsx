import { FaPaperPlane } from "react-icons/fa6";
import { motion } from "framer-motion";
import CommentairePublic from "./CommentairePublic";

const Commentaires = ({ playlist }) => {
  return (
    <motion.div
      initial={{ translateY: "100%" }}
      animate={{ translateY: 0, transition: { duration: 0.2, ease: "linear" } }}
      className='fixed bg-[#754ABA] w-full z-50 h-[95vh] bottom-0 justify-self-end rounded-t-2xl overflow-hidden'>
      <div className='bg-[#A065FF] relative flex flex-col items-center justify-center h-20 font-tanker text-3xl'>
        <span className='absolute top-2 rounded-full w-16 h-1 bg-[#4C3375]'></span>
        <h3 className='pt-2'>Commentaires</h3>
      </div>
      {/* {playlist.comments.length > 0 ? (
        <ul className='py-10 flex flex-col items-center pb-28 gap-4 w-full overflow-y-scroll h-[90%]'>
           {playlist.comments.map((comment, index) => (
            <CommentairePublic
              key={index}
              comment={comment}
              users={users}
            />
          ))}
        </ul>
      ) : (
        <p>Pas de commentaires pour cette playlist.</p>
      )} */}
      <ul className='py-10 flex flex-col items-center pb-28 gap-4 w-full overflow-y-scroll h-[90%]'>
        <motion.li
          initial={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 1, transition: { delay: 0.3 } }}
          className=' flex items-center justify-between w-11/12'>
          <img
            className='rounded-full self-start h-11'
            src={"https://api.deezer.com/album/6047452/image"}
            alt=''
          />
          <div className=' bg-[#4C3375] w-[87%] rounded-2xl p-3 flex flex-col gap-1'>
            <h2 className='font-bold opacity-75'>Mon nom</h2>
            <p className=' max-w-[100%] break-words'>
              Voici mon commentaire! C'est super ta playlist! comment tu as fait
              pour faire un si beau mix?
            </p>
          </div>
        </motion.li>
      </ul>

      <div className='fixed bottom-0 w-full flex items-center justify-center bg-[#A065FF]'>
        <form className='flex items-center justify-between gap-5 py-5 rounded-3xl w-10/12'>
          <input
            className='bg-[#4C3375] rounded-3xl w-10/12 p-3 pl-5 text-white'
            type='text'
            placeholder='Ecrivez un commentaire...'
          />
          <button className='bg-[#7047b1] shadow-sm rounded-full w-12 h-12 flex items-center justify-center'>
            <FaPaperPlane />
          </button>
        </form>
      </div>

      {/* {playlist.comments.length > 0 ? (
        <ul>
          {playlist.comments.map((comment, index) => (
            <CommentairePublic
              key={index}
              comment={comment}
              users={users}
            />
          ))}
        </ul>
      ) : (
        <p>Pas de commentaires pour cette playlist.</p>
      )} */}
    </motion.div>
  );
};
export default Commentaires;
