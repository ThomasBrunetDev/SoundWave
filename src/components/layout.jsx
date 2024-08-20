import { Outlet, Link, useLocation, ScrollRestoration } from "react-router-dom";
import { useInfos } from "../context/authContext";
import { FaSearch } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { IoHome } from "react-icons/io5";

import DetailsMusicMobile from "./DetailMusicMobile/DetailsMusicMobile";
import NavItem from "./Nav/NavItem";
import DesktopNav from "./DesktopNav";
import "./layout.css";
import "./styleNavigation.css";
import DetailsMusicDesktop from "./DetailMusicDesktop/DetailsMusicDesktop";

const Layout = () => {
  const { logout, user } = useInfos();
  // console.log(user);
  const handleLogout = () => {
    logout();
  };

  const { pathname } = useLocation();
  const navLinks = [
    { url: "/accueil", nom: "Accueil", icon: <IoHome /> },
    { url: "/recherche", nom: "Recherche", icon: <FaSearch /> },
    { url: "/community", nom: "Communauté", icon: <IoPeopleSharp /> },
    {
      url: "/tableauDeBord" /*a changer dans les routes*/,
      nom: "Tableau de bord",
      icon: <MdLibraryMusic />,
    },
  ];
  return (
    <div className='app overflow-hidden lg:grid bg-perso-mauveFonce font-supremeRegular'>
      {/* Desktop */}
      <div className='desktop-nav hidden fixed w-[28vw] xl:w-[25vw] 2xl:w-[20vw] lg:block'>
        <DesktopNav
          navLinks={navLinks}
          user={user}
          handleLogout={handleLogout}
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
export default Layout;
