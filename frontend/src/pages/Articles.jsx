import { useState, useEffect } from "react";
import { getArticles } from "../services/api";
import "../styles/articles.css";

function Articles() {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function loadArticles() {
        try {
            const data = await getArticles();
            setArticles(data);
        } catch (error) {
            console.error("Hiba a cikkek betöltésekor:", error);
        }
    }

    loadArticles();
}, []);

    return (
        <div className="page">
            <h1>Cikkek</h1>

            <div className="article-container">
                {articles.map((article) => (
                    <div className="article-card" key={article.id}>
                        {article.image && (
    <img
        src={article.image}
        alt={article.title}
        className="article-image"
    />
)}

                        <h2>{article.title}</h2>

                        <p>{article.description}</p>

                        <button onClick={() => setSelectedArticle(article)}>
                            Olvasás
                        </button>
                    </div>
                ))}
            </div>

            {selectedArticle && (
                <div className="article-modal-overlay">
                    <div className="article-modal">
                        <button
                            className="close-btn"
                            onClick={() => setSelectedArticle(null)}
                        >
                            X
                        </button>

                        <h1>{selectedArticle.title}</h1>

                       {selectedArticle.image && (
                <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="article-modal-image"
                />
            )}

                {selectedArticle.video && (
                    <video
                    controls
                    className="article-modal-video"
                >
            <source
                src={selectedArticle.video}
                type="video/webm"
            />

            A böngésződ nem támogatja a videó lejátszását.
                    </video>
                        )}

                        <p>{selectedArticle.content}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Articles;