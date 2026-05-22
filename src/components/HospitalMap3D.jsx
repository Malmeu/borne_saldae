// src/components/HospitalMap3D.jsx
import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { floors, nodes } from "../data/navigationData";

// Vérifier si un chemin est valide avant de le passer au chargeur Three.js
const isValidGlbPath = (path) => {
  if (!path) return false;
  const p = path.trim().toLowerCase();
  return p.endsWith(".glb") || p.endsWith(".gltf");
};

// Données géométriques des cloisons et murs procéduraux
const proceduralWalls = [
  // ==========================================
  // --- REZ-DE-CHAUSSÉE (Niveau 0) ---
  // ==========================================
  // Murs extérieurs (Bleu technologique)
  { floor: 0, x: 0, z: -13, w: 26, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 0, x: 0, z: 13, w: 26, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 0, x: -13, z: 0, w: 0.15, h: 1.8, d: 26, color: "#0055ff" },
  { floor: 0, x: 13, z: 0, w: 0.15, h: 1.8, d: 26, color: "#0055ff" },
  
  // Cloisons zone Urgences (Rouge)
  { floor: 0, x: -6, z: -3, w: 0.1, h: 1.5, d: 10, color: "#ff3b30" }, // Cloison couloir principal
  { floor: 0, x: -9.5, z: -8, w: 7, h: 1.5, d: 0.1, color: "#ff3b30" }, // Box 1
  { floor: 0, x: -9.5, z: 2, w: 7, h: 1.5, d: 0.1, color: "#ff3b30" },  // Box 2
  
  // Cloisons zone Radiologie & Laboratoire (Bleu ciel)
  { floor: 0, x: 6, z: -3, w: 0.1, h: 1.5, d: 10, color: "#00b0ff" }, // Cloison couloir
  { floor: 0, x: 9.5, z: -8, w: 7, h: 1.5, d: 0.1, color: "#00b0ff" },  // Salle imagerie
  { floor: 0, x: 9.5, z: -3, w: 7, h: 1.5, d: 0.1, color: "#00b0ff" },  // Cloison labo
  { floor: 0, x: 9.5, z: 2, w: 7, h: 1.5, d: 0.1, color: "#00b0ff" },   // Salle prélèvements

  // Cloisons Cafétéria & Admissions (Jaune)
  { floor: 0, x: -4, z: 4.5, w: 6, h: 1.5, d: 0.1, color: "#ffcc00" },  // Cafétéria
  { floor: 0, x: 4, z: 4.5, w: 6, h: 1.5, d: 0.1, color: "#ffcc00" },   // Admissions
  { floor: 0, x: 0, z: 5.5, w: 0.1, h: 1.5, d: 6, color: "#ffcc00" },   // Bureau accueil

  // ==========================================
  // --- PREMIER ÉTAGE (Niveau 1) ---
  // ==========================================
  // Murs extérieurs R1
  { floor: 1, x: 0, z: -13, w: 26, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 1, x: 0, z: 13, w: 26, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 1, x: -13, z: 0, w: 0.15, h: 1.8, d: 26, color: "#0055ff" },
  { floor: 1, x: 13, z: 0, w: 0.15, h: 1.8, d: 26, color: "#0055ff" },
  
  // Cloisons Maternité (Violet/Rose)
  { floor: 1, x: -4, z: -6, w: 0.1, h: 1.5, d: 8, color: "#e040fb" },  // Couloir maternité
  { floor: 1, x: -8.5, z: -6, w: 9, h: 1.5, d: 0.1, color: "#e040fb" }, // Chambre accouchement
  { floor: 1, x: -8.5, z: -2, w: 9, h: 1.5, d: 0.1, color: "#e040fb" }, // Chambre néonat

  // Cloisons Pédiatrie (Violet/Rose)
  { floor: 1, x: 4, z: -4, w: 0.1, h: 1.5, d: 10, color: "#e040fb" },  // Couloir pédiatrie
  { floor: 1, x: 8.5, z: -4, w: 9, h: 1.5, d: 0.1, color: "#e040fb" },  // Salle jeux enfants
  { floor: 1, x: 8.5, z: 1, w: 9, h: 1.5, d: 0.1, color: "#e040fb" },   // Box pédiatrique

  // ==========================================
  // --- DEUXIÈME ÉTAGE (Niveau 2) ---
  // ==========================================
  // Murs extérieurs R2
  { floor: 2, x: 0, z: -13, w: 26, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 2, x: 0, z: 13, w: 26, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 2, x: -13, z: 0, w: 0.15, h: 1.8, d: 26, color: "#0055ff" },
  { floor: 2, x: 13, z: 0, w: 0.15, h: 1.8, d: 26, color: "#0055ff" },
  
  // Cloisons Cardiologie (Vert)
  { floor: 2, x: -4, z: -6, w: 0.1, h: 1.5, d: 8, color: "#00e676" },  // Couloir cardio
  { floor: 2, x: -8.5, z: -6, w: 9, h: 1.5, d: 0.1, color: "#00e676" }, // ECG / Écho
  { floor: 2, x: -8.5, z: -2, w: 9, h: 1.5, d: 0.1, color: "#00e676" }, // Soins intensifs cardio

  // Cloisons Administration (Vert)
  { floor: 2, x: 4, z: -6, w: 0.1, h: 1.5, d: 8, color: "#00e676" },  // Couloir admin
  { floor: 2, x: 8.5, z: -6, w: 9, h: 1.5, d: 0.1, color: "#00e676" },  // Bureau direction
  { floor: 2, x: 8.5, z: -2, w: 9, h: 1.5, d: 0.1, color: "#00e676" }   // Secrétariat général
];

// Composant pour charger un modèle GLB personnalisé de manière dynamique avec opacité contrôlée et transparence angulaire
function GLBMapModel({ path, onMapClick, isEditMode, opacity = 1.0 }) {
  const { scene } = useGLTF(path);
  const cameraDirRef = useRef(new THREE.Vector3());
  
  // Cloner la scène et ses matériaux pour isoler les modifications d'opacité entre instances
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map(mat => {
            const m = mat.clone();
            // Look technologique : ajouter une composante émissive subtile pour le style holographique
            if (m.color) {
              m.emissive = new THREE.Color(m.color).multiplyScalar(0.25);
            }
            return m;
          });
        } else {
          child.material = child.material.clone();
          if (child.material.color) {
            child.material.emissive = new THREE.Color(child.material.color).multiplyScalar(0.25);
          }
        }
      }
    });
    return clone;
  }, [scene]);

  // useFrame pour recalculer l'opacité en temps réel selon l'angle de plongée de la caméra
  useFrame(({ camera }) => {
    camera.getWorldDirection(cameraDirRef.current);
    // Inclinaison : y vaut -1 pour vue du dessus directe, et 0 pour vue horizontale de côté.
    const tilt = Math.abs(cameraDirRef.current.y); // varie de 0 (horizontal) à 1 (vertical)

    // Si c'est l'étage sélectionné actif (opacité de base = 1.0)
    // On fait osciller son opacité de 0.22 (vue rasante de côté) à 1.0 (vue verticale d'en haut)
    const dynamicActiveOpacity = THREE.MathUtils.lerp(0.22, 1.0, tilt);
    
    // Si c'est un étage inactif, on le garde très discret à opacité réduite
    const finalOpacity = opacity >= 0.9 ? dynamicActiveOpacity : opacity * 0.75;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(mat => {
          mat.transparent = finalOpacity < 1.0;
          mat.opacity = finalOpacity;
          // Corrige les problèmes d'affichage des objets transparents imbriqués
          mat.depthWrite = finalOpacity >= 0.95;
        });
      }
    });
  });

  return (
    <primitive 
      object={clonedScene} 
      onClick={isEditMode && opacity >= 1.0 && onMapClick ? (e) => {
        e.stopPropagation();
        onMapClick(e.point);
      } : undefined}
    />
  );
}

// Rendu de toutes les liaisons en mode édition pour le feedback visuel
function AllEdgesLines({ customNodes, customEdges, onSelectEdge, selectedEdge, isEditMode }) {
  if (!isEditMode || !customEdges) return null;

  const activeNodes = customNodes || nodes;

  return customEdges.map((edge, idx) => {
    const nodeA = activeNodes[edge.source];
    const nodeB = activeNodes[edge.target];
    if (!nodeA || !nodeB) return null;

    const isSelected = selectedEdge && 
      ((selectedEdge.source === edge.source && selectedEdge.target === edge.target) ||
       (selectedEdge.source === edge.target && selectedEdge.target === edge.source));

    // Ajustement de hauteur pour éviter le z-fighting avec le sol
    const posA = new THREE.Vector3(nodeA.x, nodeA.y + 0.08, nodeA.z);
    const posB = new THREE.Vector3(nodeB.x, nodeB.y + 0.08, nodeB.z);

    const color = isSelected 
      ? "#00ffff" 
      : edge.type === "elevator" 
        ? "#d500f9" 
        : edge.type === "stairs" 
          ? "#ff6d00" 
          : "#4f73a5";

    return (
      <group key={idx}>
        <Line
          points={[posA, posB]}
          color={color}
          lineWidth={isSelected ? 4 : 2}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectEdge) onSelectEdge(edge);
          }}
        />
        <mesh 
          position={new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5)}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectEdge) onSelectEdge(edge);
          }}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.8}
            emissive={color}
            emissiveIntensity={isSelected ? 1.5 : 0.2}
          />
        </mesh>
      </group>
    );
  });
}

// Composant interne pour animer la ligne d'itinéraire (effet de flux pointillé unique)
function AnimatedRouteLine({ pathNodes }) {
  const lineRef = useRef();

  useFrame(({ clock }) => {
    if (lineRef.current && lineRef.current.material) {
      // Fait défiler les pointillés pour simuler un mouvement fluide vers la destination
      lineRef.current.material.dashOffset = -clock.getElapsedTime() * 1.5;
    }
  });

  if (!pathNodes || pathNodes.length < 2) return null;

  // Créer les points 3D pour la ligne (légèrement surélevés par rapport au sol)
  const points = pathNodes.map(node => new THREE.Vector3(node.x, node.y + 0.15, node.z));

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#00ffff"
      lineWidth={7}
      dashed={true}
      dashScale={1.5}
      dashSize={0.4}
      dashGap={0.3}
    />
  );
}


// Sous-composant pour un mur procédural avec opacité dynamique selon l'angle de la caméra
function ProceduralWall({ wall, isSelected, isolatedMode }) {
  const materialRef = useRef();
  const cameraDirRef = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    if (materialRef.current) {
      camera.getWorldDirection(cameraDirRef.current);
      const tilt = Math.abs(cameraDirRef.current.y); // varie de 0 (horizontal) à 1 (vertical)
      
      let baseOpacity = isSelected ? 0.55 : (isolatedMode ? 0.02 : 0.06);
      if (isSelected) {
        // Fait varier l'opacité du mur sélectionné actif de 0.16 (vue de côté) à 0.65 (vue d'en haut)
        baseOpacity = THREE.MathUtils.lerp(0.16, 0.65, tilt);
      }
      
      materialRef.current.opacity = baseOpacity;
      materialRef.current.transparent = baseOpacity < 1.0;
    }
  });

  const floorObj = floors.find(f => f.id === wall.floor);
  const floorY = floorObj ? floorObj.height : 0;
  const yPos = floorY + wall.h / 2;

  return (
    <mesh position={[wall.x, yPos, wall.z]}>
      <boxGeometry args={[wall.w, wall.h, wall.d]} />
      <meshStandardMaterial
        ref={materialRef}
        color={wall.color}
        transparent
        opacity={isSelected ? 0.55 : (isolatedMode ? 0.02 : 0.06)}
        roughness={0.1}
        metalness={0.8}
        emissive={wall.color}
        emissiveIntensity={isSelected ? 0.8 : 0.1}
      />
      {isSelected && (
        <boxHelper args={[new THREE.Mesh(new THREE.BoxGeometry(wall.w, wall.h, wall.d)), wall.color]} />
      )}
    </mesh>
  );
}

// Rendu des cloisons procédurales de l'hôpital avec transparence dynamique
function ProceduralWallsComponent({ selectedFloor, isolatedMode }) {
  return proceduralWalls.map((wall, index) => {
    const isSelected = selectedFloor === wall.floor;
    const isVisible = !isolatedMode || isSelected;

    if (!isVisible) return null;

    return (
      <ProceduralWall
        key={index}
        wall={wall}
        isSelected={isSelected}
        isolatedMode={isolatedMode}
      />
    );
  });
}

// Composant gérant l'avatar 3D de la visite immersive et l'asservissement de la caméra
function ImmersiveAvatar({ 
  activeRoute, 
  isPlaying, 
  setIsPlaying,
  simSpeed, 
  orbitControlsRef, 
  selectedFloor, 
  setSelectedFloor 
}) {
  const meshRef = useRef();
  const progressRef = useRef(0);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const avatarPosRef = useRef(new THREE.Vector3());
  const avatarRotRef = useRef(0);
  const lastFloorRef = useRef(selectedFloor);

  // Réinitialiser la simulation si l'itinéraire change
  useEffect(() => {
    setCurrentNodeIndex(0);
    progressRef.current = 0;
    if (activeRoute && activeRoute.path && activeRoute.path.length > 0) {
      const first = activeRoute.path[0];
      avatarPosRef.current.set(first.x, first.y, first.z);
      lastFloorRef.current = first.floor;
    }
  }, [activeRoute]);

  // Positionnement initial de la caméra derrière l'avatar au lancement du mode immersif
  useEffect(() => {
    if (activeRoute && activeRoute.path && activeRoute.path.length > 1 && orbitControlsRef.current) {
      const firstNode = activeRoute.path[0];
      const secondNode = activeRoute.path[1];
      
      const dx = secondNode.x - firstNode.x;
      const dz = secondNode.z - firstNode.z;
      const angle = Math.atan2(dx, dz);
      avatarRotRef.current = angle;

      const dist = 6.5; // distance de recul
      const height = 3.5; // hauteur de la caméra
      
      const dirX = Math.sin(angle);
      const dirZ = Math.cos(angle);
      
      const camX = firstNode.x - dirX * dist;
      const camY = firstNode.y + height;
      const camZ = firstNode.z - dirZ * dist;
      
      // Placer la caméra et orienter le target sur le point de départ
      orbitControlsRef.current.object.position.set(camX, camY, camZ);
      orbitControlsRef.current.target.set(firstNode.x, firstNode.y + 0.8, firstNode.z);
      orbitControlsRef.current.update();
    }
  }, [activeRoute, orbitControlsRef]);

  useFrame((state, delta) => {
    if (!activeRoute || !activeRoute.path || activeRoute.path.length < 2) return;
    
    const path = activeRoute.path;
    
    if (isPlaying && currentNodeIndex < path.length - 1) {
      const fromNode = path[currentNodeIndex];
      const toNode = path[currentNodeIndex + 1];
      
      const p1 = new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z);
      const p2 = new THREE.Vector3(toNode.x, toNode.y, toNode.z);
      const segmentDist = p1.distanceTo(p2);
      
      const baseSpeed = 2.4; // 2.4 m/s
      const speedMultiplier = simSpeed; // 1 ou 2
      const segmentDuration = segmentDist / (baseSpeed * speedMultiplier);
      
      progressRef.current += delta / (segmentDuration || 1);
      
      if (progressRef.current >= 1.0) {
        progressRef.current = 0;
        const nextIndex = currentNodeIndex + 1;
        if (nextIndex >= path.length - 1) {
          // Destination atteinte
          setIsPlaying(false);
          setCurrentNodeIndex(path.length - 1);
          avatarPosRef.current.set(toNode.x, toNode.y, toNode.z);
        } else {
          setCurrentNodeIndex(nextIndex);
        }
      } else {
        avatarPosRef.current.lerpVectors(p1, p2, progressRef.current);
        
        const dx = toNode.x - fromNode.x;
        const dz = toNode.z - fromNode.z;
        if (dx !== 0 || dz !== 0) {
          const targetAngle = Math.atan2(dx, dz);
          // Interpolation fluide pour tourner
          avatarRotRef.current = THREE.MathUtils.lerp(avatarRotRef.current, targetAngle, 0.1);
        }
      }
      
      // Changement d'étage dynamique
      const currentFloor = avatarPosRef.current.y > fromNode.y + 0.5 ? toNode.floor : fromNode.floor;
      if (currentFloor !== lastFloorRef.current && setSelectedFloor) {
        lastFloorRef.current = currentFloor;
        setSelectedFloor(currentFloor);
      }
    }

    // Asservissement de la cible de la caméra sur la position actuelle de l'avatar
    if (orbitControlsRef.current) {
      const targetPos = new THREE.Vector3(avatarPosRef.current.x, avatarPosRef.current.y + 0.8, avatarPosRef.current.z);
      orbitControlsRef.current.target.lerp(targetPos, 0.1);
    }

    // Appliquer la position au mesh de l'avatar
    if (meshRef.current) {
      meshRef.current.position.copy(avatarPosRef.current);
      meshRef.current.rotation.y = avatarRotRef.current;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Flèche holographique directionnelle cyan */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.2, 0.7, 4]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff"
          emissiveIntensity={3.0}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Anneau lumineux sous l'avatar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.3, 0.38, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>

      {/* Halo de lumière projetée vers le sol */}
      <pointLight 
        color="#00f0ff" 
        intensity={2.0} 
        distance={2.5} 
        position={[0, 0.5, 0]} 
      />
    </group>
  );
}

// Rendu des étages de l'hôpital sous forme de plaques technologiques
function HospitalFloors({ selectedFloor, isolatedMode, isEditMode, onMapClick }) {
  return floors.map(floor => {
    const isSelected = selectedFloor === floor.id;
    const isVisible = !isolatedMode || isSelected;
    // Allègement de l'opacité des plaques non sélectionnées (0.08 au lieu de 0.18, bordure 0.12 au lieu de 0.35)
    const opacity = isSelected ? 0.45 : (isolatedMode ? 0.03 : 0.08);
    const borderOpacity = isSelected ? 0.95 : (isolatedMode ? 0.05 : 0.12);
    const floorY = floor.height;

    if (!isVisible) return null;

    return (
      <group key={floor.id} position={[0, floorY, 0]}>
        {/* Plaque principale en verre coloré */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={isEditMode && isSelected && onMapClick ? (e) => {
            e.stopPropagation();
            onMapClick(e.point);
          } : undefined}
        >
          <planeGeometry args={[26, 26]} />
          <meshStandardMaterial
            color={isSelected ? "#0066ff" : "#1a2a4a"}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Bordure brillante néon pour délimiter l'étage */}
        <Line
          points={[
            [-13, 0, -13],
            [13, 0, -13],
            [13, 0, 13],
            [-13, 0, 13],
            [-13, 0, -13]
          ]}
          color={isSelected ? "#00f0ff" : "#0055aa"}
          lineWidth={isSelected ? 4 : 1.5}
          transparent
          opacity={borderOpacity}
        />

        {/* Grillage interne pour un look "plan technologique 3D" */}
        <gridHelper 
          args={[26, 13, isSelected ? "#00eeff" : "#20407a", isSelected ? "#003baf" : "#0e1a3a"]} 
          position={[0, 0.01, 0]} 
          transparent
          opacity={opacity * 0.5}
        />

        {/* Étiquette textuelle de l'étage en 3D (sans attribut 'font' pour utiliser la police par défaut intégrée) */}
        <Text
          position={[-11.5, 0.25, 11.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1.3}
          color={isSelected ? "#00f0ff" : "#4f73a5"}
          anchorX="left"
          anchorY="middle"
        >
          {floor.label}
        </Text>
      </group>
    );
  });
}

// Rendu interactif des nœuds et des destinations
function MapMarkers({ 
  activeRoute, 
  selectedFloor, 
  isolatedMode, 
  customNodes, 
  isEditMode, 
  editorMode, 
  selectedNodeId, 
  setSelectedNodeId, 
  linkingStartNodeId, 
  setLinkingStartNodeId, 
  onAddEdge 
}) {
  const pinRef = useRef();

  useFrame(({ clock }) => {
    if (pinRef.current) {
      pinRef.current.position.y = pinRef.current.userData.baseY + Math.sin(clock.getElapsedTime() * 3.5) * 0.25;
      pinRef.current.rotation.y = clock.getElapsedTime() * 1.8;
    }
  });

  const activeNodesToRender = customNodes ? Object.values(customNodes) : Object.values(nodes);
  const destinationNodeId = activeRoute?.path[activeRoute.path.length - 1]?.id;

  return activeNodesToRender.map(node => {
    const isSelectedFloor = selectedFloor === node.floor;
    // Si l'isolation d'étage est active, on n'affiche que l'étage en cours même en édition
    const isVisible = !isolatedMode || isSelectedFloor;

    if (!isVisible) return null;

    let markerColor = "#888888";
    let size = 0.15;
    let showText = false;
    let isDestination = node.id === destinationNodeId;
    let isBorne = node.type === "borne";
    let isSelectedInEditor = isEditMode && selectedNodeId === node.id;
    let isLinkingStart = isEditMode && linkingStartNodeId === node.id;

    if (isBorne) {
      markerColor = "#ffcc00"; 
      size = 0.38;
      showText = true;
    } else if (node.type === "room") {
      markerColor = isDestination ? "#00f0ff" : "#00e676";
      size = isDestination ? 0.45 : 0.25;
      showText = isDestination || isSelectedFloor || isEditMode;
    } else if (node.type === "elevator") {
      markerColor = "#d500f9";
      size = 0.32;
      showText = isSelectedFloor || isEditMode;
    } else if (node.type === "stairs") {
      markerColor = "#ff6d00";
      size = 0.32;
      showText = isSelectedFloor || isEditMode;
    } else if (node.type === "intersection") {
      // Les intersections sont visibles uniquement en mode édition
      if (!isEditMode) return null;
      markerColor = "#888888";
      size = 0.18;
      showText = true;
    } else {
      return null;
    }

    if (isSelectedInEditor) {
      markerColor = "#00ffff"; // Cyan brillant
      size *= 1.4;
    } else if (isLinkingStart) {
      markerColor = "#af52de"; // Violet brillant
      size *= 1.4;
    }

    return (
      <group 
        key={node.id} 
        position={[node.x, node.y, node.z]}
        onClick={(e) => {
          if (isEditMode) {
            // Ignorer les clics sur les marqueurs des autres étages
            // Cela résout le bug de chevauchement au raycast (clic à travers les étages sur les ascenseurs)
            if (!isSelectedFloor) return;

            e.stopPropagation();
            if (editorMode === "select") {
              setSelectedNodeId(node.id);
            } else if (editorMode === "link_nodes") {
              if (!linkingStartNodeId) {
                setLinkingStartNodeId(node.id);
              } else if (linkingStartNodeId !== node.id) {
                onAddEdge(linkingStartNodeId, node.id);
                setLinkingStartNodeId(null);
              }
            }
          }
        }}
      >
        {isDestination ? (
          <mesh 
            ref={pinRef} 
            userData={{ baseY: 1.2 }}
            position={[0, 1.2, 0]}
          >
            <coneGeometry args={[0.3, 0.9, 4]} />
            <meshStandardMaterial 
              color="#00f0ff" 
              emissive="#0066ff" 
              emissiveIntensity={2.5} 
              metalness={0.9} 
              roughness={0.1}
              transparent={!isSelectedFloor}
              opacity={isSelectedFloor ? 1.0 : 0.25}
            />
          </mesh>
        ) : (
          <mesh>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
              color={markerColor}
              emissive={markerColor}
              emissiveIntensity={isBorne || isDestination || isSelectedInEditor || isLinkingStart ? 1.8 : 0.3}
              metalness={0.8}
              roughness={0.2}
              transparent={!isSelectedFloor}
              opacity={isSelectedFloor ? 1.0 : 0.25}
            />
          </mesh>
        )}

        {(isBorne || isDestination || isSelectedInEditor || isLinkingStart) && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[size * 1.5, size * 2.5, 32]} />
            <meshBasicMaterial
              color={isBorne ? "#ffcc00" : (isLinkingStart ? "#af52de" : "#00f0ff")}
              transparent
              opacity={isSelectedFloor ? 0.45 : 0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {showText && (
          <Text
            position={[0, size + 0.5, 0]}
            fontSize={0.45}
            color={isSelectedInEditor ? "#00ffff" : isLinkingStart ? "#af52de" : isDestination ? "#00f0ff" : isBorne ? "#ffcc00" : "#ffffff"}
            backgroundColor="#050a17"
            backgroundOpacity={isSelectedFloor ? 0.85 : 0.2}
            fillOpacity={isSelectedFloor ? 1.0 : 0.3}
            backgroundPadding={0.12}
            anchorX="center"
            anchorY="bottom"
          >
            {node.nomFR || node.label}
          </Text>
        )}
      </group>
    );
  });
}

export default function HospitalMap3D({ 
  activeRoute, 
  selectedFloor, 
  setSelectedFloor = () => {},
  isolatedMode, 
  onSelectDestination,
  mapType = "procedural",
  glbPaths = { 0: "/map_test.glb", 1: "", 2: "" },
  isEditMode = false,
  editorMode = null,
  customNodes = null,
  customEdges = null,
  selectedNodeId = null,
  setSelectedNodeId = () => {},
  selectedEdge = null,
  setSelectedEdge = () => {},
  linkingStartNodeId = null,
  setLinkingStartNodeId = () => {},
  pendingClickCoords = null,
  setPendingClickCoords = () => {},
  onMapClick = () => {},
  onAddEdge = () => {},
  immersiveMode = false,
  setImmersiveMode = () => {}
}) {
  const orbitControlsRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);

  // Réinitialiser la marche si l'itinéraire est fermé ou modifié
  useEffect(() => {
    if (!activeRoute) {
      setIsPlaying(false);
    }
  }, [activeRoute]);

  useEffect(() => {
    if (orbitControlsRef.current) {
      if (immersiveMode) {
        // En mode immersif, on laisse le composant ImmersiveAvatar piloter le target en continu
        return;
      }
      
      if (activeRoute && activeRoute.path.length > 0) {
        const destNode = activeRoute.path[activeRoute.path.length - 1];
        orbitControlsRef.current.target.set(destNode.x / 1.8, destNode.y, destNode.z / 1.8);
      } else {
        const currentFloorObj = floors.find(f => f.id === selectedFloor);
        const targetY = currentFloorObj ? currentFloorObj.height : 0;
        orbitControlsRef.current.target.set(0, targetY, -2);
      }
      orbitControlsRef.current.update();
    }
  }, [activeRoute, selectedFloor, immersiveMode]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "#040710" }}>
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 10,
        pointerEvents: "none",
        fontFamily: "Plus Jakarta Sans, sans-serif"
      }}>
        <h4 style={{ color: "#ffffff", margin: 0, fontSize: "1.1rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1.5px", textShadow: "0 0 10px rgba(0,240,255,0.5)" }}>
          {isEditMode ? "Mode Éditeur de Carte" : "Modèle d'Orientation 3D"}
        </h4>
        <span style={{ color: "#4f73a5", fontSize: "0.8rem" }}>
          {isEditMode 
            ? `Édition en cours (${mapType === "custom_glb" ? "GLB" : "Procédurale"})` 
            : "Maquette Holographique Active"
          }
        </span>
      </div>

      <Canvas
        camera={{ position: [18, 16, 20], fov: 38 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#040710"));
        }}
      >
        <Suspense fallback={null}>
          {/* Lumières de la scène */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 15]} intensity={0.9} />
          <pointLight position={[-12, 5, -12]} intensity={0.5} color="#0055ff" />
          <pointLight position={[12, 10, 12]} intensity={0.4} color="#00f0ff" />

          {/* Rendu conditionnel selon procedural vs custom glb */}
          {mapType === "procedural" ? (
            <>
              {/* Composants de la structure hospitalière */}
              <HospitalFloors 
                selectedFloor={selectedFloor} 
                isolatedMode={isolatedMode} 
                isEditMode={isEditMode} 
                onMapClick={onMapClick} 
              />

              {/* Cloisons et Murs de l'Hôpital */}
              <ProceduralWallsComponent selectedFloor={selectedFloor} isolatedMode={isolatedMode} />
            </>
          ) : (
            /* Carte GLB personnalisée avec support Multi-Niveaux et Rétrocompatibilité */
            (() => {
              const hasOnlyRdc = glbPaths[0] && !glbPaths[1] && !glbPaths[2];

              return floors.map(floor => {
                const path = glbPaths[floor.id];
                if (!path || !isValidGlbPath(path)) return null;

                const isSelected = selectedFloor === floor.id;
                // Si c'est une maquette globale unique au RDC, elle reste toujours visible.
                // Sinon, en mode isolé, on n'affiche que l'étage sélectionné.
                const isVisible = hasOnlyRdc || !isolatedMode || isSelected;
                if (!isVisible) return null;

                // Si l'étage actuel est sélectionné, opacité à 1.0 (totalement opaque).
                // S'il n'est pas sélectionné (ex: maquette unique du RDC alors qu'on est au R+1), on applique 15% d'opacité.
                const glbOpacity = isSelected ? 1.0 : 0.15;

                return (
                  <group key={floor.id} position={[0, floor.height, 0]}>
                    <GLBMapModel 
                      path={path} 
                      onMapClick={onMapClick} 
                      isEditMode={isEditMode} 
                      opacity={glbOpacity}
                    />
                  </group>
                );
              });
            })()
          )}

          {/* Marqueurs et points clés */}
          <MapMarkers
            activeRoute={activeRoute}
            selectedFloor={selectedFloor}
            isolatedMode={isolatedMode}
            onSelectDestination={onSelectDestination}
            customNodes={customNodes}
            isEditMode={isEditMode}
            editorMode={editorMode}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            linkingStartNodeId={linkingStartNodeId}
            setLinkingStartNodeId={setLinkingStartNodeId}
            onAddEdge={onAddEdge}
          />

          {/* Marqueur de nœud temporaire pour la création */}
          {isEditMode && editorMode === "add_node" && pendingClickCoords && (
            <mesh position={[pendingClickCoords.x, pendingClickCoords.y, pendingClickCoords.z]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={2} />
            </mesh>
          )}

          {/* Rendu de toutes les liaisons en mode édition */}
          {isEditMode && (
            <AllEdgesLines
              customNodes={customNodes}
              customEdges={customEdges}
              onSelectEdge={setSelectedEdge}
              selectedEdge={selectedEdge}
              isEditMode={isEditMode}
            />
          )}

          {/* Affichage de la ligne d'itinéraire en 3D en mode normal */}
          {!isEditMode && activeRoute && activeRoute.path && activeRoute.path.length > 0 && (
            <AnimatedRouteLine 
              pathNodes={activeRoute.path} 
            />
          )}

          {/* Avatar 3D en mode immersif */}
          {!isEditMode && immersiveMode && activeRoute && activeRoute.path && activeRoute.path.length > 0 && (
            <ImmersiveAvatar
              activeRoute={activeRoute}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              simSpeed={simSpeed}
              orbitControlsRef={orbitControlsRef}
              selectedFloor={selectedFloor}
              setSelectedFloor={setSelectedFloor}
            />
          )}

          {/* Contrôles tactiles de la caméra limités */}
          <OrbitControls
            ref={orbitControlsRef}
            enableDamping
            dampingFactor={0.08}
            minDistance={8}
            maxDistance={65}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={Math.PI / 6}
          />
        </Suspense>
      </Canvas>

      {/* Panneau de contrôle de la Visite Virtuelle Immersive (3ème Personne) */}
      {immersiveMode && activeRoute && activeRoute.path && activeRoute.path.length > 0 && (
        <div style={{
          position: "absolute",
          bottom: "35px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          pointerEvents: "auto"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            background: "rgba(6, 12, 32, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 240, 255, 0.25)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 240, 255, 0.15)",
            padding: "10px 24px",
            borderRadius: "40px",
            color: "#ffffff"
          }}>
            {/* Bouton Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: "none",
                border: "none",
                color: "#00f0ff",
                fontSize: "1.4rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px",
                transition: "transform 0.2s ease",
                transform: "scale(1.1)"
              }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>

            <div style={{ width: "1px", height: "20px", background: "rgba(255, 255, 255, 0.15)" }} />

            {/* Vitesse */}
            <button
              onClick={() => setSimSpeed(simSpeed === 1 ? 2 : 1)}
              style={{
                background: simSpeed === 2 ? "rgba(0, 240, 255, 0.2)" : "none",
                border: "1px solid rgba(0, 240, 255, 0.3)",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "15px",
                transition: "all 0.2s ease"
              }}
            >
              {simSpeed}x
            </button>

            <div style={{ width: "1px", height: "20px", background: "rgba(255, 255, 255, 0.15)" }} />

            {/* Bouton Recommencer */}
            <button
              onClick={() => {
                // Pour déclencher la réinitialisation dans le composant Avatar, on peut temporairement forcer un re-render
                // en créant une nouvelle référence d'objet route ou en désactivant temporairement la marche
                setIsPlaying(false);
                setTimeout(() => {
                  setIsPlaying(true);
                }, 50);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#a4bccc",
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px",
                transition: "transform 0.2s"
              }}
              title="Recommencer"
            >
              🔄
            </button>

            <div style={{ width: "1px", height: "20px", background: "rgba(255, 255, 255, 0.15)" }} />

            {/* Bouton Quitter */}
            <button
              onClick={() => setImmersiveMode(false)}
              style={{
                background: "rgba(255, 59, 48, 0.2)",
                border: "1px solid rgba(255, 59, 48, 0.4)",
                color: "#ff3b30",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                padding: "6px 16px",
                borderRadius: "20px",
                transition: "all 0.2s ease"
              }}
            >
              Quitter
            </button>
          </div>
          
          {/* Indication visuelle de contrôle 360 */}
          <span style={{
            color: "rgba(0, 240, 255, 0.7)",
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
            textShadow: "0 0 8px rgba(0, 240, 255, 0.3)"
          }}>
            🔄 Faites glisser l'écran pour pivoter à 360° autour du guide
          </span>
        </div>
      )}
    </div>
  );
}
