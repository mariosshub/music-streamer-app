export const getGenresBgColor = (index: number) => {
  if(index > 10){
    index = index - 10;
  }
  switch (index) {
    case 0:
      return {
        bgColor:'bg-pink-600',
        gradientColor: 'from-pink-600/80'
      }
    case 1:
      return {
        bgColor:'bg-emerald-600',
        gradientColor: 'from-emerald-600/80'
      }
    case 2:
      return {
        bgColor:'bg-amber-600',
        gradientColor: 'from-amber-600/80'
      }
    case 3:
      return {
        bgColor:'bg-cyan-600',
        gradientColor: 'from-cyan-600/80'
      }
    case 4:
      return {
        bgColor:'bg-fuchsia-600',
        gradientColor: 'from-fuchsia-600/80'
      }
    case 5:
      return {
        bgColor:'bg-orange-600',
        gradientColor: 'from-orange-600/80'
      }
    case 6:
      return {
        bgColor:'bg-lime-600',
        gradientColor: 'from-lime-600/80'
      }
    case 7:
      return {
        bgColor:'bg-indigo-600',
        gradientColor: 'from-indigo-600/80'
      }
    case 8:
      return {
        bgColor:'bg-blue-600',
        gradientColor: 'from-blue-600/80'
      }
    case 9:
      return {
        bgColor:'bg-yellow-600',
        gradientColor: 'from-yellow-600/80'
      }
    case 10:
      return {
        bgColor:'bg-red-600',
        gradientColor: 'from-red-600/80'
      }
    default:
      return {
        bgColor:'bg-teal-600',
        gradientColor: 'from-teal-600/80'
      }
  }
}