import {useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ClipLoader from "react-spinners/ClipLoader";
import DetailsAlbum from "./DetailsAlbum";

const ListeAlbum = ({recherche}) => {

const [showSkeleton, setShowSkeleton] = useState(false);
const [afficherDetailsAlbum, setAfficherDetailsAlbum] = useState(false);
const clicDetailsAlbum = () => {
    setAfficherDetailsAlbum(true);
}; 
const [loading, setLoading] = useState(false);
const [idClic, setIdClic] = useState('');
const idImageClic = (id) => {
  setIdClic(id);
};

return (
  <div>  
      <div className='flex flex-row flex-wrap w-full mt-12 text-white lg:pb-0'>      
      {recherche.map((resultat, index) => (
        <div
          className='flex flex-col w-1/2 items-center justify-center list-none rounded-lg overflow-hidden mb-6 transition sm:w-1/3 xl:w-1/4 '
        >
          {showSkeleton ? (
            <span
              className='h-full w-full'
              style={{ verticalAlign: "top", lineHeight: "0" }}>
              <Skeleton
              width={"100%"}
              height={"100%"}
              style={{ display: "block" }}
              />
            </span>
            ) : (
            <>
            {afficherDetailsAlbum && <DetailsAlbum recherche={recherche} />}
           
            <li className='m-2 font-tanker' key={index}>
            
              <Link to={"/testAlbum"} > 
              {resultat.album && resultat.album.cover && (
                <img
                className='h-36 w-36 rounded-lg hover:scale-110 box'
                src={resultat.album.cover}
                alt=''
                  />            
                )}
                </Link>
              </li>
           
    
            <div className="flex flex-row pt-2 h-24 justify-center text-center text-sm md:text-base lg:text-lg">
              <div className="truncate whitespace-normal">
                {resultat.album.title > 30 ? (
                  <span className="text-ellipsis font-bold mx-4">{`${resultat.album.title .substring(0, 30)}...`}</span>
                  ) : (
                  <span className="font-bold mx-4">{resultat.album.title }</span>
                )}
              </div>
            </div>
             </>
          )}
        </div>
      ))}
    
      {loading && (
        <div className='text-white text-center mt-4'>
          <ClipLoader
          color={"#ffffff"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
          />
        </div>
      )}
    </div>
    
  </div>
);
}
export default ListeAlbum;