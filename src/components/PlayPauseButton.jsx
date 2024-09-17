import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
const PlayPauseButton = ({ isPaused, couleur, sizePlay, sizePause, clicFn }) => {

  const styleCouleur = {
    color: couleur,
  }


  return (
    <button onClick={clicFn} style={styleCouleur} className="flex items-center">
      {isPaused ? <FaPlay className={`text-${sizePlay}`} /> : <FaPause className={`text-${sizePause}`} />}
    </button>

  )
};

export default PlayPauseButton;
