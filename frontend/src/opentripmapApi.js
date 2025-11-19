import axios from "axios";

export const tripMapInstance = axios.create({
    
  baseURL: "https://api.opentripmap.com/0.1/en/places",
  params: {
    apikey: import.meta.env.VITE_OPENTRIPMAP_API_KEY,
  },
  
});
