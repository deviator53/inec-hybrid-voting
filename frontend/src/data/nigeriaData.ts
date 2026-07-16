// Helper function to get all state names
export const getAllStateNames = (): string[] => {
  return [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];
};

// Export nigeriaStates for backward compatibility
export const nigeriaStates = getAllStateNames();

// Helper function to get LGAs for a state (simplified version)
export const getLGAsForState = (state: string): string[] => {
  // Simplified - returns sample LGAs
  // In production, you'd have a full mapping
  const lgaMap: Record<string, string[]> = {
    Lagos: [
      "Alimosho",
      "Ajeromi-Ifelodun",
      "Kosofe",
      "Mushin",
      "Oshodi-Isolo",
      "Ojo",
      "Ikorodu",
      "Surulere",
      "Agege",
      "Ifako-Ijaiye",
    ],
    FCT: ["Abuja Municipal", "Gwagwalada", "Kuje", "Bwari", "Abaji", "Kwali"],
    Kano: [
      "Kano Municipal",
      "Fagge",
      "Dala",
      "Gwale",
      "Tarauni",
      "Nassarawa",
      "Kumbotso",
    ],
    Rivers: [
      "Port Harcourt",
      "Obio-Akpor",
      "Eleme",
      "Ikwerre",
      "Emohua",
      "Oyigbo",
    ],
    Oyo: [
      "Ibadan North",
      "Ibadan South-West",
      "Ibadan South-East",
      "Ibadan North-East",
      "Ibadan North-West",
    ],
  };

  return lgaMap[state] || ["LGA 1", "LGA 2", "LGA 3", "LGA 4", "LGA 5"];
};
