import React from 'react';
import { motion } from 'framer-motion'; // Assurez-vous d'importer correctement cette bibliothèque
import { FaLock } from 'react-icons/fa';
import { IoPeopleSharp } from 'react-icons/io5';

function SwitchType({ isPublic, setIsPublic }) {
    return (

        <ul className='flex w-28 self-center justify-center items-center gap-9 py-3 bg-perso-mauvePale rounded-full text-lg relative'>
            <li className='flex z-10 justify-center items-center'>
                <motion.button
                    onClick={() => {
                        setIsPublic()
                    }}>
                    <FaLock />
                </motion.button>
            </li>
            <li className='text-xl z-10 flex justify-center items-center'>
                <motion.button
                    onClick={() => {
                        setIsPublic()
                    }}>
                    <IoPeopleSharp />
                </motion.button>
            </li>
            <motion.span
                initial={isPublic ? { translateX: 56 } : { translateX: 0 }}
                animate={isPublic ? { translateX: 56 } : { translateX: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='position absolute left-3 bg-perso-mauve w-8 h-8 rounded-full'
            />
        </ul>

    );
}

export default SwitchType;
