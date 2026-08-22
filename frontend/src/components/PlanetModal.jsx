import "../styles/modal.css";

function PlanetModal({planet,closeModal})
{
    if(!planet) return null;
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={closeModal}>
                    X

                </button>
                <h1>{planet.name}</h1>
                <video
                    className="modal-video"
                    controls
                    autoPlay
                    muted
                    playsInline
                    >
                        <source
                        src={planet.video}
                        type="video/webm"
                        />
                </video>
                <p>{planet.description}</p>

            </div>

        </div>
    );
}

export default PlanetModal;