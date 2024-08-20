import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
const PlayPauseButton = ({ isPaused, couleur, sizePlay, sizePause }) => {

  const styleCouleur = {
    color: couleur,
  }


  return (
    <div style={styleCouleur} className="flex items-center">
      {isPaused ? <FaPlay className={`text-${sizePlay}`} /> : <FaPause className={`text-${sizePause}`} />}
    </div>

  )
};

export default PlayPauseButton;
