// src/components/VirtualKeyboard.jsx
import React, { useState } from "react";
import { Delete, CornerDownLeft, Globe } from "lucide-react";

export default function VirtualKeyboard({ value, onChange, onSearch, lang = "FR", onClose }) {
  const [isArabic, setIsArabic] = useState(lang === "AR");

  // Disposition AZERTY Français
  const azertyRows = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["W", "X", "C", "V", "B", "N", "'", "-", "SPACE"]
  ];

  // Disposition Clavier Arabe (Simplifié pour la recherche tactile)
  const arabicRows = [
    ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
    ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ئ"],
    ["ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "ذ", "SPACE"]
  ];

  const handleKeyPress = (key) => {
    if (key === "SPACE") {
      onChange(value + " ");
    } else {
      onChange(value + key);
    }
  };

  const handleBackspace = () => {
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    onChange("");
  };

  const currentRows = isArabic ? arabicRows : azertyRows;

  return (
    <div className="virtual-keyboard-container" style={{
      direction: "ltr", // Forcer LTR pour le conteneur du clavier pour la disposition uniforme
      background: "rgba(10, 18, 36, 0.95)",
      border: "1px solid rgba(0, 240, 255, 0.2)",
      backdropFilter: "blur(20px)",
      padding: "20px",
      borderRadius: "24px",
      width: "90%",
      maxWidth: "800px",
      boxSizing: "border-box",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
      animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
    }}>
      {/* Barre d'outils du clavier */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
        gap: "10px"
      }}>
        {/* Bouton de changement de langue de saisie */}
        <button 
          onClick={() => setIsArabic(!isArabic)}
          style={{
            background: "rgba(0, 240, 255, 0.1)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            color: "#00f0ff",
            padding: "8px 16px",
            borderRadius: "30px",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            transition: "all 0.2s ease"
          }}
        >
          <Globe size={16} />
          {isArabic ? "Clavier Français" : "لوحة المفاتيح العربية"}
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Touche Tout Effacer */}
          <button
            onClick={handleClear}
            style={{
              background: "rgba(255, 59, 48, 0.1)",
              border: "1px solid rgba(255, 59, 48, 0.3)",
              color: "#ff3b30",
              padding: "8px 16px",
              borderRadius: "30px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Plus Jakarta Sans, sans-serif"
            }}
          >
            {isArabic ? "مسح الكل" : "Effacer"}
          </button>
          
          {/* Fermer */}
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "30px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Plus Jakarta Sans, sans-serif"
            }}
          >
            {isArabic ? "إغلاق" : "Fermer"}
          </button>
        </div>
      </div>

      {/* Grille des Touches */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {currentRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "nowrap"
          }}>
            {row.map((key) => {
              const isSpace = key === "SPACE";
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  style={{
                    flex: isSpace ? 4 : 1,
                    maxWidth: isSpace ? "400px" : "70px",
                    height: "55px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: isSpace ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
                    color: "#ffffff",
                    fontSize: isArabic ? "1.3rem" : "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.1s active, background 0.2s",
                    fontFamily: isArabic ? "inherit" : "Plus Jakarta Sans, sans-serif"
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = "scale(0.95)";
                    e.target.style.background = "rgba(0, 240, 255, 0.25)";
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.background = isSpace ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.05)";
                  }}
                >
                  {isSpace ? (isArabic ? "مسافة" : "ESPACE") : key}
                </button>
              );
            })}

            {/* Ajouter le retour arrière à la dernière ligne */}
            {rowIndex === currentRows.length - 1 && (
              <>
                <button
                  onClick={handleBackspace}
                  style={{
                    flex: 1.2,
                    maxWidth: "85px",
                    height: "55px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.1s active"
                  }}
                  onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
                  onMouseUp={(e) => e.target.style.transform = "scale(1)"}
                >
                  <Delete size={22} />
                </button>
                <button
                  onClick={onSearch}
                  style={{
                    flex: 1.5,
                    maxWidth: "100px",
                    height: "55px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #0066ff, #00f0ff)",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    transition: "transform 0.1s active"
                  }}
                  onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
                  onMouseUp={(e) => e.target.style.transform = "scale(1)"}
                >
                  <CornerDownLeft size={20} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
