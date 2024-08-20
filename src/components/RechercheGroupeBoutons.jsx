// import {useEffect,useState } from "react";
// import ListeArtiste from "./Recherche/ListeArtiste";

// const RechercheGroupeBoutons = ({clicTitre, resetClicTitre, clicArtiste, resetClicArtiste, clicAlbum, resetClicAlbum}) => {

//   const [isClickedTitre, setIsClickedTitre] = useState(false);
//   const [isClickedArtiste, setIsClickedArtiste] = useState(true);
//   const [isClickedAlbum, setIsClickedAlbum] = useState(true);


//   const clicBoutonTitre = () => {
//     setIsClickedTitre(true);
//     setIsClickedArtiste(false);
//     setIsClickedAlbum(false);
//     clicTitre(true);
//     console.log(isClickedTitre);
//   };

//   const clicBoutonArtiste = () => {
//     setIsClickedTitre(false);
//     setIsClickedArtiste(true);
//     setIsClickedAlbum(false);
//     clicArtiste(true);
//     console.log(isClickedArtiste);
//   };

//   const clicBoutonAlbum = () => {
//     setIsClickedTitre(false);
//     setIsClickedArtiste(false);
//     setIsClickedAlbum(true);
//     clicAlbum(true);
//     console.log(isClickedAlbum);
//   };

//   // useEffect(() => {
//   //   if (resetClicTitre) {setIsClickedTitre(true);
//   //   }
//   // }, [resetClicTitre]);
  

//   // useEffect(() => {
//   //   if (resetClicArtiste) {setIsClickedArtiste(true);
//   //   }
//   // }, [resetClicArtiste]);
  
  
// //  useEffect(() => {
// //     if (resetClicAlbum) {setIsClickedAlbum(true);
// //     }
// //   }, [resetClicAlbum]);

 
// return (
//   <div className=" pt-6 pb-12 lg:pb-16">
//     <div className='flex flex-row self-center mt-4 justify-evenly -top-6 text-white text-center lg:-top-16'>
//       <button onClick={clicBoutonTitre} className='boutonsTri glow-on-hover bg-perso-mauvePale hover:bg-perso-orangePale  hover:text-perso-mauveFonce md:w-36 md:text-lg md:mx-2 xl:w-60 xl:text-xl md:hover:text-xl xl:hover:text-2xl md:focus:text-xl xl:focus:text-2xl'>
//         Par titre
//       </button>
            
//       <button onClick={clicBoutonArtiste} className='boutonsTri bg-perso-mauvePale hover:bg-perso-orangePale hover:text-perso-mauveFonce md:w-36 md:text-lg md:mx-2 xl:w-60 xl:text-xl  md:hover:text-xl xl:hover:text-2xl md:focus:text-xl xl:focus:text-2xl'>
//         Par artiste
//       </button>
  
//       <button onClick={clicBoutonAlbum} className='boutonsTri bg-perso-mauvePale hover:bg-perso-orangePale hover:text-perso-mauveFonce md:w-36 md:text-lg md:mx-2 xl:w-60 xl:text-xl  md:hover:text-xl xl:hover:text-2xl md:focus:text-xl xl:focus:text-2xl'>
//         Par album
//       </button>          
//     </div>           
//   </div>
// );
// }
// export default RechercheGroupeBoutons;


