import React from 'react';
import { motion } from 'framer-motion';

const ItemTopMusique = ({ chanson, index, screenWidth }) => {
  return (
    <motion.li
      key={chanson.id}
      initial={{ opacity: 0, translateY: 10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      className='flex gap-4 items-center'
    >
      <div
        style={{ backgroundImage: `url(${chanson.cover})` }}
        className='w-32 h-32 lg:w-24 lg:h-24 lg:min-w-[6rem] min-w-[8rem] rounded-2xl flex justify-center items-center relative bg-cover bg-center overflow-hidden'
        key={chanson.id}
      >
        <div className='w-full h-full flex items-center justify-center backdrop-brightness-[0.6]'>
          <h1 className='font-supremeBold text-5xl'>
            {chanson.nbFoisEcoute}
            <span className='text-2xl'>x</span>
          </h1>
        </div>
      </div>
      <div>
        {screenWidth < 1024 ? (
          <h1 className='font-supremeBold text-xl'>
            {chanson.title.length > 35
              ? `${chanson.title.substring(0, 35)}...`
              : chanson.title}
          </h1>
        ) : (
          <h1 className='font-supremeBold text-xl'>
            {chanson.title.length > 40
              ? `${chanson.title.substring(0, 40)}...`
              : chanson.title}
          </h1>
        )}
        <h2 className='text-[#C2C2C2]'>{chanson.artist}</h2>
      </div>
    </motion.li>
  );
};

export default ItemTopMusique;
