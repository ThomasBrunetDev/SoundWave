import {useState } from "react";
import ListeGenre from "./ListeTitre";
import RechercheGroupeBoutons from "./RechercheGroupeBoutons";


const Decouverte = () => {

const [selectedApi, setSelectedApi] = useState(null);

const handleButtonClick = (api) => {
  setSelectedApi(api);
};

    return (

    <div className="w-full mt-8 pb-24 bg-perso-mauveFonce lg:pb-0">
        
        {/* <h1 className="text-5xl pb-16 uppercase font-tanker text-center">
            Découvrir par genre
        </h1> */}
        {/* <RechercheGroupeBoutons/> */}
        
        {/* <h1 className="text-5xl pb-16 uppercase font-tanker text-center lg:text-left"> */}
        
        {/* <div className="font-supremeMedium grid place-items-center md:grid-cols-2 xl:grid-cols-3 xl:gap-y-10 xl:gap-x-10"> */}

        
            
        {/* <div className="font-supremeMedium grid place-items-center md:grid-cols-2 lg:place-items-start xl:grid-cols-3 xl:gap-y-10 xl:gap-x-10"> */}
        {/* <div className="font-supremeMedium grid place-items-center md:grid-cols-2 xl:grid-cols-3 xl:gap-y-10 xl:gap-x-10">

            <button onClick={() => handleButtonClick('jazz')} className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src="../../src/assets/img/disque.svg" alt="Jazz" class="opacity-75 relative -left-24" />
                <span className="absolute text-3xl top-32 right-8">Jazz</span>               
            </button>
            {selectedApi === 'jazz' && (<ListeGenre genre="jazz"/>)}


            <button onClick={() => handleButtonClick('rock')} className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src="../../src/assets/img/disque.svg" alt="Rock" class="opacity-75 relative -left-24"/>
                <span className="absolute text-3xl top-32 right-8">Rock</span>
            </button>
            {selectedApi === 'rock' && (<ListeGenre genre="rock"/>)}


            <button onClick={() => handleButtonClick('pop')} className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src="../../src/assets/img/disque.svg" alt="Pop" class="opacity-75 relative -left-24" />
                <span className="absolute text-3xl top-32 right-8">Pop</span>
            </button>
            {selectedApi === 'pop' && (<ListeGenre genre="pop"/>)}

            <button onClick={() => handleButtonClick('classique')} className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src="../../src/assets/img/disque.svg" alt="Classique" class="opacity-75 relative -left-24" /> 
                <span className="absolute text-3xl top-32 right-8">Classique</span>
            </button>
            {selectedApi === 'classique' && (<ListeGenre genre="classique"/>)}

            <button onClick={() => handleButtonClick('hiphop')} className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src="../../src/assets/img/disque.svg" alt="Hip Hop" class="opacity-75 relative -left-24" /> 
                <span className="absolute text-3xl top-32 right-8">Hip Hop</span>
            </button>
            {selectedApi === 'hiphop' && (<ListeGenre genre="hiphop"/>)}
            
            <button onClick={() => handleButtonClick('country')} className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src="../../src/assets/img/disque.svg" alt="Country" class="opacity-75 relative -left-24" />
                <span className="absolute text-3xl top-32 right-8">Country</span>
            </button>
            {selectedApi === 'country' && (<ListeGenre genre="country"/>)}

            <button onClick={() => handleButtonClick('electro')} className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src="../../src/assets/img/disque.svg" alt="Électro" class="opacity-75 relative -left-24"/>
                <span className="absolute text-3xl top-32 right-8">Électro</span>
            </button>   
            {selectedApi === 'electro' && (<ListeGenre genre="electro"/>)} 

        </div> */}
    </div>
    );
}
export default Decouverte;