export type musicGenresModel = {
  id: string,
  value: string,
  bgColor: string,
  gradientColor: string
}
export const musicGenres: musicGenresModel[] = [
  { id: "pop", value: "Pop", bgColor:'bg-pink-600', gradientColor: 'from-pink-600/80' },
  { id: "rock", value: "Rock", bgColor:'bg-emerald-600', gradientColor: 'from-emerald-600/80'},
  { id: "hiphop", value: "Hip‑Hop", bgColor:'bg-amber-600', gradientColor: 'from-amber-600/80'},
  { id: "lofi", value: "LoFi", bgColor:'bg-cyan-600', gradientColor: 'from-cyan-600/80' },
  { id: "rnb", value: "R&B", bgColor:'bg-orange-600', gradientColor: 'from-orange-600/80' },
  { id: "house", value: "House", bgColor:'bg-fuchsia-600', gradientColor: 'from-fuchsia-600/80' },
  { id: "electronic", value: "Dance/Electronic", bgColor:'bg-lime-600', gradientColor: 'from-lime-600/80' },
  { id: "latin", value: "Latin", bgColor:'bg-red-600', gradientColor: 'from-red-600/80' },
  { id: "brazilian_funk", value: "Brazilian Funk", bgColor:'bg-indigo-600', gradientColor: 'from-indigo-600/80'},
  { id: "classical", value: "Classical", bgColor:'bg-blue-600', gradientColor: 'from-blue-600/80' },
  { id: "jazz", value: "Jazz", bgColor:'bg-yellow-600', gradientColor: 'from-yellow-600/80' },
  { id: "country", value: "Country", bgColor:'bg-teal-600', gradientColor: 'from-teal-600/80' },
  { id: "blues", value: "Blues", bgColor:'bg-indigo-600/40', gradientColor: 'from-indigo-600/80' },
  { id: "reggae", value: "Reggae",  bgColor:'bg-orange-600/40', gradientColor: 'from-orange-600/80' },
  { id: "soundtrack", value: "Soundtrack & Cinematic", bgColor:'bg-cyan-600/40', gradientColor: 'from-cyan-600/80' },
  { id: "mood", value: "Mood", bgColor:'bg-lime-600/40', gradientColor: 'from-lime-600/80'},
  { id: "workout", value: "Workout", bgColor:'bg-red-600/40', gradientColor: 'from-red-600/80' },
  { id: "focus", value: "Focus", bgColor:'bg-emerald-600/40', gradientColor: 'from-emerald-600/80' },
  { id: "study", value: "Study", bgColor:'bg-amber-600/40', gradientColor: 'from-amber-600/80'}
];