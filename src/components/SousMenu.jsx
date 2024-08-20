import { motion } from "framer-motion";
import React from "react";

const SousMenu = ({ elements, closeFn }) => {
  return (
    <>
      <motion.ul
        className='flex flex-col gap-3 bg-perso-grisFonce p-3 rounded-2xl min-w-[270px] max-w-[350px]'
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, translateY: 10 }}>
        {elements.map((element, index) => (
          <li
            onBlur={closeFn}
            className='rounded-xl hover:bg-perso-mauvePale transition-all'
            key={index}>
            <button
              tabIndex={index + 1}
              className='p-3 text-start whitespace-nowrap w-full'
              onClick={element.clicFn}>
              {element.nom}
            </button>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default SousMenu;
