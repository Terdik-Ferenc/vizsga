import React, { useState, useEffect } from "react";
import { getComments, addComment } from "../services/api.js";
import "../styles/Kommentek.css";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  // --- LAPOZÁS STATE ÉS BEÁLLÍTÁSOK ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Kommentek betöltése
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await getComments();
      setComments(data);
    } catch (err) {
      console.error("Hiba a kommentek lekérésekor:", err);
    }
  };
    // Komment beküldése
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment("");
      setError("");
      loadComments();  // Lista frissítése
    } catch (err) {
      setError("Hiba történt a komment küldése során. Be vagy jelentkezve?");
    }
  };

  // --- LAPOZÁS LOGIKA ---
  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = comments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="page">
      <div className="inner-border">
        <h2 className="komment-focim">Kommentek</h2>

        {/* Komment írása űrlap */}
        <form className="form-class" onSubmit={handleSubmit}>
          <textarea
            className="textarea-class"
            rows="3"
            placeholder="Írj egy kommentet..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn-class" type="submit">
            Küldés
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        {/* Kommentek listázása (csak az aktuális oldal elemei) */}
        <div>
          {currentComments.map((comment) => (
            <div className="comments-class" key={comment.id}>
              <strong>🙋‍♂️ {comment.username}</strong>{" "}
              <small >
                ({new Date(comment.letrehozva).toLocaleString()})
              </small>
              <p >
                {comment.tartalom}
              </p>
            </div>
          ))}
        </div>

        {/* --- LAPOZÓ GOMBOK --- */}
        {totalPages > 1 && (
          <div className="lapozo">
            <button className="btn-lapozo"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              {"<<<"}
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button className="btn-lapozo"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              {">>>"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}