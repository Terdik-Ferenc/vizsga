import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, toggleEventRegistration } from "../services/api"; // Igazítsd az elérést a saját mappaszerkezetedhez
import "../styles/EventDetails.css"; //külön CSS fájl az esemény részletekhez


const EventDetails = () => {
  const { id } = useParams(); // URL paraméter kiolvasása (/events/:id)
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Esemény betöltése az oldal megnyitásakor
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Hiba az esemény betöltésekor:", err);
        setError("Nem sikerült betölteni az esemény részleteit.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  // Jelentkezés / Lemondás kezelése
  const handleRegistration = async () => {
    try {
      setIsSubmitting(true);
      await toggleEventRegistration(id);
  console.log("toggleEventRegistration called for event ID:", id); // Debugging: log the event ID
      
      // Újratöltjük az eseményt, hogy a legfrissebb állapotot mutassuk
      const updatedEvent = await getEventById(id);
      setEvent(updatedEvent);
    } catch (err) {
      console.error("Hiba a jelentkezés során:", err);
      alert("Hiba történt a jelentkezés feldolgozásakor! Lehet, hogy nem vagy bejelentkezve?");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Betöltés...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  if (!event) return <div style={{ padding: "20px" }}>A keresett esemény nem található.</div>;

  // logok
      console.log("Event details:", event); // Debugging: log the event details
     // console.log("Is user registered:", event.isRegistered); // Debugging: log the registration status
      console.log("Number of registrants:", event.jelentkezok.length); // Debugging: log the number of registrants
      console.log("esemeny név:", event.esemenyNev);
      console.log("Esemeny helyszin:", event.esemenyHelyszin);
      console.log("Esemeny dátum:", event.esemenyDatum);
      console.log("Esemeny :description", event.esemenyLeiras);
      console.log("Esemeny jelentkezők:", event.jelentkezok );
      console.log("Esemeny isRegistered:", event.is_registered);

  return (
    <div className="page">
      <button onClick={() => navigate(-1)} style={{ marginBottom: "15px" }}>
        &larr; Vissza
      </button>

      <h1>{event.title}</h1>
      
      <div classname="event-details">
        <p><strong>Dátum:</strong> {new Date(event.date).toLocaleString("hu-HU")}</p>
        <p><strong>Helyszín:</strong> {event.location}</p>
        {event.jelentkezok && (
          <p><strong>Jelentkezők száma:</strong> {event.jelentkezok.length}</p>
        )}
      </div>

      {event.description && (
        <div classname="leiras-class">
          <h3>Leírás</h3>
          <p>{event.description}</p>
        </div>
      )}

      <button
        className="jelentkezes-btn"
        onClick={handleRegistration}
        disabled={isSubmitting}
        style={{
          backgroundColor: event.isRegistered ? "#dc3545" : "#28a745",
        }}
      >
        {isSubmitting
          ? "Feldolgozás..."
          : event.isRegistered
          ? "Jelentkezés lemondása"
          : "Jelentkezem az eseményre"}
      </button>
          {event.jelentkezok.length > 0 ? (
            <div >              
              <table className="user-table">
              <thead>
                <tr>
                  <th id="registrants-header" colSpan="2">Jelentkezők listája</th>
                </tr>
                <tr>
                  <th>Felhasználónév</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                {event.jelentkezok.map((registrant) => (
                <tr key={registrant.id}>
                  <td id="user-table-user">{registrant.username}</td>
                  <td id="user-table-email" >{registrant.email || "nincs email"}</td>
                </tr>
                ))}
              </tbody>
              </table>
              <br />
            </div>
          ):(<p id="message-senki" >Erre az eseményre még nem jelentkezett senki!</p>)}

    </div>
  );
};

export default EventDetails;