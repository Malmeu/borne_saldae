// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Compass, Accessibility, Clock, MapPin, RefreshCw, 
  X, Shield, PhoneCall, HelpCircle, Activity, ChevronRight, ChevronLeft, Laptop
} from "lucide-react";
import HospitalMap3D from "./components/HospitalMap3D";
import VirtualKeyboard from "./components/VirtualKeyboard";
import AdminPanel from "./components/AdminPanel";
import MapEditorPanel from "./components/MapEditorPanel";
import { destinations, floors, calculateRoute, nodes, edges } from "./data/navigationData";
import { translations } from "./data/translations";

export default function App() {
  // États de l'application
  const [lang, setLang] = useState("FR"); // "FR" ou "AR"
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [isolatedMode, setIsIsolatedMode] = useState(false);
  const [pmrMode, setPmrMode] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAttractMode, setIsAttractMode] = useState(true);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // États de pannes / maintenance (modifiant le graphe de navigation)
  const [isElevatorBroken, setIsElevatorBroken] = useState(false);
  const [isStairsBroken, setIsStairsBroken] = useState(false);

  // --- ÉTATS DYNAMIQUES DE L'ÉDITEUR DE CARTE & PERSISTANCE ---
  const [mapType, setMapType] = useState(() => {
    return localStorage.getItem("saldae_map_type") || "procedural";
  });
  const [glbPaths, setGlbPaths] = useState(() => {
    const stored = localStorage.getItem("saldae_glb_paths");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    // Rétrocompatibilité : si l'ancien format unique existe, on le migre au RDC
    const oldPath = localStorage.getItem("saldae_glb_path");
    return {
      0: oldPath || "/map_test.glb",
      1: "",
      2: ""
    };
  });
  const [customNodes, setCustomNodes] = useState(() => {
    const stored = localStorage.getItem("saldae_custom_nodes");
    return stored ? JSON.parse(stored) : nodes;
  });
  const [customEdges, setCustomEdges] = useState(() => {
    const stored = localStorage.getItem("saldae_custom_edges");
    return stored ? JSON.parse(stored) : edges;
  });
  const [customDestinations, setCustomDestinations] = useState(() => {
    const stored = localStorage.getItem("saldae_custom_destinations");
    return stored ? JSON.parse(stored) : destinations;
  });

  // États opérationnels du mode édition
  const [isEditMode, setIsEditMode] = useState(false);
  const [editorMode, setEditorMode] = useState("select");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [linkingStartNodeId, setLinkingStartNodeId] = useState(null);
  const [pendingClickCoords, setPendingClickCoords] = useState(null);

  const selectedNode = selectedNodeId ? customNodes[selectedNodeId] : null;

  // Raccourcis fréquents dynamiques
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
    setImmersiveMode(false);
    setIsolatedMode(false);
    setPmrMode(false);
    setIsKeyboardOpen(false);
    setIsPanelCollapsed(false);
  };

  // Écouter les clics sur l'écran pour réinitialiser le timer d'inactivité
  useEffect(() => {
    window.addEventListener("click", resetInactivityTimer);
    window.addEventListener("touchstart", resetInactivityTimer);
    resetInactivityTimer();

    return () => {
      window.removeEventListener("click", resetInactivityTimer);
      window.removeEventListener("touchstart", resetInactivityTimer);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isAttractMode]);

  // Mettre à jour les destinations populaires à partir de customDestinations
  useEffect(() => {
    const popularIds = ["urgences", "imagerie", "laboratoire", "maternite", "pediatrie", "cardiologie"];
    const popular = customDestinations.filter(d => popularIds.includes(d.id));
    setFrequentDestinations(popular.length > 0 ? popular : customDestinations.slice(0, 6));
  }, [customDestinations]);

  // Recalculer l'itinéraire lorsque la destination, le mode PMR, l'état de panne ou le graphe de navigation change
  useEffect(() => {
    setImmersiveMode(false);
    if (selectedDestination) {
      const route = calculateRoute(
        "node_borne",
        selectedDestination.nodeId,
        pmrMode,
        isElevatorBroken,
        isStairsBroken,
        customNodes,
        customEdges,
        customDestinations
      );
      setActiveRoute(route);
      
      // Mettre à jour l'étage sélectionné sur la carte pour correspondre à l'étage de la destination
      setSelectedFloor(selectedDestination.floor);
    } else {
      setActiveRoute(null);
    }
  }, [selectedDestination, pmrMode, isElevatorBroken, isStairsBroken, customNodes, customEdges, customDestinations]);

  // --- ACTIONS DE GESTION DE GRAPHE POUR L'ÉDITEUR ---
  const handleAddNode = (coords, form) => {
    const baseId = form.label.toLowerCase().replace(/\s+/g, "_") || Date.now();
    
    // Si c'est un ascenseur ou un escalier et que l'option multi-étages est activée
    if (["elevator", "stairs"].includes(form.type) && form.createOnAllFloors) {
      const newNodes = {};
      const floorSuffixes = { 0: "rdc", 1: "r1", 2: "r2" };
      const floorLabelsFR = { 0: " (RDC)", 1: " (R+1)", 2: " (R+2)" };
      const floorLabelsAR = { 0: " (الطابق الأرضي)", 1: " (الطابق 1)", 2: " (الطابق 2)" };
      
      // 1. Créer les nœuds pour chaque étage (0, 1, 2)
      floors.forEach(floor => {
        const fId = floor.id;
        const nodeId = `node_${baseId}_${floorSuffixes[fId] || `f${fId}`}`;
        
        newNodes[nodeId] = {
          id: nodeId,
          label: `${form.label} ${floor.label}`,
          nomFR: `${form.nomFR}${floorLabelsFR[fId] || ` (Niveau ${fId})`}`,
          nomAR: `${form.nomAR}${floorLabelsAR[fId] || ` (الطابق ${fId})`}`,
          x: coords.x,
          y: floor.height, // Utiliser la hauteur Y exacte de cet étage
          z: coords.z,
          floor: fId,
          type: form.type,
          zone: form.zone,
          code: form.code,
          color: form.color
        };
      });

      // Mettre à jour customNodes
      const updatedNodes = { ...customNodes, ...newNodes };
      setCustomNodes(updatedNodes);

      // 2. Créer automatiquement les liaisons verticales
      const newEdges = [];
      const nodeRdcId = `node_${baseId}_rdc`;
      const nodeR1Id = `node_${baseId}_r1`;
      const nodeR2Id = `node_${baseId}_r2`;

      // Liaison RDC <-> R+1
      newEdges.push({
        source: nodeRdcId,
        target: nodeR1Id,
        distance: 4, // Hauteur R1 (4) - RDC (0)
        pmr: form.type === "elevator",
        type: form.type
      });

      // Liaison R+1 <-> R+2
      newEdges.push({
        source: nodeR1Id,
        target: nodeR2Id,
        distance: 4, // Hauteur R2 (8) - R1 (4)
        pmr: form.type === "elevator",
        type: form.type
      });

      // S'assurer de ne pas créer de doublons dans les liaisons
      const filteredCustomEdges = customEdges.filter(edge => {
        const isMatch1 = (edge.source === nodeRdcId && edge.target === nodeR1Id) || (edge.source === nodeR1Id && edge.target === nodeRdcId);
        const isMatch2 = (edge.source === nodeR1Id && edge.target === nodeR2Id) || (edge.source === nodeR2Id && edge.target === nodeR1Id);
        return !isMatch1 && !isMatch2;
      });

      setCustomEdges([...filteredCustomEdges, ...newEdges]);
      
    } else {
      // Comportement standard : création d'un nœud unique
      const nodeId = `node_${baseId}`;
      
      const newNode = {
        id: nodeId,
        label: form.label,
        nomFR: form.nomFR,
        nomAR: form.nomAR,
        x: coords.x,
        y: coords.y,
        z: coords.z,
        floor: form.floor,
        type: form.type,
        zone: form.zone,
        code: form.code,
        color: form.color
      };

      const updatedNodes = { ...customNodes, [nodeId]: newNode };
      setCustomNodes(updatedNodes);

      let updatedDestinations = [...customDestinations];
      if (form.type === "room") {
        const newDest = {
          id: baseId,
          code: form.code || "DEST",
          nomFR: form.nomFR,
          nomAR: form.nomAR,
          aliasesFR: [form.nomFR.toLowerCase()],
          aliasesAR: [form.nomAR],
          type: "service",
          floor: form.floor,
          zone: form.zone,
          color: form.color,
          nodeId: nodeId,
          accessible: true,
          descFR: `Service ${form.nomFR} situé au niveau ${form.floor}.`,
          descAR: `خدمة ${form.nomAR} تقع في الطابق ${form.floor}.`
        };
        updatedDestinations.push(newDest);
        setCustomDestinations(updatedDestinations);
      }
    }

    setPendingClickCoords(null);
  };

  const handleUpdateNode = (id, form) => {
    const oldNode = customNodes[id];
    if (!oldNode) return;

    const updatedNode = {
      ...oldNode,
      label: form.label,
      nomFR: form.nomFR,
      nomAR: form.nomAR,
      type: form.type,
      floor: form.floor,
      zone: form.zone,
      code: form.code,
      color: form.color
    };

    const updatedNodes = { ...customNodes, [id]: updatedNode };
    setCustomNodes(updatedNodes);

    let updatedDestinations = [...customDestinations];
    const destIndex = updatedDestinations.findIndex(d => d.nodeId === id);

    if (form.type === "room") {
      const destData = {
        id: destIndex !== -1 ? updatedDestinations[destIndex].id : form.label.toLowerCase().replace(/\s+/g, "_"),
        code: form.code || "DEST",
        nomFR: form.nomFR,
        nomAR: form.nomAR,
        aliasesFR: [form.nomFR.toLowerCase()],
        aliasesAR: [form.nomAR],
        type: "service",
        floor: form.floor,
        zone: form.zone,
        color: form.color,
        nodeId: id,
        accessible: true,
        descFR: `Service ${form.nomFR} situé au niveau ${form.floor}.`,
        descAR: `خدمة ${form.nomAR} تقع في الطابق ${form.floor}.`
      };

      if (destIndex !== -1) {
        updatedDestinations[destIndex] = destData;
      } else {
        updatedDestinations.push(destData);
      }
    } else if (destIndex !== -1) {
      updatedDestinations.splice(destIndex, 1);
    }
    setCustomDestinations(updatedDestinations);
    
    if (selectedDestination && selectedDestination.nodeId === id) {
      const newSelectedDest = updatedDestinations.find(d => d.nodeId === id);
      setSelectedDestination(newSelectedDest || null);
    }
  };

  const handleDeleteNode = (id, reconnect = false) => {
    if (id === "node_borne") {
      alert("La borne interactive ne peut pas être supprimée.");
      return;
    }

    // Trouver les liaisons connectées à ce nœud avant de les supprimer
    const connectedEdges = customEdges.filter(edge => edge.source === id || edge.target === id);

    const updatedNodes = { ...customNodes };
    delete updatedNodes[id];
    setCustomNodes(updatedNodes);

    let updatedEdges = customEdges.filter(edge => edge.source !== id && edge.target !== id);

    // Si on demande la reconnexion et qu'il y a exactement deux liaisons connectées
    if (reconnect && connectedEdges.length === 2) {
      const neighborA = connectedEdges[0].source === id ? connectedEdges[0].target : connectedEdges[0].source;
      const neighborB = connectedEdges[1].source === id ? connectedEdges[1].target : connectedEdges[1].source;

      if (neighborA !== neighborB) {
        const nodeA = customNodes[neighborA];
        const nodeB = customNodes[neighborB];
        if (nodeA && nodeB) {
          const distance = Number(Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) +
            Math.pow(nodeA.y - nodeB.y, 2) +
            Math.pow(nodeA.z - nodeB.z, 2)
          ).toFixed(1));

          // Vérifier si une liaison existe déjà
          const edgeExists = updatedEdges.some(edge => 
            (edge.source === neighborA && edge.target === neighborB) ||
            (edge.source === neighborB && edge.target === neighborA)
          );

          if (!edgeExists) {
            const newEdge = {
              source: neighborA,
              target: neighborB,
              distance: distance > 0 ? distance : 1,
              pmr: true,
              type: "walkway"
            };
            updatedEdges.push(newEdge);
          }
        }
      }
    }

    setCustomEdges(updatedEdges);

    const updatedDestinations = customDestinations.filter(d => d.nodeId !== id);
    setCustomDestinations(updatedDestinations);

    if (selectedNodeId === id) setSelectedNodeId(null);
    if (selectedDestination && selectedDestination.nodeId === id) setSelectedDestination(null);
  };

  const handleAddEdge = (sourceId, targetId) => {
    if (sourceId === targetId) return;

    const exists = customEdges.some(edge => 
      (edge.source === sourceId && edge.target === targetId) ||
      (edge.source === targetId && edge.target === sourceId)
    );
    if (exists) {
      alert("Une liaison existe déjà entre ces deux repères.");
      return;
    }

    const nodeA = customNodes[sourceId];
    const nodeB = customNodes[targetId];
    if (!nodeA || !nodeB) return;

    const distance = Number(Math.sqrt(
      Math.pow(nodeA.x - nodeB.x, 2) +
      Math.pow(nodeA.y - nodeB.y, 2) +
      Math.pow(nodeA.z - nodeB.z, 2)
    ).toFixed(1));

    const newEdge = {
      source: sourceId,
      target: targetId,
      distance: distance > 0 ? distance : 1,
      pmr: true,
      type: "walkway"
    };

    setCustomEdges([...customEdges, newEdge]);
  };

  const handleUpdateEdge = (sourceId, targetId, form) => {
    const updatedEdges = customEdges.map(edge => {
      const isMatch = (edge.source === sourceId && edge.target === targetId) ||
                      (edge.source === targetId && edge.target === sourceId);
      if (isMatch) {
        return {
          ...edge,
          type: form.type,
          distance: form.distance,
          pmr: form.pmr
        };
      }
      return edge;
    });
    setCustomEdges(updatedEdges);
  };

  const handleDeleteEdge = (sourceId, targetId) => {
    const updatedEdges = customEdges.filter(edge => {
      const isMatch = (edge.source === sourceId && edge.target === targetId) ||
                      (edge.source === targetId && edge.target === sourceId);
      return !isMatch;
    });
    setCustomEdges(updatedEdges);
    if (selectedEdge && 
        ((selectedEdge.source === sourceId && selectedEdge.target === targetId) ||
         (selectedEdge.source === targetId && selectedEdge.target === sourceId))) {
      setSelectedEdge(null);
    }
  };

  const handleSave = (nodesToSave, edgesToSave) => {
    localStorage.setItem("saldae_map_type", mapType);
    localStorage.setItem("saldae_glb_paths", JSON.stringify(glbPaths));
    // Rétrocompatibilité descendante
    localStorage.setItem("saldae_glb_path", glbPaths[0] || "");
    localStorage.setItem("saldae_custom_nodes", JSON.stringify(nodesToSave));
    localStorage.setItem("saldae_custom_edges", JSON.stringify(edgesToSave));
    localStorage.setItem("saldae_custom_destinations", JSON.stringify(customDestinations));
    
    setCustomNodes(nodesToSave);
    setCustomEdges(edgesToSave);
    
    alert("Configuration de la carte sauvegardée localement avec succès !");
  };

  const handleReset = () => {
    if (confirm("Voulez-vous vraiment restaurer la carte et les liaisons par défaut de l'Hôpital Saldae ? Toutes vos modifications locales seront perdues.")) {
      localStorage.removeItem("saldae_map_type");
      localStorage.removeItem("saldae_glb_path");
      localStorage.removeItem("saldae_glb_paths");
      localStorage.removeItem("saldae_custom_nodes");
      localStorage.removeItem("saldae_custom_edges");
      localStorage.removeItem("saldae_custom_destinations");

      setMapType("procedural");
      setGlbPaths({
        0: "/map_test.glb",
        1: "",
        2: ""
      });
      setCustomNodes(nodes);
      setCustomEdges(edges);
      setCustomDestinations(destinations);

      setSelectedNodeId(null);
      setSelectedEdge(null);
      setLinkingStartNodeId(null);
      setPendingClickCoords(null);
      setSelectedDestination(null);
      
      alert("Restauration des valeurs d'origine effectuée.");
    }
  };

  const handleClearAll = () => {
    if (confirm("⚠️ Voulez-vous vraiment TOUT effacer ? Cette action supprimera tous les repères et toutes les liaisons personnalisés à l'exception de la borne interactive d'accueil.")) {
      const defaultBorne = {
        id: "node_borne",
        label: "Borne Interactive",
        nomFR: "Accueil / Vous êtes ici",
        nomAR: "الاستقبال / أنت هنا",
        x: 0,
        y: 0,
        z: 0,
        floor: 0,
        type: "borne",
        zone: "A",
        color: "#ffcc00"
      };
      setCustomNodes({ "node_borne": defaultBorne });
      setCustomEdges([]);
      setCustomDestinations([]);

      setSelectedNodeId(null);
      setSelectedEdge(null);
      setLinkingStartNodeId(null);
      setPendingClickCoords(null);
      setSelectedDestination(null);
      setActiveRoute(null);
      
      alert("La carte a été entièrement vidée. N'oubliez pas de cliquer sur Sauvegarder pour enregistrer ce changement.");
    }
  };

  const handleMapClick = (point) => {
    if (!isEditMode) return;

    if (editorMode === "place_borne") {
      const oldBorne = customNodes["node_borne"];
      const updatedNodes = {
        ...customNodes,
        "node_borne": {
          ...oldBorne,
          x: Number(point.x.toFixed(2)),
          y: Number(point.y.toFixed(2)),
          z: Number(point.z.toFixed(2))
        }
      };

      const updatedEdges = customEdges.map(edge => {
        if (edge.source === "node_borne" || edge.target === "node_borne") {
          const otherId = edge.source === "node_borne" ? edge.target : edge.source;
          const otherNode = customNodes[otherId];
          if (otherNode) {
            const dist = Number(Math.sqrt(
              Math.pow(point.x - otherNode.x, 2) +
              Math.pow(point.y - otherNode.y, 2) +
              Math.pow(point.z - otherNode.z, 2)
            ).toFixed(1));
            return { ...edge, distance: dist > 0 ? dist : 1 };
          }
        }
        return edge;
      });

      setCustomNodes(updatedNodes);
      setCustomEdges(updatedEdges);
      alert("Position de la borne mise à jour avec succès ! Les distances des liaisons connectées ont été recalculées.");
    } else if (editorMode === "add_node") {
      setPendingClickCoords({
        x: Number(point.x.toFixed(2)),
        y: Number(point.y.toFixed(2)),
        z: Number(point.z.toFixed(2))
      });
    } else if (editorMode === "link_nodes") {
      if (linkingStartNodeId) {
        const startNode = customNodes[linkingStartNodeId];
        if (!startNode) return;

        // Créer un point de passage intermédiaire automatique à l'étage du nœud de départ
        const passageId = `node_passage_${Date.now()}`;
        const newPassageNode = {
          id: passageId,
          label: `Passage_${Math.floor(Math.random() * 900) + 100}`,
          nomFR: "Point de passage",
          nomAR: "ممر",
          x: Number(point.x.toFixed(2)),
          y: Number(point.y.toFixed(2)),
          z: Number(point.z.toFixed(2)),
          floor: startNode.floor, // Conserve le même étage que le point de départ
          type: "intersection",  // Intersection / Point de passage (invisible pour la recherche générale)
          zone: startNode.zone || "A",
          color: "#888888"
        };

        // Calculer la distance Euclidienne 3D
        const distance = Number(Math.sqrt(
          Math.pow(startNode.x - newPassageNode.x, 2) +
          Math.pow(startNode.y - newPassageNode.y, 2) +
          Math.pow(startNode.z - newPassageNode.z, 2)
        ).toFixed(1));

        const newEdge = {
          source: linkingStartNodeId,
          target: passageId,
          distance: distance > 0 ? distance : 1,
          pmr: true,
          type: "walkway"
        };

        // Mettre à jour l'état des nœuds et des liaisons
        const updatedNodes = { ...customNodes, [passageId]: newPassageNode };
        setCustomNodes(updatedNodes);
        setCustomEdges([...customEdges, newEdge]);

        // Déplacer automatiquement le point de départ de la liaison sur ce nouveau nœud pour le clic suivant
        setLinkingStartNodeId(passageId);
      }
    }
  };

  // Gérer la recherche de destination en temps réel
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const cleanQuery = query.toLowerCase().trim();

    // Recherche par nom, code, aliases, ou description sur les destinations personnalisées
    const results = customDestinations.filter(dest => {
      const nom = lang === "FR" ? dest.nomFR : dest.nomAR;
      const desc = lang === "FR" ? (dest.descFR || "") : (dest.descAR || "");
      const aliases = lang === "FR" ? (dest.aliasesFR || []) : (dest.aliasesAR || []);
      
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
    setImmersiveMode(false);
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
          setSelectedFloor={setSelectedFloor}
          isolatedMode={isolatedMode}
          onSelectDestination={handleSelectDestination}
          mapType={mapType}
          glbPaths={glbPaths}
          isEditMode={isEditMode}
          editorMode={editorMode}
          customNodes={customNodes}
          customEdges={customEdges}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          selectedEdge={selectedEdge}
          setSelectedEdge={setSelectedEdge}
          linkingStartNodeId={linkingStartNodeId}
          setLinkingStartNodeId={setLinkingStartNodeId}
          pendingClickCoords={pendingClickCoords}
          setPendingClickCoords={setPendingClickCoords}
          onMapClick={handleMapClick}
          onAddEdge={handleAddEdge}
          immersiveMode={immersiveMode}
          setImmersiveMode={setImmersiveMode}
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
          
          {isEditMode ? (
            /* ENVELOPPE DU PANNEAU DE L'ÉDITEUR */
            <div className="interactive-element" style={{
              width: "420px",
              height: "78vh",
              position: "relative",
              pointerEvents: "auto",
              zIndex: 10
            }}>
              <MapEditorPanel
                mapType={mapType}
                setMapType={setMapType}
                glbPaths={glbPaths}
                setGlbPaths={setGlbPaths}
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                selectedNode={selectedNode}
                setSelectedNode={(n) => setSelectedNodeId(n ? n.id : null)}
                selectedEdge={selectedEdge}
                setSelectedEdge={setSelectedEdge}
                linkingStartNodeId={linkingStartNodeId}
                setLinkingStartNodeId={setLinkingStartNodeId}
                pendingClickCoords={pendingClickCoords}
                setPendingClickCoords={setPendingClickCoords}
                onAddNode={handleAddNode}
                onDeleteNode={handleDeleteNode}
                onUpdateNode={handleUpdateNode}
                onAddEdge={handleAddEdge}
                onDeleteEdge={handleDeleteEdge}
                onUpdateEdge={handleUpdateEdge}
                onSave={handleSave}
                onReset={handleReset}
                onClearAll={handleClearAll}
                onClose={() => setIsEditMode(false)}
                customNodes={customNodes}
                customEdges={customEdges}
              />
            </div>
          ) : (
            /* ENVELOPPE DU PANNEAU DE NAVIGATION CLASSIQUE (Gère la translation et l'overflow visible de la languette) */
            <div className="interactive-element" style={{
              width: "420px",
              height: "78vh",
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
                overflowX: "hidden",
                boxSizing: "border-box"
              }}>
                <div style={{
                  padding: "25px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  boxSizing: "border-box",
                  width: "100%",
                  minHeight: "100%"
                }}>
              {/* 1. BLOC DE RECHERCHE DE DESTINATION */}
              <div>
                <div style={{ display: "flex", position: "relative", width: "100%" }}>
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setIsKeyboardOpen(true)}
                    style={{
                      width: "100%",
                      padding: isRtl ? "16px 20px 16px 80px" : "16px 80px 16px 20px",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.3)",
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      outline: "none",
                      fontFamily: "inherit",
                      textAlign: isRtl ? "right" : "left",
                      boxSizing: "border-box"
                    }}
                  />
                  <Search size={20} style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    [isRtl ? "left" : "right"]: "20px",
                    color: "#4f73a5",
                    pointerEvents: "none"
                  }} />
                  {searchQuery && (
                    <button 
                      onClick={handleClearSearch}
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        [isRtl ? "left" : "right"]: "48px",
                        background: "transparent",
                        border: "none",
                        color: "#ff3b30",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px"
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
                    overflowX: "hidden",
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
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
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

                  {/* Bouton de Visite Immersive 3D */}
                  {activeRoute && (
                    <button
                      onClick={() => setImmersiveMode(!immersiveMode)}
                      className="interactive-element"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: immersiveMode 
                          ? "linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 85, 255, 0.3))" 
                          : "linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(0, 85, 255, 0.12))",
                        border: "1px solid rgba(0, 240, 255, 0.3)",
                        boxShadow: immersiveMode 
                          ? "0 0 15px rgba(0, 240, 255, 0.25), inset 0 0 8px rgba(0, 240, 255, 0.2)" 
                          : "0 4px 15px rgba(0, 0, 0, 0.2)",
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textShadow: "0 10px 20px rgba(0,0,0,0.5)",
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        marginTop: "8px",
                        marginBottom: "12px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(0, 85, 255, 0.25))";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 12px rgba(0, 240, 255, 0.25)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = immersiveMode 
                          ? "linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 85, 255, 0.3))" 
                          : "linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(0, 85, 255, 0.12))";
                        e.currentTarget.style.boxShadow = immersiveMode 
                          ? "0 0 15px rgba(0, 240, 255, 0.25), inset 0 0 8px rgba(0, 240, 255, 0.2)" 
                          : "0 4px 15px rgba(0, 0, 0, 0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{immersiveMode ? "🛑" : "🚶"}</span>
                      <span>{immersiveMode ? (lang === "FR" ? "Quitter la Visite 3D" : "إنهاء الجولة الافتراضية") : t.immersiveVisit}</span>
                    </button>
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
                      overflowX: "hidden",
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
          )}

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
        onActivateEditor={() => {
          setIsEditMode(true);
          setIsAdminOpen(false);
        }}
      />

    </div>
  );
}
