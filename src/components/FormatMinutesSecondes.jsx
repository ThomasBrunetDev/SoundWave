const FormatMinutesSecondes = ({secondes}) => {
  const minutes = Math.floor(secondes / 60);
  const secondesRestantes = secondes % 60;
  return `${minutes}:${secondesRestantes < 10 ? '0' : ''}${secondesRestantes}`;
};

export default FormatMinutesSecondes;
