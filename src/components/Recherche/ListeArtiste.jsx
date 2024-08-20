import {useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ClipLoader from "react-spinners/ClipLoader";
import DetailsArtiste from "./DetailsArtiste";
import "./listeArtiste.css";


const ListeArtiste = ({recherche}) => {

const [showSkeleton, setShowSkeleton] = useState(false);
const [afficherDetailsArtiste, setAfficherDetailsArtiste] = useState(false);
const clicDetailsArtiste = () => {
    setAfficherDetailsArtiste(true);
}; 
const [loading, setLoading] = useState(false);
const [idClic, setIdClic] = useState('');

const artisteClic = (artisteChoisi) => {
  console.log('Element cliqué:',artisteChoisi);
};

console.log(recherche[0]);

return (
  <div>     
      {/* {!afficherDetailsArtiste ? ( */}
      <div className='flex flex-row flex-wrap w-full mt-12 lg:pb-0 lg:text-white'>      
      {recherche.map((resultat, index) => (
        <div
          className='flex flex-col w-1/2 items-center justify-center list-none rounded-lg overflow-hidden mb-6 transition sm:w-1/3 xl:w-1/4'
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
            <div className="p">{afficherDetailsArtiste && <DetailsArtiste recherche={recherche} />}</div>
            {/* <button
            className="cursor-pointer"
            onClick={clicDetailsArtiste}
            key={index}
            > */}
            <li className='m-2 font-tanker ' key={index}>
             
              <Link to={"/test"} > 
              {resultat.artist && resultat.artist.picture && (
                <img
                className='h-36 w-36 rounded-lg transition-transform transform hover:scale-110 box'
                src={resultat.artist.picture}
                alt=''
                  />            
              )}
              </Link>
            </li>

            {/* </button> */}
    
            <div className="flex flex-row pt-2 h-24 justify-center text-center text-sm md:text-base lg:text-lg">
              <div className="truncate whitespace-normal text-base">
                {resultat.artist.name > 30 ? (
                  <span className="text-ellipsis font-bold mx-4">{`${resultat.artist.name .substring(0, 30)}...`}</span>
                  ) : (
                  <span className="font-bold mx-4">{resultat.artist.name }</span>
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
    {/* ) : null} */}
    
  </div>
);
}
export default ListeArtiste;

