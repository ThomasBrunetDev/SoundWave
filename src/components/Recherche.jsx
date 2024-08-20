import disque from '../../src/assets/img/svg/disque.svg';

const Recherche = ({ }) => {
    return (

    <div className="w-full mt-8 pb-24 bg-perso-mauveFonce lg:pb-0">
        <h1 className="text-5xl pb-16 uppercase font-tanker text-center lg:text-left">
            Découvrir
        </h1>
        {/* <div className="font-supremeMedium grid place-items-center md:grid-cols-2 xl:grid-cols-3 xl:gap-y-10 xl:gap-x-10"> */}
        <div className="font-supremeMedium grid place-items-center md:grid-cols-2 lg:place-items-start xl:grid-cols-3 xl:gap-y-10 xl:gap-x-10">
            <button className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src={disque} alt="Jazz" className="opacity-75 relative -left-24" />
                <span className="absolute text-3xl top-32 right-8">Jazz</span>
            </button>
            <button className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src={disque} alt="Rock" className="opacity-75 relative -left-24"/>
                <span className="absolute text-3xl top-32 right-8">Rock</span>
            </button>
            <button className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src={disque} alt="Pop" className="opacity-75 relative -left-24" />
                <span className="absolute text-3xl top-32 right-8">Pop</span>
            </button>
            <button className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src={disque} alt="Classique" className="opacity-75 relative -left-24" /> 
                <span className="absolute text-3xl top-32 right-8">Classique</span>
            </button>
            <button className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src={disque} alt="Hip Hop" className="opacity-75 relative -left-24" /> 
                <span className="absolute text-3xl top-32 right-8">Hip Hop</span>
            </button>
            <button className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src={disque} alt="Country" className="opacity-75 relative -left-24" />
                <span className="absolute text-3xl top-32 right-8">Country</span>
            </button>
            <button className="bg-perso-grisFonce rounded-3xl mb-6 h-48 w-3/4 relative overflow-hidden">
                <img src={disque} alt="Électro" className="opacity-75 relative -left-24"/>
                <span className="absolute text-3xl top-32 right-8">Électro</span>
            </button>           
        </div>
    </div>
    );
}
export default Recherche;