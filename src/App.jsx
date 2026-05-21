// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Compass, Accessibility, Clock, MapPin, RefreshCw, 
  X, Shield, PhoneCall, HelpCircle, Activity, ChevronRight, ChevronLeft, Laptop
} from "lucide-react";
import HospitalMap3D from "./components/HospitalMap3D";
import VirtualKeyboard from "./components/VirtualKeyboard";
import AdminPanel from "./components/AdminPanel";
import { destinations, floors, calculateRoute } from "./data/navigationData";
import { translations } from "./data/translations";

export default function App() {
  // États de l'application
  const [lang, setLang] = useState("FR"); // "FR" ou "AR"
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [isolatedMode, setIsolatedMode] = useState(false);
  const [pmrMode, setPmrMode] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAttractMode, setIsAttractMode] = useState(true);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // États de pannes / maintenance (modifiant le graphe de navigation)
  const [isElevatorBroken, setIsElevatorBroken] = useState(false);
  const [isStairsBroken, setIsStairsBroken] = useState(false);

  // Raccourcis fréquents
  const [frequentDestinations, setFrequentDestinations] = useState([]);

  // Référence pour le timer d'inactivité
  const inactivityTimerRef = useRef(null);

  // Charger les traductions courantes
  const t = translations[lang];
  const isRtl = t.dir === "rtl";

  // Réinitialiser le timer d'inactivité sur n'importe quelle interaction
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Si on est en veille, n'importe quelle interaction réveille l'écran
    if (isAttractMode) return;

    inactivityTimerRef.current = setTimeout(() => {
      handleGoToSleep();
    }, 60000); // 60 secondes d'inactivité -> Veille
  };

  const handleWakeUp = () => {
    setIsAttractMode(false);
    resetInactivityTimer();
  };

  const handleGoToSleep = () => {
    setIsAttractMode(true);
    handleClearSearch();
    setSelectedDestination(null);
    setActiveRoute(null);
    setSelectedFloor(0);
    setIsolatedMode(false);
    setPmrMode(false);
    setIsKeyboardOpen(false);
    setIsPanelCollapsed(false);
  };

  // Écouter les clics sur l'écran pour réinitialiser le timer d'inactivité
  useEffect(() => {
    window.addEventListener("click", resetInactivityTimer);
    window.addEventListener("touchstart", resetInactivityTimer);

    // Initialiser les raccourcis fréquents
    const popularIds = ["urgences", "imagerie", "laboratoire", "maternite", "pediatrie", "cardiologie"];
    const popular = destinations.filter(d => popularIds.includes(d.id));
    setFrequentDestinations(popular);

    resetInactivityTimer();

    return () => {
      window.removeEventListener("click", resetInactivityTimer);
      window.removeEventListener("touchstart", resetInactivityTimer);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isAttractMode]);

  // Recalculer l'itinéraire lorsque la destination, le mode PMR ou l'état de panne change
  useEffect(() => {
    if (selectedDestination) {
      const route = calculateRoute(
        "node_borne",
        selectedDestination.nodeId,
        pmrMode,
        isElevatorBroken,
        isStairsBroken
      );
      setActiveRoute(route);
      
      // Mettre à jour l'étage sélectionné sur la carte pour correspondre à l'étage de la destination
      setSelectedFloor(selectedDestination.floor);
    } else {
      setActiveRoute(null);
    }
  }, [selectedDestination, pmrMode, isElevatorBroken, isStairsBroken]);

  // Gérer la recherche de destination en temps réel
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const cleanQuery = query.toLowerCase().trim();

    // Recherche par nom, code, aliases, ou description
    const results = destinations.filter(dest => {
      const nom = lang === "FR" ? dest.nomFR : dest.nomAR;
      const desc = lang === "FR" ? dest.descFR : dest.descAR;
      const aliases = lang === "FR" ? dest.aliasesFR : dest.aliasesAR;
      
      return (
        nom.toLowerCase().includes(cleanQuery) ||
        dest.code.toLowerCase().includes(cleanQuery) ||
        desc.toLowerCase().includes(cleanQuery) ||
        aliases.some(alias => alias.toLowerCase().includes(cleanQuery))
      );
    });

    setSearchResults(results);
  };

  const handleSelectDestination = (dest) => {
    setSelectedDestination(dest);
    setSearchQuery(lang === "FR" ? dest.nomFR : dest.nomAR);
    setSearchResults([]);
    setIsKeyboardOpen(false);
    setIsPanelCollapsed(false); // Ouvrir le panneau s'il était rétracté
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedDestination(null);
    setActiveRoute(null);
  };

  return (
    <div className={`app-container ${isRtl ? "rtl-layout" : ""}`}>
      
      {/* ========================================================================= */}
      {/* 1. ÉCRAN DE VEILLE (ATTRACT LOOP)                                         */}
      {/* ========================================================================= */}
      {isAttractMode && (
        <div 
          onClick={handleWakeUp}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000,
            background: "radial-gradient(circle at 50% 50%, #0d1e3f 0%, #03060c 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            animation: "fadeIn 0.5s ease-out",
            textAlign: "center",
            padding: "40px"
          }}
        >
          {/* Logo Saldae glowing */}
          <div style={{
            width: "180px",
            height: "180px",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.4)",
            padding: "24px",
            boxSizing: "border-box",
            animation: "pulseGlow 3s infinite ease-in-out"
          }}>
            <img src="/logo_saldae.png" alt="Logo Saldae" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>

          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            margin: "0 0 10px 0",
            background: "linear-gradient(135deg, #ffffff 0%, #a5c3e8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px"
          }}>
            {lang === "FR" ? "HÔPITAL SALDAE" : "مستشفى سالداي"}
          </h1>
          
          <h2 style={{
            fontSize: "2rem",
            fontWeight: "600",
            color: "#00f0ff",
            margin: "0 0 20px 0",
            textShadow: "0 0 15px rgba(0, 240, 255, 0.4)"
          }}>
            {t.attractTitle}
          </h2>
          
          <p style={{
            fontSize: "1.2rem",
            color: "#6e8cb5",
            maxWidth: "600px",
            margin: "0 0 60px 0"
          }}>
            {t.attractSubtitle}
          </p>

          {/* Bouton de démarrage clignotant */}
          <div className="glass-panel glass-panel-neon" style={{
            padding: "24px 60px",
            borderRadius: "50px",
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#ffffff",
            background: "linear-gradient(135deg, rgba(0, 102, 255, 0.3), rgba(0, 240, 255, 0.3))",
            boxShadow: "0 0 30px rgba(0, 240, 255, 0.2)",
            animation: "pulseGlow 2s infinite",
            display: "flex",
            alignItems: "center",
            gap: "20px"
          }}>
            <span>{t.touchToStart}</span>
          </div>

          {/* Sélecteur de langue d'attente */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              marginTop: "80px",
              display: "flex",
              gap: "20px",
              pointerEvents: "auto"
            }}
          >
            <button 
              onClick={() => setLang("FR")}
              className={`glass-button ${lang === "FR" ? "active" : ""}`}
              style={{ padding: "12px 30px", borderRadius: "30px", fontSize: "1.1rem" }}
            >
              🇫🇷 Français
            </button>
            <button 
              onClick={() => setLang("AR")}
              className={`glass-button ${lang === "AR" ? "active" : ""}`}
              style={{ padding: "12px 30px", borderRadius: "30px", fontSize: "1.1rem" }}
            >
              🇩🇿 العربية
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ESPACE 3D PRINCIPAL (CONSTITUE L'ARRIÈRE-PLAN DYNAMIQUE)               */}
      {/* ========================================================================= */}
      <div className="map-viewport">
        <HospitalMap3D 
          activeRoute={activeRoute}
          selectedFloor={selectedFloor}
          isolatedMode={isolatedMode}
          onSelectDestination={handleSelectDestination}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERFACE DE COMMANDE DE LA BORNE (SUPERPOSÉE EN HUD)                  */}
      {/* ========================================================================= */}
      <div className="ui-overlay">
        
        {/* BARRE SUPÉRIEURE : EN-TÊTE & ACCESSIBILITÉ */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          width: "100%"
        }}>
          {/* Logo cliquable secrètement pour l'administration */}
          <div 
            className="glass-panel interactive-element" 
            onDoubleClick={() => setIsAdminOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 20px",
              borderRadius: "50px",
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            <img src="/logo_saldae.png" alt="Logo" style={{ height: "30px", objectFit: "contain" }} />
            <div style={{
              [isRtl ? "borderRight" : "borderLeft"]: "1px solid rgba(255, 255, 255, 0.15)",
              [isRtl ? "paddingRight" : "paddingLeft"]: "12px",
              height: "28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: isRtl ? "right" : "left"
            }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800", color: "#ffffff", letterSpacing: "0.5px", lineHeight: "1.1" }}>
                {lang === "FR" ? "SALDAE" : "سالداي"}
              </h3>
              <span style={{ fontSize: "0.65rem", color: "#4f73a5", fontWeight: "600", letterSpacing: "0.5px" }}>WAYFINDING 3D</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }} className="interactive-element">
            {/* Bouton PMR */}
            <button
              onClick={() => setPmrMode(!pmrMode)}
              className={`glass-button ${pmrMode ? "active" : ""}`}
              style={{
                borderRadius: "50px",
                padding: "10px 24px",
                borderColor: pmrMode ? "#ffcc00" : "rgba(255,255,255,0.08)",
                color: pmrMode ? "#ffcc00" : "#ffffff",
                boxShadow: pmrMode ? "0 0 15px rgba(255,204,0,0.2)" : "none"
              }}
            >
              <Accessibility size={20} />
              <span>{pmrMode ? t.pmrActive : t.pmrInactive}</span>
            </button>

            {/* Sélecteur de Langue Rapide */}
            <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.2)", padding: "5px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                onClick={() => setLang("FR")}
                className={`glass-button ${lang === "FR" ? "active" : ""}`}
                style={{ padding: "8px 20px", borderRadius: "40px", fontSize: "0.85rem", border: "none" }}
              >
                FR
              </button>
              <button
                onClick={() => setLang("AR")}
                className={`glass-button ${lang === "AR" ? "active" : ""}`}
                style={{ padding: "8px 20px", borderRadius: "40px", fontSize: "0.85rem", border: "none" }}
              >
                عربي
              </button>
            </div>
          </div>
        </div>

        {/* ALERTE DE PANNE TECHNIQUE ACTIVE (SI DÉCLARÉE PAR L'ADMIN) */}
        {(isElevatorBroken || isStairsBroken) && (
          <div className="glass-panel interactive-element" style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255, 140, 0, 0.15)",
            border: "1px solid rgba(255, 140, 0, 0.3)",
            padding: "12px 24px",
            borderRadius: "12px",
            marginBottom: "20px",
            alignSelf: "flex-start",
            color: "#ffa500",
            fontSize: "0.85rem",
            fontWeight: "600",
            animation: "pulseGlow 3s infinite"
          }}>
            <Activity size={18} />
            <span>
              {lang === "FR" 
                ? `Maintenance en cours : ${isElevatorBroken ? "Ascenseur en panne" : ""} ${isElevatorBroken && isStairsBroken ? "et" : ""} ${isStairsBroken ? "Escalier en panne" : ""}. Les trajets sont adaptés.`
                : `صيانة جارية: ${isElevatorBroken ? "المصعد معطل" : ""} ${isElevatorBroken && isStairsBroken ? "و" : ""} ${isStairsBroken ? "السلم معطل" : ""}. تم تعديل المسارات.`
              }
            </span>
          </div>
        )}

        {/* PANNEAU LATÉRAL (SPLIT-SCREEN INTERACTIF) */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flex: 1,
          width: "100%",
          pointerEvents: "none"
        }}>
          
          {/* ENVELOPPE DU PANNEAU DE NAVIGATION (Gère la translation et l'overflow visible de la languette) */}
          <div className="interactive-element" style={{
            width: "420px",
            maxHeight: "85%",
            alignSelf: "stretch",
            position: "relative",
            transform: isPanelCollapsed 
              ? (isRtl ? "translateX(calc(100% + 30px))" : "translateX(calc(-100% - 30px))") 
              : "translateX(0)",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "auto",
            zIndex: 10
          }}>
            {/* LE PANNEAU EFFECTIF (Contenu avec verre flouté et défilement autonome) */}
            <div className="glass-panel" style={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxSizing: "border-box"
            }}>
            {/* 1. BLOC DE RECHERCHE DE DESTINATION */}
            <div>
              <div style={{ display: "flex", position: "relative" }}>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsKeyboardOpen(true)}
                  style={{
                    width: "100%",
                    padding: "16px 45px 16px 20px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.3)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    fontFamily: "inherit",
                    textAlign: isRtl ? "right" : "left"
                  }}
                />
                <Search size={20} style={{
                  position: "absolute",
                  top: "18px",
                  [isRtl ? "left" : "right"]: "20px",
                  color: "#4f73a5"
                }} />
                {searchQuery && (
                  <button 
                    onClick={handleClearSearch}
                    style={{
                      position: "absolute",
                      top: "18px",
                      [isRtl ? "right" : "left"]: "-40px",
                      background: "transparent",
                      border: "none",
                      color: "#ff3b30",
                      cursor: "pointer"
                    }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Résultats de recherche instantanés */}
              {searchResults.length > 0 && (
                <div style={{
                  background: "rgba(10, 18, 36, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  marginTop: "10px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}>
                  {searchResults.map(dest => (
                    <div
                      key={dest.id}
                      onClick={() => handleSelectDestination(dest)}
                      style={{
                        padding: "15px 20px",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(0,240,255,0.08)"}
                      onMouseLeave={(e) => e.target.style.background = "transparent"}
                    >
                      <div>
                        <strong style={{ color: "#ffffff", display: "block" }}>
                          {lang === "FR" ? dest.nomFR : dest.nomAR}
                        </strong>
                        <span style={{ fontSize: "0.75rem", color: "#4f73a5" }}>
                          {t.floor} {dest.floor} • Aile {dest.zone}
                        </span>
                      </div>
                      <ChevronRight size={18} style={{ color: "#00f0ff" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. ÉCRAN D'ACCUEIL : RACCOURCIS ET RECHERCHES FRÉQUENTES */}
            {!selectedDestination ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#00f0ff", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {t.frequentSearches}
                </h4>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}>
                  {frequentDestinations.map(dest => {
                    const name = lang === "FR" ? dest.nomFR : dest.nomAR;
                    return (
                      <button
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest)}
                        className="glass-button"
                        style={{
                          height: "90px",
                          borderRadius: "16px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          fontSize: "0.85rem",
                          gap: "8px",
                          border: "1px solid rgba(255,255,255,0.04)"
                        }}
                      >
                        <MapPin size={22} style={{ color: dest.color }} />
                        <span style={{ fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                          {name.split(" (")[0]} {/* Tronquer les parenthèses trop longues */}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{
                  marginTop: "auto",
                  padding: "15px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  fontSize: "0.8rem",
                  color: "#4f73a5",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <HelpCircle size={20} style={{ color: "#00f0ff" }} />
                  <span>{t.searchHelp}</span>
                </div>
              </div>
            ) : (
              /* 3. ÉCRAN DE NAVIGATION DE LA DESTINATION ACTIVE */
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Entête Fiche Destination */}
                <div style={{
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  paddingBottom: "15px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{
                      background: selectedDestination.color,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      padding: "3px 8px",
                      borderRadius: "6px"
                    }}>
                      {selectedDestination.code}
                    </span>
                    <button 
                      onClick={handleClearSearch}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "none",
                        color: "#8da4c4",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "800", margin: "10px 0 5px 0" }}>
                    {lang === "FR" ? selectedDestination.nomFR : selectedDestination.nomAR}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#8da4c4" }}>
                    {lang === "FR" ? selectedDestination.descFR : selectedDestination.descAR}
                  </p>
                </div>

                {/* Résumé de l'Itinéraire (Distance / Temps) */}
                {activeRoute && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    background: "rgba(0, 240, 255, 0.05)",
                    border: "1px solid rgba(0, 240, 255, 0.15)",
                    borderRadius: "14px",
                    padding: "15px"
                  }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#4f73a5", display: "block" }}>{t.distance}</span>
                      <strong style={{ fontSize: "1.1rem", color: "#00f0ff" }}>
                        {activeRoute.totalDistance} {t.meters}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#4f73a5", display: "block" }}>{t.duration}</span>
                      <strong style={{ fontSize: "1.1rem", color: "#00f0ff" }}>
                        {Math.ceil(activeRoute.totalDistance / 60)} {t.minutes}
                      </strong>
                    </div>
                  </div>
                )}

                {/* Liste des instructions étape par étape */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", fontWeight: "700", color: "#00f0ff", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {t.navigationSteps}
                  </h4>
                  <div style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: "12px",
                    padding: "15px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}>
                    {activeRoute && (lang === "FR" ? activeRoute.instructionsFR : activeRoute.instructionsAR).map((step, idx) => (
                      <div key={idx} style={{ 
                        display: "flex", 
                        alignItems: "flex-start", 
                        gap: "10px",
                        fontSize: "0.85rem",
                        lineHeight: "1.4"
                      }}>
                        <div style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#00f0ff",
                          marginTop: "6px",
                          flexShrink: 0
                        }} />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Handoff mobile (QR Code simulé pour la V1.1) */}
                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px"
                }}>
                  {/* Simulateur de QR code vectoriel SVG */}
                  <div style={{
                    width: "80px",
                    height: "80px",
                    background: "#ffffff",
                    borderRadius: "8px",
                    padding: "5px",
                    boxSizing: "border-box",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <svg viewBox="0 0 29 29" style={{ width: "100%", height: "100%" }}>
                      {/* Motif de QR code factice hautement esthétique */}
                      <path d="M0 0h7v7H0zm1 1v5h5V1zm22-1h6v6h-6zm1 1v4h4V1zM0 22h7v7H0zm1 1v5h5V23zm13-22h2v2h-2zm4 0h2v2h-2zm-4 4h2v2h-2zm2 2h2v2h-2zm5 1h1v1h-1zm-7 4h2v2h-2zm3 0h1v1h-1zm2 1h1v1h-1zm-6 2h1v1h-1zm2 1h2v2h-2zm6-2h2v2h-2zm-8 4h2v2h-2zm4 0h2v2h-2zm3 1h1v1h-1zm1 1h1v1h-1zm2 1h1v1h-1z" fill="#000000" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#ffffff", display: "block" }}>
                      {t.qrcodeHandoff}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#8da4c4" }}>
                      {t.scanQr}
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Bouton de rétractation (Languette tactile design fixée à l'extérieur du panneau, rendue en dernier pour être au-dessus du scroll) */}
          <button
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            className="glass-button interactive-element"
            style={{
              position: "absolute",
              top: "50%",
              [isRtl ? "left" : "right"]: "-46px",
              transform: "translateY(-50%)",
              width: "46px",
              height: "80px",
              borderRadius: isRtl ? "16px 0 0 16px" : "0 16px 16px 0",
              borderLeft: isRtl ? "1px solid rgba(255,255,255,0.08)" : "none",
              borderRight: isRtl ? "none" : "1px solid rgba(255,255,255,0.08)",
              background: "rgba(10, 18, 36, 0.9)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              boxShadow: isRtl 
                ? "-5px 0 15px rgba(0, 0, 0, 0.3)" 
                : "5px 0 15px rgba(0, 0, 0, 0.3)",
              color: "#00f0ff",
              zIndex: 50
            }}
          >
            {isPanelCollapsed ? (
              isRtl ? <ChevronLeft size={24} /> : <ChevronRight size={24} />
            ) : (
              isRtl ? <ChevronRight size={24} /> : <ChevronLeft size={24} />
            )}
          </button>
        </div>

          {/* ========================================================================= */}
          {/* CONTROLE INTERACTIF DE LA CARTE 3D (BOUTONS SUSPENDUS SUR LA DROITE)      */}
          {/* ========================================================================= */}
          <div className="interactive-element" style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignSelf: "flex-end"
          }}>
            {/* Switch Mode Éclaté / Isolation */}
            <button
              onClick={() => setIsolatedMode(!isolatedMode)}
              className={`glass-button ${isolatedMode ? "active" : ""}`}
              style={{
                borderRadius: "50px",
                padding: "12px 24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}
            >
              <span>{isolatedMode ? t.floorIsolation : t.allFloors}</span>
            </button>

            {/* Sélecteur d'Étage Vertical Tactile */}
            <div className="glass-panel" style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px",
              borderRadius: "20px",
              gap: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}>
              {floors.slice().reverse().map(floor => (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloor(floor.id)}
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "15px",
                    border: "1px solid " + (selectedFloor === floor.id ? "#00f0ff" : "rgba(255,255,255,0.05)"),
                    background: selectedFloor === floor.id ? "rgba(0, 240, 255, 0.15)" : "rgba(255,255,255,0.03)",
                    color: selectedFloor === floor.id ? "#00f0ff" : "#ffffff",
                    fontSize: "1rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {floor.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PIED DE PAGE : COPYRIGHT & CONTACTS                                       */}
        {/* ========================================================================= */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          width: "100%",
          fontSize: "0.8rem",
          color: "#4f73a5"
        }}>
          <span>© 2026 Hôpital Saldae. Solution interactive tactile.</span>
          <div style={{ display: "flex", gap: "20px" }} className="interactive-element">
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <PhoneCall size={12} />
              Urgences 24h/24 : <strong>021-0000</strong>
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. CLAVIER VIRTUEL TACTILE DESCENT GLOBAL                                 */}
      {/* ========================================================================= */}
      {isKeyboardOpen && (
        <div className="keyboard-drawer">
          <VirtualKeyboard
            value={searchQuery}
            onChange={handleSearchChange}
            onSearch={() => setIsKeyboardOpen(false)}
            lang={lang}
            onClose={() => setIsKeyboardOpen(false)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PANNEAU DE MAINTENANCE ET D'ADMINISTRATION SÉCURISÉ                     */}
      {/* ========================================================================= */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isElevatorBroken={isElevatorBroken}
        setIsElevatorBroken={setIsElevatorBroken}
        isStairsBroken={isStairsBroken}
        setIsStairsBroken={setIsStairsBroken}
        t={t}
      />

    </div>
  );
}
