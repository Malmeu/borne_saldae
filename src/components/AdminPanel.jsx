// src/components/AdminPanel.jsx
import React, { useState } from "react";
import { Shield, Settings, X, Power, AlertTriangle, BarChart3, Lock } from "lucide-react";

export default function AdminPanel({ isOpen, onClose, isElevatorBroken, setIsElevatorBroken, isStairsBroken, setIsStairsBroken, t }) {
  const [code, setCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const CORRECT_CODE = "2026"; // Code d'accès administrateur par défaut

  const handleLogin = (e) => {
    e.preventDefault();
    if (code === CORRECT_CODE) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError(t.adminWrongCode);
      setCode("");
    }
  };

  const handleKeypadPress = (num) => {
    if (code.length < 4) {
      setCode(code + num);
    }
  };

  const handleKeypadClear = () => {
    setCode("");
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(3, 8, 20, 0.95)",
      backdropFilter: "blur(30px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      color: "#ffffff"
    }}>
      {/* Bouton de fermeture */}
      <button 
        onClick={() => {
          setIsAuthenticated(false);
          setCode("");
          onClose();
        }}
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
      >
        <X size={24} />
      </button>

      {!isAuthenticated ? (
        /* ÉCRAN D'AUTHENTIFICATION (PAVÉ NUMÉRIQUE TACTILE) */
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(0, 240, 255, 0.15)",
          borderRadius: "24px",
          padding: "40px",
          width: "380px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        }}>
          <Lock size={44} style={{ color: "#00f0ff", marginBottom: "15px" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px", color: "#ffffff" }}>
            {t.adminTitle}
          </h2>
          <p style={{ color: "#4f73a5", fontSize: "0.9rem", marginBottom: "25px" }}>
            {t.adminCode}
          </p>

          {/* Affichage du code en cours de saisie */}
          <div style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            letterSpacing: "15px",
            color: "#00f0ff",
            fontWeight: "700",
            marginBottom: "15px"
          }}>
            {"•".repeat(code.length) + " ".repeat(4 - code.length)}
          </div>

          {error && (
            <p style={{ color: "#ff3b30", fontSize: "0.85rem", marginBottom: "15px", fontWeight: "600" }}>
              {error}
            </p>
          )}

          {/* Pavé Numérique Tactile */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "20px"
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleKeypadPress(num.toString())}
                style={{
                  height: "65px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#ffffff",
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleKeypadClear}
              style={{
                height: "65px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 59, 48, 0.2)",
                background: "rgba(255, 59, 48, 0.05)",
                color: "#ff3b30",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              C
            </button>
            <button
              onClick={() => handleKeypadPress("0")}
              style={{
                height: "65px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontSize: "1.4rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              0
            </button>
            <button
              onClick={(e) => handleLogin(e)}
              style={{
                height: "65px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #0066ff, #00f0ff)",
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              OK
            </button>
          </div>
          <span style={{ fontSize: "0.8rem", color: "#4f73a5" }}>Code par défaut : 2026</span>
        </div>
      ) : (
        /* PANNEAU D'ADMINISTRATION PRINCIPAL */
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(0, 240, 255, 0.15)",
          borderRadius: "24px",
          padding: "40px",
          width: "700px",
          maxWidth: "90%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
            <Shield size={36} style={{ color: "#00f0ff" }} />
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0 }}>Console d'Administration</h2>
              <span style={{ color: "#4f73a5", fontSize: "0.85rem" }}>Borne Interactive Orientation Hôpital - V1.0.0</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "35px" }}>
            {/* Colonne 1 : Configuration Réseau & Pannes matérielles */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#00f0ff", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Settings size={18} />
                {t.adminStatusTitle}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Switch Ascenseur */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px" }}>
                  <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "10px" }}>
                    {t.adminElevatorStatus}
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => setIsElevatorBroken(false)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid " + (!isElevatorBroken ? "#00aa77" : "rgba(255,255,255,0.1)"),
                        background: !isElevatorBroken ? "rgba(0, 170, 119, 0.15)" : "transparent",
                        color: !isElevatorBroken ? "#00ffb7" : "#888888",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      {t.statusAvailable}
                    </button>
                    <button
                      onClick={() => setIsElevatorBroken(true)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid " + (isElevatorBroken ? "#ff3b30" : "rgba(255,255,255,0.1)"),
                        background: isElevatorBroken ? "rgba(255, 59, 48, 0.15)" : "transparent",
                        color: isElevatorBroken ? "#ff6b60" : "#888888",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      {t.statusUnavailable}
                    </button>
                  </div>
                </div>

                {/* Switch Escalier */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px" }}>
                  <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "10px" }}>
                    {t.adminStairsStatus}
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => setIsStairsBroken(false)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid " + (!isStairsBroken ? "#00aa77" : "rgba(255,255,255,0.1)"),
                        background: !isStairsBroken ? "rgba(0, 170, 119, 0.15)" : "transparent",
                        color: !isStairsBroken ? "#00ffb7" : "#888888",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      {t.statusAvailable}
                    </button>
                    <button
                      onClick={() => setIsStairsBroken(true)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid " + (isStairsBroken ? "#ff3b30" : "rgba(255,255,255,0.1)"),
                        background: isStairsBroken ? "rgba(255, 59, 48, 0.15)" : "transparent",
                        color: isStairsBroken ? "#ff6b60" : "#888888",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      {t.statusUnavailable}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 : Statistiques et Monitoring d'utilisation simulés */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#00f0ff", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChart3 size={18} />
                Analytiques de la Borne (Simulés)
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#4f73a5" }}>Recherches les plus fréquentes :</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    <span style={{ background: "rgba(0,240,255,0.1)", color: "#00f0ff", fontSize: "0.75rem", padding: "4px 8px", borderRadius: "12px" }}>Urgences (42%)</span>
                    <span style={{ background: "rgba(0,240,255,0.1)", color: "#00f0ff", fontSize: "0.75rem", padding: "4px 8px", borderRadius: "12px" }}>Radiologie (28%)</span>
                    <span style={{ background: "rgba(0,240,255,0.1)", color: "#00f0ff", fontSize: "0.75rem", padding: "4px 8px", borderRadius: "12px" }}>Maternité (18%)</span>
                  </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#4f73a5" }}>Langues sélectionnées :</span>
                  <div style={{ display: "flex", gap: "20px", marginTop: "6px", fontSize: "0.9rem" }}>
                    <div>🇫🇷 Français : <strong style={{ color: "#00f0ff" }}>64%</strong></div>
                    <div>🇩🇿 Arabe : <strong style={{ color: "#00f0ff" }}>36%</strong></div>
                  </div>
                </div>

                <div style={{ marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#4f73a5" }}>Taux d'utilisation du mode PMR :</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#00ffb7", marginTop: "4px" }}>12.4%</div>
                </div>
              </div>

              {/* Message d'avertissement dynamique */}
              {(isElevatorBroken || isStairsBroken) && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255, 85, 0, 0.1)",
                  border: "1px solid rgba(255, 85, 0, 0.3)",
                  padding: "12px",
                  borderRadius: "10px",
                  marginTop: "15px",
                  color: "#ff8844",
                  fontSize: "0.85rem"
                }}>
                  <AlertTriangle size={20} />
                  <span>
                    Attention : Le graphe de navigation a été mis à jour. Les itinéraires recalculés éviteront les éléments déclarés fermés ou en panne.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setCode("");
                onClose();
              }}
              style={{
                padding: "12px 30px",
                borderRadius: "30px",
                border: "none",
                background: "linear-gradient(135deg, #0066ff, #00f0ff)",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0, 102, 255, 0.3)"
              }}
            >
              {t.adminSave}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
