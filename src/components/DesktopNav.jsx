import NavItem from "./Nav/NavItem";
import { LuLogOut } from "react-icons/lu";
import disque from "../assets/img/svg/logo_complet.svg";
import profilplaceholder from "../assets/img/profil-placeholder.jpg";
import { Link } from "react-router-dom";

const DesktopNav = ({ navLinks, user, handleLogout, pathname }) => {
  return (
    <>
      <header className='h-screen menu-desktop-gradient'>
        <nav className='flex p-6 flex-col text-white w-full h-full'>
          <ul className='flex flex-col h-full w-full justify-between'>
            <div className='flex flex-col gap-10'>
              <div className='flex items-center gap-3'>
                <img
                  className='w-16 h-16'
                  src={disque}
                  alt=''
                />
                <h1 className='text-2xl font-heavitas'>SoundWave</h1>
              </div>
              <nav className='flex flex-col '>
                {navLinks.map(({ url, nom, icon }) => (
                  <NavItem
                    key={url}
                    pathname={pathname}
                    url={url}
                    nom={nom}
                    icon={icon}
                  />
                ))}
              </nav>
            </div>
            {user !== null && (
              <Link
                className='flex flex-row justify-between rounded-xl p-4 w-full hover:bg-black hover:bg-opacity-25'
                to={navLinks[3].url}>
                <div className='flex items-center gap-3'>
                  {user.photoURL === null ? (
                    <img
                      src={profilplaceholder}
                      alt={user.displayName}
                      className='rounded-full h-10'
                    />
                  ) : (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className='rounded-full h-10'
                    />
                  )}
                  {user && (
                    <h1 className='font-tanker text-xl tracking-wide'>
                      {user.displayName}
                    </h1>
                  )}
                </div>
                {user && (
                  <button
                    className='text-xl rounded-lg p-2 hover:bg-perso-mauvePale '
                    onClick={handleLogout}>
                    <LuLogOut />
                  </button>
                )}
              </Link>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};
export default DesktopNav;
