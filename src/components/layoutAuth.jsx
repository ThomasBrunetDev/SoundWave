import { Outlet, Link, useLocation, ScrollRestoration } from "react-router-dom";
import { useInfos } from "../context/authContext";

import { IoPeopleSharp } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import "./rotationDisque.css";
import "./layoutAuth.css";
import DetailsMusicMobile from "./DetailMusicMobile/DetailsMusicMobile";
import NavItem from "./Nav/NavItem";
import DesktopNavAuth from "./Auth/DesktopNavAuth";
import DetailsMusicDesktop from "./DetailMusicDesktop/DetailsMusicDesktop";
import { LuLogIn } from "react-icons/lu";

const LayoutAuth = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { url: "/accueil", nom: "Accueil", icon: <IoHome /> },
    { url: "/community", nom: "Communauté", icon: <IoPeopleSharp /> },
    { url: "/connexion", nom: "Connexion", icon: <LuLogIn /> },
  ];
  return (
    <div className='app overflow-hidden lg:grid bg-perso-mauveFonce font-supremeRegular'>
      {/* Desktop */}
      <div className='desktop-nav hidden fixed w-[28vw] xl:w-[25vw] 2xl:w-[20vw] lg:block'>
        <DesktopNavAuth
          navLinks={navLinks}
          pathname={pathname}
        />
      </div>
      {/* Desktop */}

      {/* Mobile */}
      <div className='lg:hidden fixed bottom-0 w-full flex flex-col items-center z-50'>
        <DetailsMusicMobile />
        <nav className='w-full menu-gradient h-24'>
          <ul className='p-2 flex h-full items-end justify-around'>
            {navLinks.map(({ url, nom, icon }) => (
              <NavItem
                key={url}
                pathname={pathname}
                url={url}
                nom={nom}
                icon={icon}
              />
            ))}
          </ul>
        </nav>
      </div>
      <main className='main w-full  text-white flex flex-col items-center'>
        <Outlet />
        <ScrollRestoration />
        <span className='hidden lg:block'>
          <DetailsMusicDesktop />
        </span>
      </main>
    </div>
  );
};
export default LayoutAuth;
