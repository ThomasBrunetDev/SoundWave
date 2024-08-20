

const ButtonChansonsAimee = ({ text, clicFn }) => {
    return (
        <>
            <button className="bg-[#6744A3] w-24 text-sm h-8 border-2 rounded-xl border-perso-mauvePale flex items-center justify-center" onClick={clicFn}>
                <span>{text}</span>
            </button>
        </>
    );

}
export default ButtonChansonsAimee;