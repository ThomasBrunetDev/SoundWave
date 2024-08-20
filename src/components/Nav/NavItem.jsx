import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
const NavItem = ({ pathname, url, nom, icon }) => {
  const [hover, setHover] = useState(false);

  const controlsDesktop = useAnimation();

  const style = {
    backgroundColor: "#955EED",
  };

  useEffect(() => {
    if (hover) {
      controlsDesktop.start({ height: "1.5rem" });
    } else {
      controlsDesktop.start({ height: "1rem", opacity: .5 });
    }
    if (url == pathname) {
      controlsDesktop.start({ height: "1.75rem", opacity: 1 });
    }

  }, [controlsDesktop, hover, pathname, url]);

  return (
    <>
      {/* Desktop */}
      <Link
        to={url}
        className='rounded-xl hover:bg-black hover:bg-opacity-10 hidden lg:flex flex-row items-center'
        // style={url === pathname ? style : null}
        key={url}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <motion.span animate={controlsDesktop} className=" block bg-perso-mauvePale h-[1.75rem] w-2 rounded-r-md"></motion.span>
        <div
          className={`no-underline p-4 flex flex-row items-center gap-3`}>
          <i className='text-2xl'>{icon}</i>
          <h3 className='text-xl'>{nom}</h3>
        </div>
      </Link>

      {/* Mobile */}
      <Link
        to={url}
        className='lg:hidden text-white rounded-xl flex flex-col items-center justify-center'
      // style={url === pathname ? style : null}
      >
        <div
          className={`no-underline px-4 py-2 flex flex-row items-center gap-3 xl:hidden`}>
          <i className='text-2xl'>{icon}</i>
        </div>
        <motion.span animate={url == pathname ? { width: "90%" } : { width: "70%", opacity: .5 }} className="block bg-perso-mauvePale h-1.5 rounded-t-md"></motion.span>
      </Link>
    </>
  );
};

export default NavItem;
