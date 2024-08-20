import AccueilFavoris from "./AccueilFavoris";
import AlbumRandom from "./AlbumRandom";
import { Helmet } from "react-helmet";
const Accueil = () => {
    return (
        <div className="pb-32 w-full min-h-screen mt-20 flex flex-col gap-16 items-center">
            <Helmet>
                <title>SoundWave | Accueil</title>
            </Helmet>
            <AlbumRandom />
            <AccueilFavoris />
        </div>
    );

}
export default Accueil;