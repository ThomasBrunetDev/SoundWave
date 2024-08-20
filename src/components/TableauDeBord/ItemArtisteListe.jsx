import ItemMusiqueArtiste from "./ItemMusiqueArtiste"; // Importez le composant ItemMusiqueArtiste

const ItemArtisteListe = ({ artist, stats, screenWidth }) => {
  return (
    <li
      className='w-full h-full bg-center bg-cover'
      style={{ backgroundImage: `url(${stats.artistImg})` }}
      key={artist}>
      <div className='w-full h-full py-5 px-5 flex flex-col justify-between backdrop-brightness-50'>
        <div>
          <h1 className='font-tanker text-4xl'>{artist}</h1>
          <p className='text-xl font-supremeBold flex items-center gap-2'>
            {stats.totalNbFoisEcoute}
            <span className='text-sm font-supremeRegular'>écoutes</span>
          </p>
        </div>
        <ul className='flex flex-col lg:flex-row items-start lg:items-center lg:justify-center gap-6 lg:gap-16 w-full '>
          {stats.songs.slice(0, 3).map((song, index) => (
            <ItemMusiqueArtiste
              key={index}
              song={song}
              index={index}
              screenWidth={screenWidth}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

export default ItemArtisteListe;
