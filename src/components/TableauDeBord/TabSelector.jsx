
const TabSelector = ({ selection, setSelection, setTypeListeAffiche }) => {
  const selectionStyle = {
    backgroundColor: "#6744A3",
    backgroundColor1: "#8D5DDE",
  };

  return (
    <ul className='flex justify-between w-72'>
      <li
        style={{
          backgroundColor:
            selection === 'chansons'
              ? selectionStyle.backgroundColor1
              : selectionStyle.backgroundColor,
        }}
        className='px-5 rounded-2xl h-9 flex items-center'>
        <button
          onClick={() => {
            setSelection('chansons');
            setTypeListeAffiche('privee');
          }}>
          Chansons
        </button>
      </li>
      <li
        style={{
          backgroundColor:
            selection === 'playlists'
              ? selectionStyle.backgroundColor1
              : selectionStyle.backgroundColor,
        }}
        className='px-5 rounded-2xl h-9 flex items-center'>
        <button onClick={() => setSelection('playlists')}>
          Listes de lectures
        </button>
      </li>
    </ul>
  );
};

export default TabSelector;
