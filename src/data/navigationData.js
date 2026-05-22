// src/data/navigationData.js

export const floors = [
  { id: 0, nameFR: "Rez-de-chaussée", nameAR: "الطابق الأرضي", height: 0, label: "RDC" },
  { id: 1, nameFR: "1er Étage", nameAR: "الطابق الأول", height: 4, label: "R+1" },
  { id: 2, nameFR: "2e Étage", nameAR: "الطابق الثاني", height: 8, label: "R+2" }
];

export const destinations = [
  {
    id: "urgences",
    code: "URG",
    nomFR: "Urgences Générales",
    nomAR: "الطوارئ العامة",
    aliasesFR: ["urgence", "accident", "blessure", "medecin de garde", "secours"],
    aliasesAR: ["طوارئ", "حادث", "جرح", "طبيب مناوب", "إسعاف"],
    type: "urgences",
    floor: 0,
    zone: "A",
    color: "#ff3b30",
    nodeId: "node_urgences",
    accessible: true,
    descFR: "Prise en charge médicale d'urgence 24h/24.",
    descAR: "رعاية طبية طارئة على مدار 24 ساعة."
  },
  {
    id: "imagerie",
    code: "IMG",
    nomFR: "Imagerie Médicale (Radio / IRM / Scanner)",
    nomAR: "التصوير الطبي (أشعة / رنين مغناطيسي / سكانر)",
    aliasesFR: ["radio", "irm", "scanner", "radiographie", "echographie", "xray"],
    aliasesAR: ["أشعة", "رنين", "سكانر", "تلفزة", "فحص"],
    type: "imagerie",
    floor: 0,
    zone: "B",
    color: "#007aff",
    nodeId: "node_imagerie",
    accessible: true,
    descFR: "Radiographie, échographie, scanner et IRM.",
    descAR: "تصوير بالأشعة، موجات فوق صوتية، سكانر ورنين مغناطيسي."
  },
  {
    id: "laboratoire",
    code: "LAB",
    nomFR: "Laboratoire d'Analyses",
    nomAR: "مخبر التحاليل الطبية",
    aliasesFR: ["prise de sang", "sang", "analyse", "prelevement", "biologie"],
    aliasesAR: ["تحليل", "دم", "مخبر", "فحص الدم", "بيولوجيا"],
    type: "laboratoire",
    floor: 0,
    zone: "B",
    color: "#007aff",
    nodeId: "node_laboratoire",
    accessible: true,
    descFR: "Prélèvements sanguins et analyses biologiques.",
    descAR: "سحب عينات الدم والتحاليل البيولوجية."
  },
  {
    id: "maternite",
    code: "MAT",
    nomFR: "Maternité & Gynécologie",
    nomAR: "توليد وأمراض النساء",
    aliasesFR: ["accouchement", "bebe", "grossesse", "gyneco", "pediatre"],
    aliasesAR: ["ولادة", "رضيع", "حمل", "نساء", "أطفال"],
    type: "maternite",
    floor: 1,
    zone: "C",
    color: "#af52de",
    nodeId: "node_maternite",
    accessible: true,
    descFR: "Suivi de grossesse, accouchement et néonatalogie.",
    descAR: "متابعة الحمل، الولادة وطب حديثي الولادة."
  },
  {
    id: "pediatrie",
    code: "PED",
    nomFR: "Pédiatrie",
    nomAR: "طب الأطفال",
    aliasesFR: ["enfant", "pediatre", "bebe", "vaccin"],
    aliasesAR: ["طفل", "أطفال", "طبيب أطفال", "لقاح"],
    type: "pediatrie",
    floor: 1,
    zone: "C",
    color: "#af52de",
    nodeId: "node_pediatrie",
    accessible: true,
    descFR: "Consultations et hospitalisations pour enfants.",
    descAR: "عيادات واستشفاء للأطفال."
  },
  {
    id: "cardiologie",
    code: "CAR",
    nomFR: "Cardiologie & Rythmologie",
    nomAR: "طب أمراض القلب والشرايين",
    aliasesFR: ["coeur", "tension", "electrocardiogramme", "ecg", "infarctus"],
    aliasesAR: ["قلب", "ضغط", "تخطيط القلب", "شرايين", "جلطة"],
    type: "cardiologie",
    floor: 2,
    zone: "D",
    color: "#34c759",
    nodeId: "node_cardiologie",
    accessible: true,
    descFR: "Pathologies cardiaques et vasculaires.",
    descAR: "أمراض القلب والأوعية الدموية."
  },
  {
    id: "cafeteria",
    code: "CAF",
    nomFR: "Cafétéria & Boutique",
    nomAR: "المقهى والمحل",
    aliasesFR: ["cafe", "repas", "manger", "boire", "journal", "sandwich", "boutique"],
    aliasesAR: ["قهوة", "أكل", "شرب", "جريدة", "شطيرة", "محل", "غداء"],
    type: "service",
    floor: 0,
    zone: "E",
    color: "#ffcc00",
    nodeId: "node_cafeteria",
    accessible: true,
    descFR: "Restauration rapide, boissons et presse.",
    descAR: "وجبات خفيفة، مشروبات وصحف."
  },
  {
    id: "admissions",
    code: "ADM",
    nomFR: "Admissions & Caisse",
    nomAR: "القبول والصندوق",
    aliasesFR: ["dossier", "payement", "caisse", "entree", "facture", "secrétariat"],
    aliasesAR: ["دخول", "دفع", "صندوق", "فاتورة", "تسجيل", "ملف"],
    type: "service",
    floor: 0,
    zone: "E",
    color: "#ffcc00",
    nodeId: "node_admissions",
    accessible: true,
    descFR: "Formalités administratives et facturation.",
    descAR: "الإجراءات الإدارية والفوترة."
  },
  {
    id: "administration",
    code: "DIR",
    nomFR: "Direction Générale",
    nomAR: "الإدارة العامة",
    aliasesFR: ["bureau", "directeur", "drh", "secretariat", "administration"],
    aliasesAR: ["مكتب", "مدير", "الموارد البشرية", "سكرتارية", "إدارة"],
    type: "service",
    floor: 2,
    zone: "D",
    color: "#34c759",
    nodeId: "node_administration",
    accessible: true,
    descFR: "Bureaux administratifs et direction de l'établissement.",
    descAR: "المكاتب الإدارية وإدارة المؤسسة."
  }
];

// Nœuds du graphe de navigation (positionnement 3D x, y, z)
// x: gauche/droite, y: hauteur (étage), z: avant/arrière
export const nodes = {
  // --- REZ-DE-CHAUSSÉE (y = 0) ---
  "node_borne": { id: "node_borne", label: "Borne Interactive", x: 0, y: 0, z: 0, floor: 0, type: "borne" },
  "node_rdc_hall": { id: "node_rdc_hall", label: "Hall Principal RDC", x: 0, y: 0, z: -3, floor: 0, type: "intersection" },
  "node_rdc_corridor_left": { id: "node_rdc_corridor_left", label: "Couloir Gauche RDC", x: -6, y: 0, z: -3, floor: 0, type: "intersection" },
  "node_rdc_corridor_right": { id: "node_rdc_corridor_right", label: "Couloir Droite RDC", x: 6, y: 0, z: -3, floor: 0, type: "intersection" },
  
  "node_urgences": { id: "node_urgences", label: "Urgences", x: -10, y: 0, z: -3, floor: 0, type: "room" },
  "node_imagerie": { id: "node_imagerie", label: "Imagerie", x: 6, y: 0, z: -8, floor: 0, type: "room" },
  "node_laboratoire": { id: "node_laboratoire", label: "Laboratoire", x: 10, y: 0, z: -3, floor: 0, type: "room" },
  "node_cafeteria": { id: "node_cafeteria", label: "Cafétéria", x: -4, y: 0, z: 2, floor: 0, type: "room" },
  "node_admissions": { id: "node_admissions", label: "Admissions & Caisse", x: 4, y: 0, z: 2, floor: 0, type: "room" },
  
  // Raccordements verticaux au RDC
  "node_rdc_elevator": { id: "node_rdc_elevator", label: "Ascenseur Principal RDC", x: -2, y: 0, z: -7, floor: 0, type: "elevator" },
  "node_rdc_stairs": { id: "node_rdc_stairs", label: "Escalier RDC", x: 2, y: 0, z: -7, floor: 0, type: "stairs" },

  // --- PREMIER ÉTAGE (y = 4) ---
  "node_e1_hall": { id: "node_e1_hall", label: "Palier 1er Étage", x: 0, y: 4, z: -6, floor: 1, type: "intersection" },
  "node_e1_corridor_left": { id: "node_e1_corridor_left", label: "Couloir Gauche R1", x: -6, y: 4, z: -6, floor: 1, type: "intersection" },
  "node_e1_corridor_right": { id: "node_e1_corridor_right", label: "Couloir Droite R1", x: 6, y: 4, z: -6, floor: 1, type: "intersection" },
  
  "node_maternite": { id: "node_maternite", label: "Maternité", x: -9, y: 4, z: -6, floor: 1, type: "room" },
  "node_pediatrie": { id: "node_pediatrie", label: "Pédiatrie", x: 6, y: 4, z: -1, floor: 1, type: "room" },
  
  // Raccordements verticaux au R1
  "node_e1_elevator": { id: "node_e1_elevator", label: "Ascenseur Principal R1", x: -2, y: 4, z: -7, floor: 1, type: "elevator" },
  "node_e1_stairs": { id: "node_e1_stairs", label: "Escalier R1", x: 2, y: 4, z: -7, floor: 1, type: "stairs" },

  // --- DEUXIÈME ÉTAGE (y = 8) ---
  "node_e2_hall": { id: "node_e2_hall", label: "Palier 2e Étage", x: 0, y: 8, z: -6, floor: 2, type: "intersection" },
  "node_e2_corridor_left": { id: "node_e2_corridor_left", label: "Couloir Gauche R2", x: -5, y: 8, z: -6, floor: 2, type: "intersection" },
  "node_e2_corridor_right": { id: "node_e2_corridor_right", label: "Couloir Droite R2", x: 5, y: 8, z: -6, floor: 2, type: "intersection" },
  
  "node_cardiologie": { id: "node_cardiologie", label: "Cardiologie", x: -8, y: 8, z: -6, floor: 2, type: "room" },
  "node_administration": { id: "node_administration", label: "Administration", x: 5, y: 8, z: -10, floor: 2, type: "room" },
  
  // Raccordements verticaux au R2
  "node_e2_elevator": { id: "node_e2_elevator", label: "Ascenseur Principal R2", x: -2, y: 8, z: -7, floor: 2, type: "elevator" },
  "node_e2_stairs": { id: "node_e2_stairs", label: "Escalier R2", x: 2, y: 8, z: -7, floor: 2, type: "stairs" }
};

// Liaisons du graphe avec indication PMR (accessible aux fauteuils roulants)
export const edges = [
  // --- REZ-DE-CHAUSSÉE ---
  { source: "node_borne", target: "node_rdc_hall", distance: 3, pmr: true, type: "walkway" },
  { source: "node_borne", target: "node_cafeteria", distance: 5, pmr: true, type: "walkway" },
  { source: "node_borne", target: "node_admissions", distance: 5, pmr: true, type: "walkway" },
  
  { source: "node_rdc_hall", target: "node_rdc_corridor_left", distance: 6, pmr: true, type: "walkway" },
  { source: "node_rdc_hall", target: "node_rdc_corridor_right", distance: 6, pmr: true, type: "walkway" },
  { source: "node_rdc_hall", target: "node_rdc_elevator", distance: 4.5, pmr: true, type: "walkway" },
  { source: "node_rdc_hall", target: "node_rdc_stairs", distance: 4.5, pmr: true, type: "walkway" },
  
  { source: "node_rdc_corridor_left", target: "node_urgences", distance: 4, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_right", target: "node_laboratoire", distance: 4, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_right", target: "node_imagerie", distance: 5, pmr: true, type: "walkway" },

  // --- PREMIER ÉTAGE ---
  { source: "node_e1_hall", target: "node_e1_corridor_left", distance: 6, pmr: true, type: "walkway" },
  { source: "node_e1_hall", target: "node_e1_corridor_right", distance: 6, pmr: true, type: "walkway" },
  { source: "node_e1_hall", target: "node_e1_elevator", distance: 2.2, pmr: true, type: "walkway" },
  { source: "node_e1_hall", target: "node_e1_stairs", distance: 2.2, pmr: true, type: "walkway" },
  
  { source: "node_e1_corridor_left", target: "node_maternite", distance: 3, pmr: true, type: "walkway" },
  { source: "node_e1_corridor_right", target: "node_pediatrie", distance: 5, pmr: true, type: "walkway" },

  // --- DEUXIÈME ÉTAGE ---
  { source: "node_e2_hall", target: "node_e2_corridor_left", distance: 5, pmr: true, type: "walkway" },
  { source: "node_e2_hall", target: "node_e2_corridor_right", distance: 5, pmr: true, type: "walkway" },
  { source: "node_e2_hall", target: "node_e2_elevator", distance: 2.2, pmr: true, type: "walkway" },
  { source: "node_e2_hall", target: "node_e2_stairs", distance: 2.2, pmr: true, type: "walkway" },
  
  { source: "node_e2_corridor_left", target: "node_cardiologie", distance: 3, pmr: true, type: "walkway" },
  { source: "node_e2_corridor_right", target: "node_administration", distance: 4.5, pmr: true, type: "walkway" },

  // --- LIAISONS VERTICALES (Ascenseurs - PMR OK) ---
  { source: "node_rdc_elevator", target: "node_e1_elevator", distance: 4, pmr: true, type: "elevator" },
  { source: "node_e1_elevator", target: "node_e2_elevator", distance: 4, pmr: true, type: "elevator" },

  // --- LIAISONS VERTICALES (Escaliers - PMR NON) ---
  { source: "node_rdc_stairs", target: "node_e1_stairs", distance: 4, pmr: false, type: "stairs" },
  { source: "node_e1_stairs", target: "node_e2_stairs", distance: 4, pmr: false, type: "stairs" }
];

/**
 * Algorithme de Dijkstra pour trouver le plus court chemin
 * @param {string} startNodeId 
 * @param {string} endNodeId 
 * @param {boolean} pmrOnly - si vrai, exclut les chemins non accessibles
 * @param {boolean} isElevatorBroken - si vrai, exclut les ascenseurs
 * @param {boolean} isStairsBroken - si vrai, exclut les escaliers
 * @param {object} customNodes - noeuds personnalisés
 * @param {array} customEdges - liaisons personnalisées
 * @param {array} customDestinations - destinations personnalisées
 */
export function calculateRoute(
  startNodeId,
  endNodeId,
  pmrOnly = false,
  isElevatorBroken = false,
  isStairsBroken = false,
  customNodes = null,
  customEdges = null,
  customDestinations = null
) {
  const activeNodes = customNodes || nodes;
  const activeEdges = customEdges || edges;
  const activeDestinations = customDestinations || destinations;

  // Construction de la liste d'adjacence à la volée en fonction du filtre PMR et des pannes
  const graph = {};
  
  // Initialiser tous les nœuds dans la liste d'adjacence
  Object.keys(activeNodes).forEach(id => {
    graph[id] = {};
  });

  // Ajouter les liaisons bidirectionnelles autorisées
  activeEdges.forEach(edge => {
    // S'assurer que les noeuds source/cible de la liaison existent dans activeNodes
    if (!activeNodes[edge.source] || !activeNodes[edge.target]) return;

    // Si le parcours est PMR et que l'arête n'est pas accessible, on l'ignore
    if (pmrOnly && !edge.pmr) return;

    // Si l'ascenseur est en panne et que l'arête est un ascenseur, on l'ignore
    if (isElevatorBroken && edge.type === "elevator") return;

    // Si l'escalier est en panne et que l'arête est un escalier, on l'ignore
    if (isStairsBroken && edge.type === "stairs") return;

    graph[edge.source][edge.target] = edge.distance;
    graph[edge.target][edge.source] = edge.distance;
  });

  // Algorithme de Dijkstra
  const distances = {};
  const previous = {};
  const queue = [];

  Object.keys(activeNodes).forEach(nodeId => {
    if (nodeId === startNodeId) {
      distances[nodeId] = 0;
      queue.push({ id: nodeId, dist: 0 });
    } else {
      distances[nodeId] = Infinity;
      queue.push({ id: nodeId, dist: Infinity });
    }
    previous[nodeId] = null;
  });

  while (queue.length > 0) {
    // Trier la file pour trouver le nœud avec la plus petite distance
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift();
    const u = current.id;

    if (distances[u] === Infinity) break;
    if (u === endNodeId) break; // Arrivé à destination

    const neighbors = graph[u] || {};
    Object.keys(neighbors).forEach(v => {
      const alt = distances[u] + neighbors[v];
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = u;
        
        // Mettre à jour la distance dans la queue
        const index = queue.findIndex(item => item.id === v);
        if (index !== -1) {
          queue[index].dist = alt;
        }
      }
    });
  }

  // Reconstituer le chemin
  const pathNodeIds = [];
  let curr = endNodeId;
  
  if (previous[curr] !== null || curr === startNodeId) {
    while (curr !== null) {
      pathNodeIds.unshift(curr);
      curr = previous[curr];
    }
  }

  // Si aucun itinéraire n'est trouvé
  if (pathNodeIds.length === 0 || pathNodeIds[0] !== startNodeId) {
    return {
      path: [],
      instructionsFR: ["Aucun itinéraire trouvé pour ce parcours."],
      instructionsAR: ["لم يتم العثور على مسار لهذه الرحلة."],
      totalDistance: 0
    };
  }

  // Générer des instructions de navigation
  const instructionsFR = [];
  const instructionsAR = [];
  let currentFloor = activeNodes[startNodeId] ? activeNodes[startNodeId].floor : 0;

  // Introduction
  instructionsFR.push("Départ de votre position actuelle.");
  instructionsAR.push("الانطلاق من موقعك الحالي.");

  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const uId = pathNodeIds[i];
    const vId = pathNodeIds[i + 1];
    const u = activeNodes[uId];
    const v = activeNodes[vId];

    if (!u || !v) continue;

    // Trouver le type d'arête entre u et v
    const edge = activeEdges.find(e => 
      (e.source === uId && e.target === vId) || 
      (e.source === vId && e.target === uId)
    );

    if (edge) {
      if (u.floor !== v.floor) {
        const floorNameFR = v.floor === 0 ? "Rez-de-chaussée" : v.floor === 1 ? "1er Étage" : "2e Étage";
        const floorNameAR = v.floor === 0 ? "الطابق الأرضي" : v.floor === 1 ? "الطابق الأول" : "الطابق الثاني";
        instructionsFR.push(`Prenez l'ascenseur ou l'escalier jusqu'au ${floorNameFR}.`);
        instructionsAR.push(`خذ المصعد أو السلالم إلى ${floorNameAR}.`);
        currentFloor = v.floor;
      } else {
        // Guidage horizontal simple
        if (v.type === "room") {
          const dest = activeDestinations.find(d => d.nodeId === vId);
          const nameFR = dest ? dest.nomFR : v.label;
          const nameAR = dest ? dest.nomAR : v.label;
          const zoneColor = dest ? (dest.zone === "A" ? "Rouge" : dest.zone === "B" ? "Bleue" : dest.zone === "C" ? "Violette" : dest.zone === "D" ? "Verte" : "Jaune") : "";
          const zoneColorAR = dest ? (dest.zone === "A" ? "الحمراء" : dest.zone === "B" ? "الزرقاء" : dest.zone === "C" ? "البنفسجية" : dest.zone === "D" ? "الخضراء" : "الصفراء") : "";

          instructionsFR.push(`Votre destination, ${nameFR}, est juste en face de vous, en Zone ${zoneColor} (Aile ${dest ? dest.zone : ""}).`);
          instructionsAR.push(`وجهتكم، ${nameAR}، أمامكم مباشرة، في المنطقة ${zoneColorAR} (الجناح ${dest ? dest.zone : ""}).`);
        } else if (u.type === "borne" && v.type === "intersection") {
          instructionsFR.push("Dirigez-vous vers le centre du hall d'accueil.");
          instructionsAR.push("اتجه نحو وسط قاعة الاستقبال.");
        } else if (v.type === "intersection" && v.label.includes("Couloir")) {
          instructionsFR.push(`Continuez dans le couloir à ${v.label.includes("Gauche") ? "gauche" : "droite"}.`);
          instructionsAR.push(`واصل السير في الممر على ${v.label.includes("Gauche") ? "اليسار" : "اليمين"}.`);
        }
      }
    }
  }

  // Conclusion
  instructionsFR.push("Vous êtes arrivé à votre destination.");
  instructionsAR.push("لقد وصلت إلى وجهتك.");

  return {
    path: pathNodeIds.map(id => activeNodes[id]),
    instructionsFR,
    instructionsAR,
    totalDistance: distances[endNodeId]
  };
}
