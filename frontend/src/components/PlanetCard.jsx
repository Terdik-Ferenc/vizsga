import "../styles/planet.css";
function PlanetCard({planet,onClick})
{
    return(
        <div className="planet-card" onClick={onClick}>
            {planet.image && (
            <img src={planet.image} 
            alt={planet.name} 
            className="planet-image" />
            )}
            <h2>{planet.name}</h2>

            <button>Részletek</button>

        </div>
    );
}
export default PlanetCard;