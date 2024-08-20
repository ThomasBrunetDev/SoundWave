import LikeBtn from "../LikeBtn";
import FormatMinutesSecondes from "../FormatMinutesSecondes";
import "../Communaute/publicPlaylist.css";
import "../../components/LikeBtn.css";
import "../../components/Recherche/listeRecherche.css"
import { BsThreeDotsVertical } from "react-icons/bs";
import "../../components/Recherche/listeArtiste.css"

const DetailsAlbum = ({recherche}) => {

  /*Placeholder - manque de temps de consultation en équipe*/
    const donnees = [
     { id: 1, nom: "Yannick Coupal", titre: "Chanson 1", duree: 400, titreAlbum: "Album 3", image:"../../src/assets/img/pochette_disque_placeholder_1.jpg" },  
     { id: 2, nom: "Yannick Coupal", titre: "Chanson 2", duree: 300, titreAlbum: "Album 3", image:"../../src/assets/img/pochette_disque_placeholder_2.jpg" },
     { id: 3, nom: "Yannick Coupal", titre: "Chanson 3", duree: 200, titreAlbum: "Album 3", image:"../../src/assets/img/pochette_disque_placeholder_3.jpg" },
     { id: 4, nom: "Yannick Coupal", titre: "Chanson 4", duree: 400, titreAlbum: "Album 3", image:"../../src/assets/img/pochette_disque_placeholder_1.jpg" },  
     { id: 5, nom: "Yannick Coupal", titre: "Chanson 5", duree: 300, titreAlbum: "Album 3", image:"../../src/assets/img/pochette_disque_placeholder_2.jpg" },
     { id: 6, nom: "Yannick Coupal", titre: "Chanson 6", duree: 200, titreAlbum: "Album 3", image:"../../src/assets/img/pochette_disque_placeholder_3.jpg" },
    ];


return (
      <div className="flex flex-col bg-perso-mauveFonce w-full mt-4 m-0 mb-60 text-center h-screen text-white lg:text-black">
        <div className="flex flex-row items-center lg:mt-28">
          <div className="flex flex-row pl-4 h-48 w-48 public-playlist-cover-inverse">
             <img src="../../src/assets/img/pochette_disque_placeholder_3.jpg" alt="" className="w-full rounded-3xl sm: opacity-100 object-cover object-center"/>
          </div>
          <div>
             <div className="flex flex-col ml-16 text-white">
               <p className="relative font-supremeBold text-3xl pb-2 ml-4 text-left">Album 3</p>
               <p className="relative text-2xl text-left ml-4">Yannick Coupal</p>
             </div>
          </div>
        </div>
                  
        {/* Section chansons */}
        <div className="flex flex-col w-full mt-12 pb-60 lg:px-4 apparition-texte lg:pb-0"> 
            <div className="h-24 w-full self-center list-none">
               {donnees.map(chanson => (
                <div className="flex flex-row h-24 items-center list-none lg:bg-perso-bleuPale border border-perso-orangePale   rounded-lg overflow-hidden mb-6 p-4">
                                 
                      
                  <div className="flex flex-row w-full items-center justify-center text-sm md:text-lg lg:text-xl">
                    <div className="w-1/8">
                      {chanson.id}                    
                    </div>  

                    <div className="truncate w-1/4 ml-2">
                      {chanson.titre.length > 30 ? (
                      <span className="text-ellipsis font-bold ">{`${chanson.titre.substring(0, 30)}...`}</span>
                      ) : (
                      <span className="font-bold">{chanson.titre}</span>
                      )}               
                    </div>

                    <div className="font-bold w-1/4 text-center">
                      <FormatMinutesSecondes secondes={chanson.duree} />
                    </div>
                        
                    <div className="w-1/4 flex flex-row-reverse items-center justify-center text-center">
                      <div className="w-6 md:w-8 lg:12">
                        <LikeBtn/> </div>                                                 
                      </div> 

                    <div className="relative w-1/8 text-right">
                      <BsThreeDotsVertical className='text-xl lg:text-2xl' />
                    </div>                                                                         
                  </div>  
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default DetailsAlbum;