import { motion } from "framer-motion";

const CommentairePublic = ({ users, comment, index }) => {
  return (
    <>
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
      {/* <motion.li
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 1, transition: { delay: index * 0.3 } }}
        className='flex items-center justify-between w-11/12'>
        <img
          className='rounded-full self-start h-11'
          src={"https://api.deezer.com/album/6047452/image"}
          alt=''
        />
        <div className=' bg-[#4C3375] w-[87%] rounded-2xl p-3 flex flex-col gap-1'>
          <h2 className='font-bold opacity-75'>
            {users.find((u) => u.id === comment.user)?.displayName ||
              "User Mystère?"}
          </h2>
          <p className=' max-w-[100%] break-words'>{comment.content}</p>
        </div>
      </motion.li> */}
    </>
  );
};
export default CommentairePublic;
