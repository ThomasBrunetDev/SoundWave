import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAudio } from "../../lib/audiotim";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
const VolumeSlider = ({}) => {
  const { volume, changeVolume } = useAudio(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [lastNonZeroVolume, setLastNonZeroVolume] = useState(false);

  const recordLastVolume = (newVolume) => {
    if (newVolume !== 0) {
      setLastNonZeroVolume(volume);
    }
    changeVolume(newVolume);
  };

  return (
    <div
      onMouseEnter={() => setVolumeVisible(true)}
      onMouseLeave={() => setVolumeVisible(false)}
      className='flex justify-end w-32 gap-5'>
      <AnimatePresence>
        {volumeVisible && (
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0, transition: { delay: 1 } }}
            className='w-20 slider-son'
            type='range'
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            min={0}
            max={1}
            step={0.01}
          />
        )}
      </AnimatePresence>
      <button
        onClick={() =>
          recordLastVolume(
            volume !== 0 ? changeVolume(0) : changeVolume(lastNonZeroVolume)
          )
        }>
        {volume > 0 ? (
          <HiOutlineSpeakerWave className='text-2xl text-perso-mauve stroke-[2]' />
        ) : (
          <HiOutlineSpeakerXMark className='text-2xl text-perso-mauve stroke-[2]' />
        )}
      </button>
    </div>
  );
};
export default VolumeSlider;
