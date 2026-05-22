// src/components/MapEditorPanel.jsx
import React, { useState, useEffect } from "react";
import { 
  Settings, Plus, Trash2, Link2, Save, Download, Upload, 
  RotateCcw, LogOut, MapPin, Activity, Check, X, Info, HelpCircle
} from "lucide-react";

export default function MapEditorPanel({
  mapType,
  setMapType,
  glbPaths,
  setGlbPaths,
  editorMode,
  setEditorMode,
  selectedNode,
  setSelectedNode,
  selectedEdge,
  setSelectedEdge,
  linkingStartNodeId,
  setLinkingStartNodeId,
  pendingClickCoords,
  setPendingClickCoords,
  onAddNode,
  onDeleteNode,
  onUpdateNode,
  onAddEdge,
  onDeleteEdge,
  onUpdateEdge,
  onSave,
  onReset,
  onClearAll,
  onClose,
  customNodes,
  customEdges
}) {
  // États locaux pour les formulaires
  const [nodeForm, setNodeForm] = useState({
    label: "",
    nomFR: "",
    nomAR: "",
    type: "room",
    floor: 0,
    zone: "A",
    code: "",
    color: "#00e676"
  });

  const [edgeForm, setEdgeForm] = useState({
    type: "walkway",
    distance: 1,
    pmr: true
  });

  const [newNodeForm, setNewNodeForm] = useState({
    label: "",
    nomFR: "",
    nomAR: "",
    type: "room",
    floor: 0,
    zone: "A",
    code: "",
    color: "#00e676",
    createOnAllFloors: false
  });

  const [localGlbPaths, setLocalGlbPaths] = useState({
    0: glbPaths[0] || "",
    1: glbPaths[1] || "",
    2: glbPaths[2] || ""
  });

  const isPassageNode = selectedNode && (selectedNode.type === "intersection" || selectedNode.id.startsWith("node_passage_"));
  const connectedEdges = selectedNode && customEdges ? customEdges.filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id) : [];
  const canReconnect = connectedEdges.length === 2;

  // Synchroniser l'état de saisie locale lorsque les propriétés parentes changent
  useEffect(() => {
    setLocalGlbPaths({
      0: glbPaths[0] || "",
      1: glbPaths[1] || "",
      2: glbPaths[2] || ""
    });
  }, [glbPaths]);

  const handleApplyPath = (floorId, value) => {
    const val = value.trim();
    // On met à jour le parent uniquement si le chemin est vide ou valide (.glb/.gltf)
    if (val === "" || val.toLowerCase().endsWith(".glb") || val.toLowerCase().endsWith(".gltf")) {
      setGlbPaths(prev => ({
        ...prev,
        [floorId]: val
      }));
    }
  };

  // Synchroniser le formulaire du nœud sélectionné
  useEffect(() => {
    if (selectedNode) {
      setNodeForm({
        label: selectedNode.label || "",
        nomFR: selectedNode.nomFR || "",
        nomAR: selectedNode.nomAR || "",
        type: selectedNode.type || "room",
        floor: selectedNode.floor ?? 0,
        zone: selectedNode.zone || "A",
        code: selectedNode.code || "",
        color: selectedNode.color || "#00e676"
      });
      setSelectedEdge(null);
    }
  }, [selectedNode]);

  // Synchroniser le formulaire de la liaison sélectionnée
  useEffect(() => {
    if (selectedEdge) {
      setEdgeForm({
        type: selectedEdge.type || "walkway",
        distance: selectedEdge.distance || 1,
        pmr: selectedEdge.pmr ?? true
      });
      setSelectedNode(null);
    }
  }, [selectedEdge]);

  // Détecter l'étage automatiquement en fonction de la coordonnée Y du clic
  useEffect(() => {
    if (pendingClickCoords && editorMode === "add_node") {
      const y = pendingClickCoords.y;
      let calculatedFloor = 0;
      if (y < 2) {
        calculatedFloor = 0;
      } else if (y >= 2 && y < 6) {
        calculatedFloor = 1;
      } else {
        calculatedFloor = 2;
      }
      setNewNodeForm(prev => ({
        ...prev,
        floor: calculatedFloor
      }));
    }
  }, [pendingClickCoords, editorMode]);

  const handleUpdateNodeSubmit = (e) => {
    e.preventDefault();
    if (!selectedNode) return;
    onUpdateNode(selectedNode.id, nodeForm);
  };

  const handleUpdateEdgeSubmit = (e) => {
    e.preventDefault();
    if (!selectedEdge) return;
    onUpdateEdge(selectedEdge.source, selectedEdge.target, edgeForm);
  };

  const handleCreateNodeSubmit = (e) => {
    e.preventDefault();
    if (!pendingClickCoords) return;
    onAddNode(pendingClickCoords, newNodeForm);
    setNewNodeForm({
      label: "",
      nomFR: "",
      nomAR: "",
      type: "room",
      floor: newNodeForm.floor, // Conserver l'étage en cours
      zone: "A",
      code: "",
      color: "#00e676",
      createOnAllFloors: false
    });
  };

  // Exporter la configuration complète en fichier JSON
  const handleExport = () => {
    const config = {
      mapType,
      glbPaths,
      nodes: customNodes,
      edges: customEdges
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "navigation_config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importer la configuration depuis un fichier JSON
  const handleImport = (e) => {
    const fileReader = new FileReader();
    if (e.target.files.length === 0) return;
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.nodes && parsed.edges) {
          if (parsed.mapType) setMapType(parsed.mapType);
          if (parsed.glbPaths) {
            setGlbPaths(parsed.glbPaths);
          } else if (parsed.glbPath) {
            // Rétrocompatibilité
            setGlbPaths({
              0: parsed.glbPath,
              1: "",
              2: ""
            });
          }
          onSave(parsed.nodes, parsed.edges);
          alert("Configuration importée avec succès !");
        } else {
          alert("Format de fichier invalide. Les champs 'nodes' et 'edges' sont obligatoires.");
        }
      } catch (err) {
        alert("Erreur lors de la lecture du fichier JSON.");
      }
    };
  };

  const colors = {
    room: "#00e676",
    elevator: "#d500f9",
    stairs: "#ff6d00",
    intersection: "#888888"
  };

  return (
    <div className="glass-panel" style={{
      width: "420px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      padding: "24px",
      boxSizing: "border-box",
      overflow: "hidden",
      fontFamily: "Plus Jakarta Sans, sans-serif"
    }}>
      {/* En-tête de l'éditeur */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", flexShrink: 0 }}>
        <Settings size={26} style={{ color: "#00f0ff" }} />
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>Éditeur de Carte 3D</h3>
          <span style={{ fontSize: "0.75rem", color: "#4f73a5" }}>Mode Configuration Mode Actif</span>
        </div>
        <button 
          onClick={onClose}
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

      {/* ZONE CENTRALE SCROLLABLE POUR LES FORMULAIRES */}
      <div className="editor-scroll-content" style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        paddingRight: "6px",
        paddingBottom: "30px",
        boxSizing: "border-box"
      }}>

      {/* 1. CHOIX DE LA SOURCE DE LA CARTE */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#00f0ff", textTransform: "uppercase" }}>Type de Maquette 3D</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setMapType("procedural")}
            className={`glass-button ${mapType === "procedural" ? "active" : ""}`}
            style={{ flex: 1, padding: "10px", fontSize: "0.85rem" }}
          >
            Procédurale (Hôpital)
          </button>
          <button
            onClick={() => setMapType("custom_glb")}
            className={`glass-button ${mapType === "custom_glb" ? "active" : ""}`}
            style={{ flex: 1, padding: "10px", fontSize: "0.85rem" }}
          >
            Modèle GLB (.gltf)
          </button>
        </div>

        {mapType === "custom_glb" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
            <span style={{ fontSize: "0.75rem", color: "#8da4c4", marginBottom: "2px" }}>
              Chemins relatifs des fichiers GLB par étage (placés dans le dossier public) :
            </span>
            
            {/* Rez-de-chaussée */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: "bold", color: "#00f0ff" }}>🏢 Rez-de-chaussée (RDC)</span>
                <span style={{ fontSize: "0.68rem", color: "#5c7c9c" }}>(Hauteur Y = 0)</span>
              </div>
              <input
                type="text"
                value={localGlbPaths[0] || ""}
                onChange={(e) => setLocalGlbPaths({ ...localGlbPaths, 0: e.target.value })}
                onBlur={(e) => handleApplyPath(0, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleApplyPath(0, e.target.value); }}
                placeholder="/map_test.glb"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Étage 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: "bold", color: "#e040fb" }}>🏢 1er Étage (R+1)</span>
                <span style={{ fontSize: "0.68rem", color: "#5c7c9c" }}>(Hauteur Y = 4)</span>
              </div>
              <input
                type="text"
                value={localGlbPaths[1] || ""}
                onChange={(e) => setLocalGlbPaths({ ...localGlbPaths, 1: e.target.value })}
                onBlur={(e) => handleApplyPath(1, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleApplyPath(1, e.target.value); }}
                placeholder="Ex: /etage1.glb (vide si maquette unique)"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Étage 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: "bold", color: "#00e676" }}>🏢 2e Étage (R+2)</span>
                <span style={{ fontSize: "0.68rem", color: "#5c7c9c" }}>(Hauteur Y = 8)</span>
              </div>
              <input
                type="text"
                value={localGlbPaths[2] || ""}
                onChange={(e) => setLocalGlbPaths({ ...localGlbPaths, 2: e.target.value })}
                onBlur={(e) => handleApplyPath(2, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleApplyPath(2, e.target.value); }}
                placeholder="Ex: /etage2.glb (vide si maquette unique)"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            <div style={{ 
              fontSize: "0.72rem", 
              color: "#8da4c4", 
              background: "rgba(0, 240, 255, 0.02)", 
              padding: "8px 12px", 
              borderRadius: "6px", 
              border: "1px dashed rgba(0, 240, 255, 0.15)",
              lineHeight: "1.4"
            }}>
              💡 <strong>Astuce</strong> : Appuyez sur <strong>Entrée</strong> ou cliquez à l'extérieur du champ pour valider et charger le modèle. Si vous utilisez une maquette unique globale, renseignez-la uniquement pour le RDC et laissez les autres étages vides.
            </div>
          </div>
        )}
      </div>

      {/* 2. SÉLECTION DU MODE D'ÉDITION INTERACTIVE */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#00f0ff", textTransform: "uppercase" }}>Outils d'édition 3D</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <button
            onClick={() => {
              setEditorMode("select");
              setSelectedNode(null);
              setSelectedEdge(null);
              setLinkingStartNodeId(null);
              setPendingClickCoords(null);
            }}
            className={`glass-button ${editorMode === "select" ? "active" : ""}`}
            style={{ padding: "10px", fontSize: "0.8rem", gap: "6px" }}
          >
            🔍 Sélection / Éditer
          </button>
          <button
            onClick={() => {
              setEditorMode("place_borne");
              setSelectedNode(null);
              setSelectedEdge(null);
              setLinkingStartNodeId(null);
              setPendingClickCoords(null);
            }}
            className={`glass-button ${editorMode === "place_borne" ? "active" : ""}`}
            style={{ padding: "10px", fontSize: "0.8rem", gap: "6px" }}
          >
            📌 Poser la Borne
          </button>
          <button
            onClick={() => {
              setEditorMode("add_node");
              setSelectedNode(null);
              setSelectedEdge(null);
              setLinkingStartNodeId(null);
              setPendingClickCoords(null);
            }}
            className={`glass-button ${editorMode === "add_node" ? "active" : ""}`}
            style={{ padding: "10px", fontSize: "0.8rem", gap: "6px" }}
          >
            ➕ Poser un Repère
          </button>
          <button
            onClick={() => {
              setEditorMode("link_nodes");
              setSelectedNode(null);
              setSelectedEdge(null);
              setLinkingStartNodeId(null);
              setPendingClickCoords(null);
            }}
            className={`glass-button ${editorMode === "link_nodes" ? "active" : ""}`}
            style={{ padding: "10px", fontSize: "0.8rem", gap: "6px" }}
          >
            🔗 Lier deux Repères
          </button>
        </div>
      </div>

      {/* ZONE INSTRUCTIONS / AIDE CONTEXTUELLE DÉCORATIVE */}
      <div style={{ 
        padding: "12px", 
        borderRadius: "10px", 
        background: "rgba(0, 240, 255, 0.03)", 
        border: "1px solid rgba(0, 240, 255, 0.1)",
        fontSize: "0.78rem",
        color: "#8da4c4",
        lineHeight: "1.4"
      }}>
        {editorMode === "select" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <Info size={16} style={{ color: "#00f0ff", flexShrink: 0, marginTop: "2px" }} />
            <span>Cliquez sur un marqueur 3D ou sur une ligne d'itinéraire pour afficher et modifier ses caractéristiques ci-dessous.</span>
          </div>
        )}
        {editorMode === "place_borne" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <MapPin size={16} style={{ color: "#ffcc00", flexShrink: 0, marginTop: "2px" }} />
            <span><strong>Borne Interactive</strong> : Cliquez n'importe où sur le sol de votre modèle 3D pour repositionner le point de départ virtuel de la borne.</span>
          </div>
        )}
        {editorMode === "add_node" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <Plus size={16} style={{ color: "#00ffb7", flexShrink: 0, marginTop: "2px" }} />
            <span>Cliquez sur le sol de la maquette 3D. Un marqueur temporaire rouge s'affichera et un formulaire d'enregistrement apparaîtra ci-dessous.</span>
          </div>
        )}
        {editorMode === "link_nodes" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <Link2 size={16} style={{ color: "#af52de", flexShrink: 0, marginTop: "2px" }} />
            {linkingStartNodeId ? (
              <span>Nœud de départ : <strong style={{ color: "#00f0ff" }}>{customNodes[linkingStartNodeId]?.label || linkingStartNodeId}</strong>. Cliquez sur un autre marqueur pour fermer la liaison, ou <strong>cliquez sur le sol</strong> pour tracer un point de passage intermédiaire afin de contourner un obstacle.</span>
            ) : (
              <span>Sélectionnez un premier marqueur 3D de départ, puis cliquez sur d'autres marqueurs ou <strong>cliquez sur le sol</strong> pour y tracer vos points de passage.</span>
            )}
          </div>
        )}
      </div>

      {/* 3. FORMULAIRES D'ÉDITION CONTEXTUELS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* A. CRÉATION D'UN NOUVEAU NŒUD APRÈS UN CLIC */}
        {editorMode === "add_node" && pendingClickCoords && (
          <form onSubmit={handleCreateNodeSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(0, 255, 183, 0.2)", background: "rgba(0, 255, 183, 0.02)", padding: "15px", borderRadius: "12px" }}>
            <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#00ffb7", display: "flex", alignItems: "center", gap: "6px" }}>
              <Plus size={16} /> Enregistrer le nouveau repère
            </h4>
            
            <div style={{ fontSize: "0.75rem", color: "#4f73a5" }}>
              Coordonnées 3D : X: {pendingClickCoords.x.toFixed(2)}, Y: {pendingClickCoords.y.toFixed(2)}, Z: {pendingClickCoords.z.toFixed(2)}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Identifiant unique (interne)</label>
              <input
                type="text"
                required
                value={newNodeForm.label}
                onChange={(e) => setNewNodeForm({ ...newNodeForm, label: e.target.value })}
                placeholder="Ex: Bureau_101"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Type de repère</label>
              <select
                value={newNodeForm.type}
                onChange={(e) => {
                  const type = e.target.value;
                  setNewNodeForm({ ...newNodeForm, type, color: colors[type] || "#00e676" });
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem"
                }}
              >
                <option value="room">Destination / Service (Chambre, Cabinet...)</option>
                <option value="intersection">Intersection / Couloir</option>
                <option value="elevator">Ascenseur</option>
                <option value="stairs">Escalier</option>
              </select>
            </div>

            {/* Option de duplication automatique sur tous les étages pour les ascenseurs/escaliers */}
            {["elevator", "stairs"].includes(newNodeForm.type) && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                padding: "10px", 
                borderRadius: "8px", 
                background: "rgba(0, 240, 255, 0.05)", 
                border: "1px solid rgba(0, 240, 255, 0.15)",
                marginTop: "4px" 
              }}>
                <input
                  type="checkbox"
                  id="createOnAllFloors"
                  checked={newNodeForm.createOnAllFloors || false}
                  onChange={(e) => setNewNodeForm({ ...newNodeForm, createOnAllFloors: e.target.checked })}
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                />
                <label 
                  htmlFor="createOnAllFloors" 
                  style={{ 
                    fontSize: "0.76rem", 
                    color: "#00f0ff", 
                    cursor: "pointer", 
                    userSelect: "none", 
                    fontWeight: "bold",
                    lineHeight: "1.3"
                  }}
                >
                  Dupliquer et lier sur tous les étages (RDC, R+1, R+2)
                </label>
              </div>
            )}

            {newNodeForm.type === "room" && (
              <>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                    <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Code destination</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={newNodeForm.code}
                      onChange={(e) => setNewNodeForm({ ...newNodeForm, code: e.target.value.toUpperCase() })}
                      placeholder="Ex: RAD"
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(0,0,0,0.3)",
                        color: "#ffffff",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                    <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Zone de couleur</label>
                    <select
                      value={newNodeForm.zone}
                      onChange={(e) => {
                        const zone = e.target.value;
                        const zoneColors = { A: "#ff3b30", B: "#007aff", C: "#af52de", D: "#34c759", E: "#ffcc00" };
                        setNewNodeForm({ ...newNodeForm, zone, color: zoneColors[zone] || "#00e676" });
                      }}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(0,0,0,0.3)",
                        color: "#ffffff",
                        fontSize: "0.85rem"
                      }}
                    >
                      <option value="A">Zone A (Rouge)</option>
                      <option value="B">Zone B (Bleue)</option>
                      <option value="C">Zone C (Violette)</option>
                      <option value="D">Zone D (Verte)</option>
                      <option value="E">Zone E (Jaune)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Nom en Français 🇫🇷</label>
              <input
                type="text"
                required
                value={newNodeForm.nomFR}
                onChange={(e) => setNewNodeForm({ ...newNodeForm, nomFR: e.target.value })}
                placeholder="Ex: Radiologie Dentaire"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Nom en Arabe 🇩🇿 (RTL)</label>
              <input
                type="text"
                required
                value={newNodeForm.nomAR}
                onChange={(e) => setNewNodeForm({ ...newNodeForm, nomAR: e.target.value })}
                placeholder="مثال: تصوير الأسنان بالأشعة"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  textAlign: "right",
                  direction: "rtl"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Étage associé</label>
              <select
                value={newNodeForm.floor}
                onChange={(e) => setNewNodeForm({ ...newNodeForm, floor: Number(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem"
                }}
              >
                <option value={0}>Rez-de-chaussée (RDC)</option>
                <option value={1}>1er Étage (R+1)</option>
                <option value={2}>2e Étage (R+2)</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button
                type="button"
                onClick={() => setPendingClickCoords(null)}
                className="glass-button"
                style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="glass-button active"
                style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}
              >
                Ajouter le Nœud
              </button>
            </div>
          </form>
        )}

        {/* B. ÉDITION / DETAILS D'UN NOEUD SÉLECTIONNÉ */}
        {editorMode === "select" && selectedNode && (
          isPassageNode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(0, 240, 255, 0.2)", background: "rgba(0, 240, 255, 0.02)", padding: "15px", borderRadius: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#00f0ff", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} /> Point de passage : {selectedNode.label}
              </h4>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#8da4c4", lineHeight: "1.4" }}>
                Ce repère est un point de passage intermédiaire servant à orienter les trajets (contournement d'obstacles).
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: "0.76rem", color: "#8da4c4", display: "flex", justifyContent: "space-between" }}>
                  <span>Étage associé :</span>
                  <strong style={{ color: "#ffffff" }}>{selectedNode.floor === 0 ? "RDC" : selectedNode.floor === 1 ? "1er Étage" : "2e Étage"}</strong>
                </div>
                <div style={{ fontSize: "0.76rem", color: "#8da4c4", display: "flex", justifyContent: "space-between" }}>
                  <span>Coordonnées 3D :</span>
                  <strong style={{ color: "#ffffff" }}>X: {selectedNode.x.toFixed(1)}, Y: {selectedNode.y.toFixed(1)}, Z: {selectedNode.z.toFixed(1)}</strong>
                </div>
                <div style={{ fontSize: "0.76rem", color: "#8da4c4", display: "flex", justifyContent: "space-between" }}>
                  <span>Liaisons connectées :</span>
                  <strong style={{ color: "#00f0ff" }}>{connectedEdges.length}</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "5px" }}>
                {canReconnect && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Supprimer ce point de passage et relier directement ses deux extrémités par un chemin direct ?")) {
                        onDeleteNode(selectedNode.id, true);
                        setSelectedNode(null);
                      }
                    }}
                    className="glass-button active"
                    style={{ 
                      padding: "10px", 
                      fontSize: "0.82rem", 
                      background: "linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(0, 150, 255, 0.2) 100%)",
                      borderColor: "#00f0ff",
                      color: "#ffffff",
                      justifyContent: "center",
                      fontWeight: "bold",
                      gap: "6px"
                    }}
                  >
                    🔗 Supprimer et reconnecter directement
                  </button>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Voulez-vous vraiment supprimer ce point de passage ? Les liaisons connectées seront également supprimées.")) {
                        onDeleteNode(selectedNode.id, false);
                        setSelectedNode(null);
                      }
                    }}
                    className="glass-button"
                    style={{ borderColor: "#ff3b30", color: "#ff6b60", flex: 1, padding: "8px", fontSize: "0.82rem", justifyContent: "center" }}
                  >
                    <Trash2 size={16} /> Supprimer uniquement
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="glass-button"
                    style={{ flex: 1, padding: "8px", fontSize: "0.82rem", justifyContent: "center" }}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateNodeSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(0, 240, 255, 0.2)", background: "rgba(0, 240, 255, 0.02)", padding: "15px", borderRadius: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#00f0ff", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} /> Configurer le Repère : {selectedNode.label}
              </h4>

              {selectedNode.id === "node_borne" ? (
                <div style={{
                  background: "rgba(255,204,0,0.1)",
                  border: "1px solid rgba(255,204,0,0.2)",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  color: "#ffcc00"
                }}>
                  ℹ️ La Borne Interactive est le point de départ fixe indispensable à l'application. Elle ne peut être supprimée ni renommée, mais vous pouvez repositionner ses coordonnées (x,y,z) en mode "Poser la Borne".
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Identifiant unique (Interne)</label>
                  <input
                    type="text"
                    required
                    value={nodeForm.label}
                    onChange={(e) => setNodeForm({ ...nodeForm, label: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.3)",
                      color: "#ffffff",
                      fontSize: "0.85rem"
                    }}
                  />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Type de repère</label>
                <select
                  disabled={selectedNode.id === "node_borne"}
                  value={nodeForm.type}
                  onChange={(e) => {
                    const type = e.target.value;
                    setNodeForm({ ...nodeForm, type, color: colors[type] || "#00e676" });
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.3)",
                    color: "#ffffff",
                    fontSize: "0.85rem"
                  }}
                >
                  <option value="room">Destination / Service (Chambre, Cabinet...)</option>
                  <option value="intersection">Intersection / Couloir</option>
                  <option value="elevator">Ascenseur</option>
                  <option value="stairs">Escalier</option>
                  <option value="borne">Borne interactive (Départ)</option>
                </select>
              </div>

              {nodeForm.type === "room" && (
                <>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                      <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Code destination</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={nodeForm.code}
                        onChange={(e) => setNodeForm({ ...nodeForm, code: e.target.value.toUpperCase() })}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(0,0,0,0.3)",
                          color: "#ffffff",
                          fontSize: "0.85rem"
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                      <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Zone de couleur</label>
                      <select
                        value={nodeForm.zone}
                        onChange={(e) => {
                          const zone = e.target.value;
                          const zoneColors = { A: "#ff3b30", B: "#007aff", C: "#af52de", D: "#34c759", E: "#ffcc00" };
                          setNodeForm({ ...nodeForm, zone, color: zoneColors[zone] || "#00e676" });
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(0,0,0,0.3)",
                          color: "#ffffff",
                          fontSize: "0.85rem"
                        }}
                      >
                        <option value="A">Zone A (Rouge)</option>
                        <option value="B">Zone B (Bleue)</option>
                        <option value="C">Zone C (Violette)</option>
                        <option value="D">Zone D (Verte)</option>
                        <option value="E">Zone E (Jaune)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Nom en Français 🇫🇷</label>
                <input
                  type="text"
                  required
                  value={nodeForm.nomFR}
                  onChange={(e) => setNodeForm({ ...nodeForm, nomFR: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.3)",
                    color: "#ffffff",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Nom en Arabe 🇩🇿 (RTL)</label>
                <input
                  type="text"
                  required
                  value={nodeForm.nomAR}
                  onChange={(e) => setNodeForm({ ...nodeForm, nomAR: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.3)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    textAlign: "right",
                    direction: "rtl"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Étage associé</label>
                <select
                  value={nodeForm.floor}
                  onChange={(e) => setNodeForm({ ...nodeForm, floor: Number(e.target.value) })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.3)",
                    color: "#ffffff",
                    fontSize: "0.85rem"
                  }}
                >
                  <option value={0}>Rez-de-chaussée (RDC)</option>
                  <option value={1}>1er Étage (R+1)</option>
                  <option value={2}>2e Étage (R+2)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                {selectedNode.id !== "node_borne" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Voulez-vous vraiment supprimer ce repère et toutes ses liaisons associées ?")) {
                        onDeleteNode(selectedNode.id, false);
                        setSelectedNode(null);
                      }
                    }}
                    className="glass-button"
                    style={{ borderColor: "#ff3b30", color: "#ff6b60" }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="glass-button active"
                  style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          )
        )}

        {/* C. ÉDITION D'UNE LIAISON (EDGE) SÉLECTIONNÉE */}
        {editorMode === "select" && selectedEdge && (
          <form onSubmit={handleUpdateEdgeSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(175, 82, 222, 0.2)", background: "rgba(175, 82, 222, 0.02)", padding: "15px", borderRadius: "12px" }}>
            <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#af52de", display: "flex", alignItems: "center", gap: "6px" }}>
              <Link2 size={16} /> Liaison de Cheminement
            </h4>

            <div style={{ fontSize: "0.8rem", color: "#8da4c4" }}>
              Relie : <strong style={{ color: "#ffffff" }}>{customNodes[selectedEdge.source]?.label}</strong><br/>
              à : <strong style={{ color: "#ffffff" }}>{customNodes[selectedEdge.target]?.label}</strong>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Distance (en mètres)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={edgeForm.distance}
                onChange={(e) => setEdgeForm({ ...edgeForm, distance: Number(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Type de liaison</label>
              <select
                value={edgeForm.type}
                onChange={(e) => setEdgeForm({ ...edgeForm, type: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: "0.85rem"
                }}
              >
                <option value="walkway">Cheminement à pied / Rampe</option>
                <option value="elevator">Ascenseur vertical</option>
                <option value="stairs">Escaliers</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "5px 0" }}>
              <input
                type="checkbox"
                id="pmrCheck"
                checked={edgeForm.pmr}
                onChange={(e) => setEdgeForm({ ...edgeForm, pmr: e.target.checked })}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label htmlFor="pmrCheck" style={{ fontSize: "0.82rem", color: "#ffffff", cursor: "pointer", fontWeight: "600" }}>
                Accessible aux PMR (fauteuils roulants)
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Voulez-vous vraiment supprimer cette liaison ?")) {
                    onDeleteEdge(selectedEdge.source, selectedEdge.target);
                    setSelectedEdge(null);
                  }
                }}
                className="glass-button"
                style={{ borderColor: "#ff3b30", color: "#ff6b60" }}
              >
                <Trash2 size={16} />
              </button>
              <button
                type="submit"
                className="glass-button active"
                style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}
              >
                Enregistrer la liaison
              </button>
            </div>
          </form>
        )}

        {/* SI RIEN N'EST SELECTIONNE ET PAS DE POSAGE DE NOEUD */}
        {!selectedNode && !selectedEdge && (!pendingClickCoords || editorMode !== "add_node") && (
          <div style={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            textAlign: "center", 
            color: "#4f73a5",
            padding: "20px",
            boxSizing: "border-box",
            border: "1px dashed rgba(255,255,255,0.05)",
            borderRadius: "14px"
          }}>
            <HelpCircle size={36} style={{ color: "#4f73a5", marginBottom: "12px" }} />
            <h5 style={{ margin: "0 0 5px 0", color: "#ffffff", fontSize: "0.95rem", fontWeight: "600" }}>Aucun élément sélectionné</h5>
            <span style={{ fontSize: "0.78rem" }}>
              {editorMode === "select" && "Sélectionnez un outil ci-dessus ou cliquez sur un élément de la carte pour commencer."}
              {editorMode === "place_borne" && "Cliquez sur le sol de la carte 3D pour placer le point d'accueil."}
              {editorMode === "add_node" && "Cliquez sur le sol de la carte pour poser un nouveau repère."}
              {editorMode === "link_nodes" && "Cliquez successivement sur deux nœuds pour tracer un lien."}
            </span>
          </div>
        )}

      </div>
    </div>

    {/* 4. ACTIONS DE GESTION DE CONFIGURATION (BAS DE PAGE FIXE) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "15px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onSave(customNodes, customEdges)}
            className="glass-button active"
            style={{ flex: 1, padding: "10px 15px", fontSize: "0.82rem", background: "linear-gradient(135deg, #0066ff, #00f0ff)", border: "none" }}
          >
            <Save size={16} /> Sauvegarder
          </button>
          <button
            onClick={onReset}
            className="glass-button"
            style={{ padding: "10px", fontSize: "0.82rem" }}
            title="Réinitialiser par défaut"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="glass-button"
            style={{ padding: "10px", fontSize: "0.82rem", borderColor: "rgba(255, 59, 48, 0.4)", color: "#ff6b60" }}
            title="Tout effacer"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleExport}
            className="glass-button"
            style={{ flex: 1, padding: "8px", fontSize: "0.78rem" }}
          >
            <Download size={14} /> Exporter JSON
          </button>
          
          <label className="glass-button" style={{ flex: 1, padding: "8px", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Upload size={14} /> Importer JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
