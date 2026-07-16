import { nigeriaStates as statesData } from "./nigeria-lgas";

// Helper function to get all state names
export const getAllStateNames = (): string[] => {
  return statesData.map((state) => state.name);
};

// Export nigeriaStates for backward compatibility
export const nigeriaStates = getAllStateNames();

// Helper function to get LGAs for a state
export const getLGAsForState = (stateName: string): string[] => {
  const state = statesData.find((s) => s.name === stateName);
  return state ? state.lgas : [];
};
