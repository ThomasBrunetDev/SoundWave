import LikeBtn from "../LikeBtn";
import "../Communaute/publicPlaylist.css";
import "../../components/LikeBtn.css";
import "../../components/Recherche/listeRecherche.css"
import { BsThreeDotsVertical } from "react-icons/bs";

const DetailsArtiste = ({recherche}) => {

  /*Placeholder - manque de temps de consultation en équipe*/
    const donnees = [
     { id: 1, nom: "Yannick Coupal", titre: "Chanson 1", duree: 400, titreAlbum: "Album 1", image:"../../src/assets/img/pochette_disque_placeholder_1.jpg" },  
     { id: 2, nom: "Yannick Coupal", titre: "Chanson 2", duree: 300, titreAlbum: "Album 2", image:"../../src/assets/img/pochette_disque_placeholder_2.jpg" },
     { id: 3, nom: "Yannick Coupal", titre: "Chanson 3", duree: 200, titreAlbum: "Album 3", image:"../../src/assets/img/pochette_disque_placeholder_3.jpg" },
    ];


return (
      <div className="flex flex-col bg-perso-mauveFonce w-full m-0 p-0 text-center">
        <div className="h-96 bg-black public-playlist-cover">
           <img src="../../src/assets/img/image_placeholder_artiste.jpg" alt="" className="sm: opacity-50 rounded  lg: h-96 w-full object-cover object-center opacity-"/>
           <p className="relative font-supremeBold text-5xl ml-4 -top-28 text-left">Yannick Coupal</p>
           <p className="relative text-2xl -top-24 text-left ml-4">40M de fans</p>   
        </div>
                  
        {/* Section chansons */}
        <div className="flex flex-col w-full mt-12 pb-60 lg:px-4 apparition-texte lg:pb-0 ">  
            <p className='font-tanker text-3xl pb-6 lg:text-left '>Chansons</p>     
            <div className="h-24 w-full self-center list-none text-black">
               {donnees.map(chanson => (
                <div className="flex flex-row h-24 items-center list-none lg:bg-perso-bleuPale border border-perso-orangePale   rounded-lg overflow-hidden mb-6 text-white lg:text-black">
                  <div className="object-contain">
                    {chanson.titre && (
                    <img
                      className='w-28 rounded-lg cursor-pointer object-cover'
                      src={chanson.image}
                      alt=''
                    />
                    )}
                  </div>                 
                      
                  <div className="flex flex-row w-full items-center justify-center text-sm md:text-lg lg:text-xl">
                    <div className="truncate w-4/12 ml-2">
                      {chanson.titre.length > 30 ? (
                      <span className="text-ellipsis font-bold ">{`${chanson.titre.substring(0, 30)}...`}</span>
                      ) : (
                      <span className="font-bold">{chanson.titre}</span>
                      )}                    
                    </div>

                    <div className="w-4/12 ml-2">
                      {chanson.titreAlbum.length > 30 ? (
                      <span className="text-ellipsis font-bold">{`${chanson.titreAlbum.substring(0, 30)}...`}</span>
                      ) : (
                      <span className="font-bold">{chanson.titreAlbum}</span>
                      )}
                    </div>
                   
                    <div className="w-2/12 flex flex-row-reverse items-center justify-center text-center">
                      <div className="w-6 md:w-8 lg:12">
                        <LikeBtn/> </div>                                                 
                      </div> 

                    <div className="relative w-2/12 pl-8 text-right">
                      <BsThreeDotsVertical className='text-xl lg:text-2xl' />
                    </div>                                                                         
                  </div>  
                </div>
                ))}
              </div>
        </div>

      {/* Section albums */}        
        <div className="flex flex-col w-full h-screen mt-12 lg:px-4 apparition-texte lg:mt-80 lg:pb-0">  
            <p className='text-center font-tanker text-3xl mb-16 lg:text-left '>Albums</p>     
            <div className="flex flex-row items-center justify-center h-24 w-full self-center list-none">      
               {donnees.map(chanson => (
                  <div className="flex flex-col list-none rounded-lg mx-2 sm:mx-8 md:mx-12">
                      <div className="object-contain">
                        {chanson.image && (
                        <img
                          className='h-32 w-32 md:h-36 md:w-36 lg:h-42 lg:w-42 rounded-lg cursor-pointer object-cover'
                          src={chanson.image}
                          alt=''
                        />
                        
                        )}
                      </div> 

                      <div className="pt-4">
                        {chanson.titreAlbum.length > 30 ? (
                        <span className="text-ellipsis font-bold">{`${chanson.titreAlbum.substring(0, 30)}...`}</span>
                        ) : (
                        <span className="font-bold">{chanson.titreAlbum}</span>
                         )}
                      </div>
                  </div>
                ))}
            </div>
        </div> 
    </div>
  );
};

export default DetailsArtiste;