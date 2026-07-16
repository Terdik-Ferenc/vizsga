import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Egitestek.css'; // Itt formázhatod a kártyákat

const Egitestek = () => {
    const [egitestekList, setEgitestekList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Django alapértelmezett URL a médiafájlokhoz, ha a DRF nem adna teljes URL-t
    const BACKEND_URL = 'http://localhost:8000';

    useEffect(() => {
        const fetchEgitestek = async () => {
            const token = localStorage.getItem('access_token');
            
            if (!token) {
                setError('Nincs bejelentkezési token! Kérlek, lépj be előbb.');
                setLoading(false);
                return;
            }

            try {
                // Küldjük a kérést a Bearer tokennel a fejlécben
                const response = await axios.get('http://127.0.0.1:8000/api/egitestek/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEgitestekList(response.data);
                setLoading(false);
            } catch (err) {
                setError('Nem sikerült az adatok lekérése. Lehet, hogy lejárt a munkameneted.');
                setLoading(false);
                console.error("Hiba az API lekérésnél:", err);
            }
        };

        fetchEgitestek();
    }, []);

    if (loading) return <div className="loading">Adatok betöltése...</div>;
    if (error) return <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div className="egitestek-container">
            <h2>Felfedezett Égitestek</h2>
            
            {egitestekList.length === 0 ? (
                <p>Jelenleg nincsenek feltöltött égitestek az adatbázisban.</p>
            ) : (
                <div className="egitestek-grid">
                    {egitestekList.map((egitest) => {
                        // Kép és videó URL kezelése (DRF néha relatív, néha abszolút URL-t ad vissza)
                        const imageUrl = egitest.egitestImage?.startsWith('http') 
                            ? egitest.egitestImage 
                            : `${BACKEND_URL}${egitest.egitestImage}`;
                            
                        const videoUrl = egitest.egitestVideo?.startsWith('http') 
                            ? egitest.egitestVideo 
                            : `${BACKEND_URL}${egitest.egitestVideo}`;

                        return (
                            <div key={egitest.id} className="egitest-card">
                                {/* Égitest neve */}
                                <h3>{egitest.egitestNev}</h3>
                                
                                {/* Kép megjelenítése (ha létezik) */}
                                {egitest.egitestImage && (
                                    <div className="image-wrapper">
                                        <img 
                                            src={imageUrl} 
                                            alt={egitest.egitestNev} 
                                            className="egitest-img" 
                                        />
                                    </div>
                                )}

                                {/* Leírás szakasz */}
                                <div className="description-section">
                                    <p>{egitest.egitestDescription}</p>
                                </div>

                                {/* Videó lejátszó (ha van feltöltött videó) */}
                                {egitest.egitestVideo && (
                                    <div className="video-wrapper">
                                        <h4>Kapcsolódó videó:</h4>
                                        <video controls className="egitest-video">
                                            <source src={videoUrl} />
                                            A böngésződ nem támogatja a videók lejátszását.
                                        </video>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Egitestek;