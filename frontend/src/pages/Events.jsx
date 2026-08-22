// src/pages/Events.jsx
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getEvents } from "../services/api";

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const loadEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Hiba az események betöltésekor", error);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <div className="page">
      <h1>Közelgő események</h1>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onView={() => navigate(`/events/${event.id}`)}
          onRefresh={loadEvents} // Átadunk egy frissítő függvényt
        />
      ))}
    </div>
  );
}

export default Events;