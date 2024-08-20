

const ItemMusiqueArtiste = ({ song, index, screenWidth }) => {
  return (
    <div
      className='flex items-center gap-2'
      key={index}>
      <img
        className='w-11 h-11 rounded-md'
        src={song.cover}
        alt=''
      />
      <div className='flex flex-col'>
        {screenWidth < 1024 ? (
          <h3>
            {song.title.length > 30
              ? `${song.title.substring(0, 30)}...`
              : song.title}
          </h3>
        ) : (
          <h3>
            {song.title.length > 20
              ? `${song.title.substring(0, 20)}...`
              : song.title}
          </h3>
        )}
        <p className='text-sm block'>{song.nbFoisEcoute} écoutes</p>
      </div>
    </div>
  );
};

export default ItemMusiqueArtiste;
