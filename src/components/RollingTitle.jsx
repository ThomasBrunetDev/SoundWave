import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const RollingTitle = ({ title }) => {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            await controls.start({ opacity: 1 });

            while (true) {
                // Show the title initially for 1 second

                // Start rolling animation after 1.5 second
                await new Promise((resolve) => setTimeout(resolve, 2000));
                await controls.start({
                    translateX: ["0%", "-70%"],
                    transition: { ease: "linear", duration: 10 },
                });
                // Take a break for 1.5 seconds
                await new Promise((resolve) => setTimeout(resolve, 2000));

                await controls.start({
                    translateX: ["-70%", "0%"],
                    transition: { ease: "linear", duration: 10 },
                });

                // Delay before repeating the animation (5 seconds in this example)
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        };

        // Call the sequence function within the useEffect hook
        sequence();
    }, [controls, title]);

    return (
        <motion.div
            animate={controls}
            initial={{ opacity: 0, translateX: "0%" }}
            className='whitespace-nowrap flex gap-14'>
            <h3>{title}</h3>
            <h3>{title}</h3>
        </motion.div>
    );
};
export default RollingTitle;