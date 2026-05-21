// src/components/HospitalMap3D.jsx
import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { floors, nodes } from "../data/navigationData";

// Données géométriques des cloisons et murs procéduraux
const proceduralWalls = [
  // ==========================================
  // --- REZ-DE-CHAUSSÉE (Niveau 0) ---
  // ==========================================
  // Murs extérieurs (Bleu technologique - Forme trapézoïdale réelle du RDC)
  { floor: 0, x: 0, z: -18, w: 28, h: 1.8, d: 0.2, color: "#0055ff" },
  { floor: 0, x: 14, z: 0, w: 0.2, h: 1.8, d: 36, color: "#0055ff" },
  { floor: 0, x: 7, z: 18, w: 14, h: 1.8, d: 0.2, color: "#0055ff" },
  { floor: 0, x: 0, z: 17, w: 10, h: 1.8, d: 0.2, color: "#0055ff" },
  { floor: 0, x: -9, z: 15, w: 10, h: 1.8, d: 0.2, color: "#0055ff" },
  { floor: 0, x: -14, z: -10, w: 0.2, h: 1.8, d: 16, color: "#0055ff" },
  { floor: 0, x: -14, z: 12, w: 0.2, h: 1.8, d: 8, color: "#0055ff" },
  { floor: 0, x: -12, z: 2, w: 4, h: 1.8, d: 0.2, color: "#0055ff" }, // Décroché entrée

  // Grand Patio Central Supérieur
  { floor: 0, x: 4, z: -10, w: 8, h: 1.8, d: 0.15, color: "#00ffcc" },
  { floor: 0, x: 4, z: 2, w: 8, h: 1.8, d: 0.15, color: "#00ffcc" },
  { floor: 0, x: 0, z: -4, w: 0.15, h: 1.8, d: 12, color: "#00ffcc" },
  { floor: 0, x: 8, z: -4, w: 0.15, h: 1.8, d: 12, color: "#00ffcc" },

  // Patio Inférieur
  { floor: 0, x: -4, z: 6, w: 8, h: 1.8, d: 0.15, color: "#00ffcc" },
  { floor: 0, x: -4, z: 12, w: 8, h: 1.8, d: 0.15, color: "#00ffcc" },
  { floor: 0, x: -8, z: 9, w: 0.15, h: 1.8, d: 6, color: "#00ffcc" },
  { floor: 0, x: 0, z: 9, w: 0.15, h: 1.8, d: 6, color: "#00ffcc" },

  // Cloisons zone Urgences (Rouge - Haut Gauche)
  { floor: 0, x: -7, z: -8, w: 0.1, h: 1.5, d: 12, color: "#ff3b30" }, // Couloir urgences
  { floor: 0, x: -10.5, z: -14, w: 7, h: 1.5, d: 0.1, color: "#ff3b30" },
  { floor: 0, x: -10.5, z: -10, w: 7, h: 1.5, d: 0.1, color: "#ff3b30" },
  { floor: 0, x: -10.5, z: -6, w: 7, h: 1.5, d: 0.1, color: "#ff3b30" },

  // Cloisons zone Radiologie / Labo / Imagerie (Bleu ciel - Droite)
  { floor: 0, x: 10, z: -8, w: 0.1, h: 1.5, d: 14, color: "#00b0ff" }, // Couloir imagerie
  { floor: 0, x: 12, z: -14, w: 4, h: 1.5, d: 0.1, color: "#00b0ff" },
  { floor: 0, x: 12, z: -8, w: 4, h: 1.5, d: 0.1, color: "#00b0ff" },
  { floor: 0, x: 12, z: -2, w: 4, h: 1.5, d: 0.1, color: "#00b0ff" },

  // Cloisons Restaurant (Jaune - Bas Gauche)
  { floor: 0, x: -8, z: 4, w: 0.1, h: 1.5, d: 4, color: "#ffcc00" },
  { floor: 0, x: -11, z: 2, w: 6, h: 1.5, d: 0.1, color: "#ffcc00" },
  { floor: 0, x: -11, z: 8, w: 6, h: 1.5, d: 0.1, color: "#ffcc00" },

  // Cloisons Unité Administrative RDC (Vert - Bas)
  { floor: 0, x: -6, z: 12, w: 4, h: 1.5, d: 0.1, color: "#00e676" },
  { floor: 0, x: -10, z: 14, w: 8, h: 1.5, d: 0.1, color: "#00e676" },
  { floor: 0, x: -8, z: 11, w: 0.1, h: 1.5, d: 4, color: "#00e676" },

  // Cages d'Ascenseurs RDC (Violet/Rose émissif)
  { floor: 0, x: -2, z: -7, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  { floor: 0, x: -9, z: 10, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  { floor: 0, x: 12, z: 3, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },

  // ==========================================
  // --- PREMIER ÉTAGE (Niveau 1) ---
  // ==========================================
  // Murs extérieurs R1 (Alignés sur les dimensions du bâtiment)
  { floor: 1, x: 0, z: -18, w: 28, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 1, x: 0, z: 18, w: 28, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 1, x: -14, z: 0, w: 0.15, h: 1.8, d: 36, color: "#0055ff" },
  { floor: 1, x: 14, z: 0, w: 0.15, h: 1.8, d: 36, color: "#0055ff" },

  // Cages d'Ascenseurs R1
  { floor: 1, x: -2, z: -7, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  { floor: 1, x: -9, z: 10, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  { floor: 1, x: 12, z: 3, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  
  // Cloisons Maternité (Violet/Rose)
  { floor: 1, x: -4, z: -6, w: 0.1, h: 1.5, d: 8, color: "#e040fb" },
  { floor: 1, x: -8.5, z: -6, w: 9, h: 1.5, d: 0.1, color: "#e040fb" },
  { floor: 1, x: -8.5, z: -2, w: 9, h: 1.5, d: 0.1, color: "#e040fb" },

  // Cloisons Pédiatrie (Violet/Rose)
  { floor: 1, x: 4, z: -4, w: 0.1, h: 1.5, d: 10, color: "#e040fb" },
  { floor: 1, x: 8.5, z: -4, w: 9, h: 1.5, d: 0.1, color: "#e040fb" },
  { floor: 1, x: 8.5, z: 1, w: 9, h: 1.5, d: 0.1, color: "#e040fb" },

  // ==========================================
  // --- DEUXIÈME ÉTAGE (Niveau 2) ---
  // ==========================================
  // Murs extérieurs R2 (Alignés sur les dimensions du bâtiment)
  { floor: 2, x: 0, z: -18, w: 28, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 2, x: 0, z: 18, w: 28, h: 1.8, d: 0.15, color: "#0055ff" },
  { floor: 2, x: -14, z: 0, w: 0.15, h: 1.8, d: 36, color: "#0055ff" },
  { floor: 2, x: 14, z: 0, w: 0.15, h: 1.8, d: 36, color: "#0055ff" },

  // Cages d'Ascenseurs R2
  { floor: 2, x: -2, z: -7, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  { floor: 2, x: -9, z: 10, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  { floor: 2, x: 12, z: 3, w: 2.2, h: 1.8, d: 2.2, color: "#d500f9" },
  
  // Cloisons Cardiologie (Vert)
  { floor: 2, x: -4, z: -6, w: 0.1, h: 1.5, d: 8, color: "#00e676" },
  { floor: 2, x: -8.5, z: -6, w: 9, h: 1.5, d: 0.1, color: "#00e676" },
  { floor: 2, x: -8.5, z: -2, w: 9, h: 1.5, d: 0.1, color: "#00e676" },

  // Cloisons Administration (Vert)
  { floor: 2, x: 4, z: -6, w: 0.1, h: 1.5, d: 8, color: "#00e676" },
  { floor: 2, x: 8.5, z: -6, w: 9, h: 1.5, d: 0.1, color: "#00e676" },
  { floor: 2, x: 8.5, z: -2, w: 9, h: 1.5, d: 0.1, color: "#00e676" }
];

// Composant interne pour animer la ligne d'itinéraire (effet laser/pulse)
function AnimatedRouteLine({ pathNodes }) {
  const lineRef = useRef();

  useFrame(({ clock }) => {
    if (lineRef.current && lineRef.current.material) {
      // Effet d'oscillation de l'intensité émissive
      lineRef.current.material.emissiveIntensity = 2.0 + Math.sin(clock.getElapsedTime() * 6) * 0.6;
    }
  });

  if (!pathNodes || pathNodes.length < 2) return null;

  // Créer les points 3D pour la ligne
  const points = pathNodes.map(node => new THREE.Vector3(node.x, node.y + 0.2, node.z));

  return (
    <group>
      {/* Ligne principale brillante */}
      <Line
        points={points}
        color="#00ffff"
        lineWidth={6}
        dashed={false}
      />
      {/* Tube 3D translucide émissif pour l'effet "neon" */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 64, 0.2, 8, false]} />
        <meshStandardMaterial
          ref={lineRef}
          color="#00f0ff"
          emissive="#00b8ff"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Rendu des cloisons procédurales de l'hôpital
function ProceduralWallsComponent({ selectedFloor, isolatedMode }) {
  return proceduralWalls.map((wall, index) => {
    const isSelected = selectedFloor === wall.floor;
    const isVisible = !isolatedMode || isSelected;
    // Augmentation de l'opacité pour s'assurer de la visibilité sur tous les écrans
    const opacity = isSelected ? 0.55 : (isolatedMode ? 0.02 : 0.15);

    if (!isVisible) return null;

    const floorObj = floors.find(f => f.id === wall.floor);
    const floorY = floorObj ? floorObj.height : 0;
    const yPos = floorY + wall.h / 2;

    return (
      <mesh key={index} position={[wall.x, yPos, wall.z]}>
        <boxGeometry args={[wall.w, wall.h, wall.d]} />
        <meshStandardMaterial
          color={wall.color}
          transparent
          opacity={opacity}
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
  });
}

// Rendu des étages de l'hôpital sous forme de plaques technologiques
function HospitalFloors({ selectedFloor, isolatedMode }) {
  return floors.map(floor => {
    const isSelected = selectedFloor === floor.id;
    const isVisible = !isolatedMode || isSelected;
    // Augmentation de l'opacité pour une visibilité accrue
    const opacity = isSelected ? 0.45 : (isolatedMode ? 0.03 : 0.18);
    const borderOpacity = isSelected ? 0.95 : (isolatedMode ? 0.05 : 0.35);
    const floorY = floor.height;

    if (!isVisible) return null;

    return (
      <group key={floor.id} position={[0, floorY, 0]}>
        {/* Plaque principale en verre coloré */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[28, 36]} />
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
            [-14, 0, -18],
            [14, 0, -18],
            [14, 0, 18],
            [-14, 0, 18],
            [-14, 0, -18]
          ]}
          color={isSelected ? "#00f0ff" : "#0055aa"}
          lineWidth={isSelected ? 4 : 1.5}
          transparent
          opacity={borderOpacity}
        />

        {/* Grillage interne pour un look "plan technologique 3D" */}
        <gridHelper 
          args={[36, 18, isSelected ? "#00eeff" : "#20407a", isSelected ? "#003baf" : "#0e1a3a"]} 
          position={[0, 0.01, 0]} 
          transparent
          opacity={opacity * 0.5}
        />

        {/* Étiquette textuelle de l'étage en 3D (sans attribut 'font' pour utiliser la police par défaut intégrée) */}
        <Text
          position={[-12.5, 0.25, 16.5]}
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
function MapMarkers({ activeRoute, selectedFloor, isolatedMode, onSelectDestination }) {
  const pinRef = useRef();

  useFrame(({ clock }) => {
    if (pinRef.current) {
      pinRef.current.position.y = pinRef.current.userData.baseY + Math.sin(clock.getElapsedTime() * 3.5) * 0.25;
      pinRef.current.rotation.y = clock.getElapsedTime() * 1.8;
    }
  });

  const destinationNodeId = activeRoute?.path[activeRoute.path.length - 1]?.id;

  return Object.values(nodes).map(node => {
    const isSelectedFloor = selectedFloor === node.floor;
    const isVisible = !isolatedMode || isSelectedFloor;

    if (!isVisible) return null;

    let markerColor = "#888888";
    let size = 0.15;
    let showText = false;
    let isDestination = node.id === destinationNodeId;
    let isBorne = node.type === "borne";

    if (isBorne) {
      markerColor = "#ffcc00"; 
      size = 0.38;
      showText = true;
    } else if (node.type === "room") {
      markerColor = isDestination ? "#00f0ff" : "#00e676";
      size = isDestination ? 0.45 : 0.25;
      showText = isDestination || isSelectedFloor;
    } else if (node.type === "elevator") {
      markerColor = "#d500f9";
      size = 0.32;
      showText = isSelectedFloor;
    } else if (node.type === "stairs") {
      markerColor = "#ff6d00";
      size = 0.32;
      showText = isSelectedFloor;
    } else {
      return null;
    }

    return (
      <group key={node.id} position={[node.x, node.y, node.z]}>
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
            />
          </mesh>
        ) : (
          <mesh>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
              color={markerColor}
              emissive={markerColor}
              emissiveIntensity={isBorne || isDestination ? 1.8 : 0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        )}

        {(isBorne || isDestination) && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[size * 1.5, size * 2.5, 32]} />
            <meshBasicMaterial
              color={isBorne ? "#ffcc00" : "#00f0ff"}
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Étiquette textuelle au-dessus du marqueur (sans attribut 'font' pour éviter le blocage réseau) */}
        {showText && (
          <Text
            position={[0, size + 0.5, 0]}
            fontSize={0.5}
            color={isDestination ? "#00f0ff" : isBorne ? "#ffcc00" : "#ffffff"}
            backgroundColor="#050a17"
            backgroundOpacity={0.85}
            backgroundPadding={0.12}
            anchorX="center"
            anchorY="bottom"
          >
            {node.label}
          </Text>
        )}
      </group>
    );
  });
}

export default function HospitalMap3D({ activeRoute, selectedFloor, isolatedMode, onSelectDestination }) {
  const orbitControlsRef = useRef();

  useEffect(() => {
    if (orbitControlsRef.current) {
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
  }, [activeRoute, selectedFloor]);

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
          Modèle d'Orientation 3D
        </h4>
        <span style={{ color: "#4f73a5", fontSize: "0.8rem" }}>Maquette Holographique Active</span>
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

          {/* Composants de la structure hospitalière */}
          <HospitalFloors selectedFloor={selectedFloor} isolatedMode={isolatedMode} />

          {/* Cloisons et Murs de l'Hôpital */}
          <ProceduralWallsComponent selectedFloor={selectedFloor} isolatedMode={isolatedMode} />

          {/* Marqueurs et points clés */}
          <MapMarkers
            activeRoute={activeRoute}
            selectedFloor={selectedFloor}
            isolatedMode={isolatedMode}
            onSelectDestination={onSelectDestination}
          />

          {/* Affichage de la ligne d'itinéraire en 3D */}
          {activeRoute && activeRoute.path && activeRoute.path.length > 0 && (
            <AnimatedRouteLine 
              pathNodes={activeRoute.path} 
            />
          )}

          {/* Contrôles tactiles de la caméra limités */}
          <OrbitControls
            ref={orbitControlsRef}
            enableDamping
            dampingFactor={0.08}
            minDistance={8}
            maxDistance={32}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={Math.PI / 6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
