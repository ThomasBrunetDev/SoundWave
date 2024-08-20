import { useInfos } from "../../context/authContext";
import { FcGoogle } from "react-icons/fc";
import "../rotationDisque.css";
import "../layoutAuth.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import ImgListe from '../../assets/img/svg/logo_complet.svg';

const Connexion = ({}) => {
  const { user, loginWithGoogle } = useInfos();
  return (
    <div className='app vagueLayoutAuth h-screen w-full bg-perso-grisFonce text-white text-center'>
      <Link className="absolute left-5 top-5 flex items-center gap-5 font-supremeMedium text-4xl" to={-1}>
        <IoMdArrowRoundBack />
        <span className="text-2xl">Retour</span>
      </Link>
      {/* <div className="wave"></div> */}
      <div className='app vague h-screen w-full bg-perso-grisFonce text-white text-center'>
        {/* <div className="wave"></div>
            <div className="wave wave2"></div> */}
        <header className='flex flex-col items-center justify-center'>
          <div className='relative flex flex-col items-center justify-center pt-12 lg:flex-row lg:pr-0 lg:pt-24'>
            <img
              src={ImgListe}
              alt=''
              className='rotationDisque mb-8 w-72 lg:w-60 lg:mr-4 lg:pb-0'
            />
            <h1 className='font-heavitas text-5xl lg:ml-4'>SoundWave</h1>
          </div>

          <nav className='mt-24 mb-12 rounded-3xl w-64 bg-perso-mauveFonce md:w-80 lg:w-96'>
            <ul className='text-2xl uppercase py-5 '>
              {!user && (
                <li className="flex flex-col gap-3 items-center">
                  <h1 className="font-tanker tracking-wide text-4xl">Connexion</h1>
                  <button
                    className='btn btn-primary bg-perso-mauvePale rounded-3xl w-[80%]'
                    onClick={loginWithGoogle}>
                    {/* Sign in with Google */}
                    <FcGoogle className='w-3/4 h-12 m-2 md:mx-auto lg:mx-auto' />
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </header>
      </div>
    </div>
  );
};
export default Connexion;
