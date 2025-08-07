const getMinutesDiferrence = (uploadDateString: string) => {
  let currentDate = new Date();
  let uploadDate = new Date(uploadDateString);
  let differenceInMilisec = currentDate.getTime() - uploadDate.getTime();
  return Math.round(differenceInMilisec / 60000)
}
export default getMinutesDiferrence