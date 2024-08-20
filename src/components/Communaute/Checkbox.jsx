const Checkbox = ({check, change}) => {
  return (
    <label className='cont'>
      <input
        type='checkbox'
        checked={check}
        onChange={change}
      />
      <span className="check"></span>
    </label>
  );
};
export default Checkbox;
