import NavItem from "..//Nav/NavItem";
import disque from "../../assets/img/svg/logo_complet.svg";


const DesktopNavAuth = ({ navLinks, pathname }) => {
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
          </ul>
        </nav>
      </header>
    </>
  );
};
export default DesktopNavAuth;
