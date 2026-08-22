import axios from "axios";
import api from "./axiosInstance";


//itt lesznek az összes apik
//események lekérdezése
const API_URL = "http://127.0.0.1:8000/api";
const BACKEND_URL = "http://127.0.0.1:8000";    

//Események lekérése Django API-ból
export async function getEvents() {
    const response = await api.get("/esemenyek/");
    
    return response.data.map((event) => ({
        id: event.id,
        title: event.esemenyNev,
        date: event.esemenyDatum,
        location: event.esemenyHelyszin,
        jelentkezok: event.jelentkezok,
    }));
}


//égitestek

export async function getPlanets() {
    const response = await api.get("/egitestek/");
    
    return response.data.map((planet) => ({
        id: planet.id,
        name: planet.egitestNev,
        description: planet.egitestDescription,
        
        image: planet.egitestImage
        ? planet.egitestImage.startsWith("http")
        ? planet.egitestImage
        : `${BACKEND_URL}${planet.egitestImage}`
        : "",
        
        video: planet.egitestVideo
        ? planet.egitestVideo.startsWith("http")
        ? planet.egitestVideo
        : `${BACKEND_URL}${planet.egitestVideo}`
        : "",
    }));
}

export async function loginUser(username, password) {
    const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password,
    });
    
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    
    return {
        username,
        role: "user",
    };
}

export async function registerUser(username, email, password) {
    const response = await axios.post(`${API_URL}/auth/register/`, {
        username,
        email,
        password,
    });
    
    return response.data;
}

export async function getArticles() {
    const response = await api.get("/cikkek/");
    
    return response.data.map((article) => ({
        id: article.id,
        title: article.cikkNev,
        description: article.cikkShortDescription,
        content: article.cikkLongDescription,
        
        image: article.cikkImage
        ? article.cikkImage.startsWith("http")
        ? article.cikkImage
        : `${BACKEND_URL}${article.cikkImage}`
        : "",
        
        video: article.cikkVideo
        ? article.cikkVideo.startsWith("http")
        ? article.cikkVideo
        : `${BACKEND_URL}${article.cikkVideo}`
        : "",
    }));
}

// Jelentkezés / Jelentkezés lemondása    ŰJ
export async function toggleEventRegistration(eventId) {
  const response = await api.post(
    `/esemenyek/${eventId}/jelentkezes/`);
  return response.data;
}

/*-----Ez hivja me a django jelentkezés végpontját-----*/

// ... meglévő kódrészletek és token beállítások ...

export const toggleJelentkezes = async (eventId) => {
  const token = localStorage.getItem("token"); // vagy ahol a JWT tokent tárolod
  const response = await axios.post(
    `/api/esemenyek/${eventId}/jelentkezes/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/*-----------------------------------------------------*/
// Egy konkrét esemény lekérése ID alapján
export async function getEventById(id) {
  const response = await api.get(`/esemenyek/${id}/`);
  const event = response.data;

  return {
    id: event.id,
    title: event.esemenyNev,
    date: event.esemenyDatum,
    location: event.esemenyHelyszin,
    description: event.esemenyLeiras || event.esemenyDescription || "", // ha van leírás mező a Django-ban
    jelentkezok: event.jelentkezok || [],
    isRegistered: event.is_registered || false, // ha a backend visszaküldi a státuszt
  };
}

// Kommentek lekérése
export async function getComments() {
    const response = await api.get("/kommentek/");
    return response.data;
}

// Új komment hozzáadása
export async function addComment(tartalom) {
    const response = await api.post("/kommentek/", { tartalom });
    return response.data;
}

export default API_URL;
