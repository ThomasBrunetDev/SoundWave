import { motion, AnimatePresence, useAnimation } from "framer-motion";

const PlaylistPopUp = ({ open, changeFn, clicFn, playlistTitle, isOpen }) => {

    const controls = useAnimation();

    const clicFn2 = async () => {
        if (playlistTitle.trim() === '') {
            await controls.start({ x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 }})

            setTimeout(() => (
                controls.start({ x: 0, transition: { duration: 0.2 }})
            ), 200)
        } else {
            clicFn();
            isOpen();
        }
    }
    const isOpen2 = () => {
        changeFn("");
        isOpen();
    }
    return (
        <AnimatePresence>
            {open && (

                <motion.div
                    className="fixed left-0 top-0 w-screen h-screen flex backdrop-blur-md backdrop-brightness-50 z-30 items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="flex flex-col gap-5 items-center justify-center"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: 20 }}
                    >

                        <h1 className="font-supremeBold text-xl">Nommez votre liste de lecutre</h1>
                        <motion.input
                            className="bg-transparent text-center border-b text-2xl font-supremeBold border-white w-80 pb-4 h-10 p-2 text-white "
                            type="text"
                            autoFocus
                            value={playlistTitle}
                            
                            onChange={(e) => changeFn(e.target.value)}
                            animate={controls}
                        />
                        <div className="flex gap-7 text-lg">
                            <button className="text-gray-400" onClick={isOpen2}>Fermer</button>
                            <button onClick={clicFn2}>Créer</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
export default PlaylistPopUp;