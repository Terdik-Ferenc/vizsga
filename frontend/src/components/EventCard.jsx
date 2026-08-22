import "../styles/event.css";

function EventCard({ event, onView }) {
    const formattedDate = new Date(event.date).toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="event-card">
            <h2>{event.title}</h2>

            <p>
                <strong>Dátum:</strong> {formattedDate}
            </p>

            <p>
                <strong>Helyszín:</strong> {event.location}
            </p>

            <button onClick={onView}>
                Részletek
            </button>
        </div>
    );
}

export default EventCard;