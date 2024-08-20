import { IoIosArrowDown } from "react-icons/io";

import PlayPauseButton from "../PlayPauseButton";
import { MdSkipNext } from "react-icons/md";
import { HiSpeakerWave } from "react-icons/hi2";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DetailMusicFullSkeleton = ({ closeFn }) => {
  return (
    <div className='w-full h-full gap-12 flex flex-col items-center relative justify-center'>
      <button
        className='top-4 absolute right-7 text-[#493074] '
        onClick={closeFn}>
        <IoIosArrowDown className='text-4xl' />
      </button>
        <Skeleton circle={true} height={"15rem"} width={"15rem"} />

      <div className='w-full flex flex-col gap-5 z-50 items-center '>
        <div className='text-white overflow-hidden flex flex-col w-[70%]'>
          <Skeleton width={"70%"} height={"1.2rem"} />
          <Skeleton width={"50%"} height={".7rem"} />
        </div>
        <div className='text-white overflow-hidden flex flex-col w-[70%]'>
            <Skeleton width={"100%"} height={".5rem"} />
          {/* <div className='bg-[#493074] w-[70%] rounded-full  h-1.5 cursor-pointer'></div> */}
          <div className='w-[98%] flex justify-between'>
            <span className='w-7'>0:00</span>
            <span className='w-7'>0:00</span>
          </div>
        </div>
        <div className='text-[#493074] flex items-center justify-between w-[40%] text-[2.5rem]'>
          <button>
            <MdSkipNext className='rotate-180' />
          </button>
          <button>
            <PlayPauseButton
              isPaused={true}
              couleur={"#493074"}
              sizePause={"4xl"}
              sizePlay={"3xl"}
            />
          </button>
          <button>
            <MdSkipNext />
          </button>
        </div>
        <div className='flex gap-5 mt-3 w-[70%] text-[#493074] text-2xl items-center justify-center'>
          <HiSpeakerWave className='text-xl' />
          <div className='bg-[#493074] w-full  rounded-full  h-1.5 cursor-pointer'></div>
          <HiSpeakerWave />
        </div>
      </div>
    </div>
  );
};
export default DetailMusicFullSkeleton;
