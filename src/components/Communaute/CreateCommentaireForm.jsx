import React, { useState } from "react";
import { useInfos } from "../../context/userContext";
import { FaPaperPlane } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
const CreateCommentaireForm = ({
  playlistId,
  onCommentSubmit,
  open,
  setOpen,
}) => {
  const [commentContent, setCommentContent] = useState("");
  const { user } = useInfos();

  const handleCommentSubmit = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
  
    if (commentContent.trim() === "") {
      console.error("Comment content cannot be empty");
      return;
    }
  
    console.log("Submitting comment:", commentContent);
  
    onCommentSubmit(playlistId, commentContent);
    setOpen();
    setCommentContent("");
  };
  

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed left-0 top-0 lg:bottom-0 lg:top-auto lg:left-auto lg:h-auto lg:w-[72vw] xl:w-[75vw] 2xl:w-[80vw] w-full h-screen flex backdrop-blur-md
          backdrop-brightness-50 z-30 items-center justify-center'>
          <div className='flex items-center justify-between gap-5 py-5 rounded-3xl w-10/12'>
            <button
              onClick={setOpen}
              className='lg:static absolute top-2 left-2 text-3xl'>
              <IoClose />
            </button>
            <textarea
              autoFocus
              className='bg-[#4C3375] rounded-3xl max-h-24 w-10/12 p-3 pl-5 text-white resize-none'
              type='text'
              placeholder='Ecrivez un commentaire...'
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className='bg-[#7047b1] shadow-sm rounded-full w-12 h-12 flex items-center justify-center'>
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    // <div>
    //   <textarea
    //   className='text-black'
    //     rows="4"
    //     cols="50"
    //     placeholder="Ajouter un commentaire"
    //     value={commentContent}
    //     onChange={(e) => setCommentContent(e.target.value)}
    //   ></textarea>
    //   <button onClick={handleCommentSubmit}>Envoyer Commentaire</button>
    // </div>
  );
};

export default CreateCommentaireForm;
