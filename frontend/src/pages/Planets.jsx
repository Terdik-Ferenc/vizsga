import{useEffect, useState} from "react";
import PlanetCard from "../components/PlanetCard";
import PlanetModal from "../components/PlanetModal";

import { getPlanets } from "../services/api";



function Planets()
{
    const [selectedPlanet,setSelectedPlanet]=useState(null);

    const [planets,setPlanets]=useState([]);

    useEffect(()=>{
        async function loadPlanets() {
        try{
            const data=await getPlanets();
            setPlanets(data);
            } 
            catch (error) {
            console.error("Hiba a bolygók betöltésekor:", error);
            }
            
            
        }
        loadPlanets();
    },[]);

   
    return (
        <div className="page">
            <h1>Égitestek</h1>
            <div className="planet-container">
                {planets.map((planet)=>(
                    <PlanetCard
                    key={planet.id}
                    planet={planet}
                    onClick={()=>setSelectedPlanet(planet)}
                    />
                ))}


            </div>
            
            {selectedPlanet &&(
            <PlanetModal 
            planet={selectedPlanet}
            closeModal={()=>setSelectedPlanet(null)}
            />

            )}
            

        </div>
    );
    
}
export default Planets;