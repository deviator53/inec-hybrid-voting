// Complete list of Nigerian States and their Local Government Areas
export interface LGAData {
  [state: string]: string[];
}

export const nigeriaLGAs: LGAData = {
  "Abia": [
    "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano",
    "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa",
    "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West",
    "Umuahia North", "Umuahia South", "Umu Nneochi"
  ],
  "Adamawa": [
    "Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong",
    "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika",
    "Mubi North", "Mubi South", "Numan", "Shelleng", "Song",
    "Toungo", "Yola North