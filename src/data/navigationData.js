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
    id: "restaurant",
    code: "RES",
    nomFR: "Restaurant de l'Hôpital",
    nomAR: "مطعم المستشفى",
    aliasesFR: ["restaurant", "cafet", "cafeteria", "repas", "manger", "boire", "dejeuner"],
    aliasesAR: ["مطعم", "أكل", "شرب", "غداء", "عشاء", "قهوة"],
    type: "service",
    floor: 0,
    zone: "E",
    color: "#ffcc00",
    nodeId: "node_restaurant",
    accessible: true,
    descFR: "Espace restauration et détente pour les visiteurs.",
    descAR: "مساحة لتناول الطعام والاسترخاء للزوار."
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
    id: "admin_rdc",
    code: "DIR",
    nomFR: "Unité Administrative (RDC)",
    nomAR: "الوحدة الإدارية (الطابق الأرضي)",
    aliasesFR: ["bureau", "administration", "secrétariat", "ressources humaines", "direction"],
    aliasesAR: ["مكتب", "إدارة", "سكرتارية", "موارد بشرية", "توجيه"],
    type: "service",
    floor: 0,
    zone: "F",
    color: "#34c759",
    nodeId: "node_admin_rdc",
    accessible: true,
    descFR: "Bureaux administratifs et gestion courante au RDC.",
    descAR: "المكاتب الإدارية والتسيير اليومي بالطابق الأرضي."
  },
  {
    id: "administration",
    code: "DIR",
    nomFR: "Direction Générale (R+2)",
    nomAR: "الإدارة العامة (R+2)",
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
  "node_borne": { id: "node_borne", label: "Borne Interactive", x: -5, y: 0, z: 1, floor: 0, type: "borne" },
  "node_rdc_hall": { id: "node_rdc_hall", label: "Hall Principal RDC", x: -2, y: 0, z: 1, floor: 0, type: "intersection" },
  
  "node_rdc_corridor_urgences": { id: "node_rdc_corridor_urgences", label: "Couloir Urgences RDC", x: -7, y: 0, z: -4, floor: 0, type: "intersection" },
  "node_urgences": { id: "node_urgences", label: "Urgences", x: -10, y: 0, z: -10, floor: 0, type: "room" },
  
  "node_rdc_corridor_imagerie": { id: "node_rdc_corridor_imagerie", label: "Couloir Imagerie RDC", x: 11, y: 0, z: -4, floor: 0, type: "intersection" },
  "node_imagerie": { id: "node_imagerie", label: "Imagerie", x: 11, y: 0, z: -12, floor: 0, type: "room" },
  "node_laboratoire": { id: "node_laboratoire", label: "Laboratoire", x: 11, y: 0, z: -2, floor: 0, type: "room" },
  
  "node_rdc_corridor_admissions": { id: "node_rdc_corridor_admissions", label: "Couloir Admissions RDC", x: 3, y: 0, z: 1, floor: 0, type: "intersection" },
  "node_admissions": { id: "node_admissions", label: "Admissions & Caisse", x: 3, y: 0, z: -2, floor: 0, type: "room" },
  
  "node_rdc_corridor_restaurant": { id: "node_rdc_corridor_restaurant", label: "Couloir Restaurant RDC", x: -8, y: 0, z: 5, floor: 0, type: "intersection" },
  "node_restaurant": { id: "node_restaurant", label: "Restaurant", x: -11, y: 0, z: 6, floor: 0, type: "room" },
  
  "node_rdc_corridor_admin": { id: "node_rdc_corridor_admin", label: "Couloir Admin RDC", x: -7, y: 0, z: 12, floor: 0, type: "intersection" },
  "node_admin_rdc": { id: "node_admin_rdc", label: "Unité Administrative", x: -9, y: 0, z: 13, floor: 0, type: "room" },

  // Cages de raccordement vertical au RDC
  "node_rdc_elevator": { id: "node_rdc_elevator", label: "Ascenseur Central RDC", x: -2, y: 0, z: -7, floor: 0, type: "elevator" },
  "node_rdc_stairs": { id: "node_rdc_stairs", label: "Escalier Central RDC", x: 2, y: 0, z: -7, floor: 0, type: "stairs" },
  "node_rdc_elevator_sw": { id: "node_rdc_elevator_sw", label: "Ascenseur Sud-Ouest RDC", x: -9, y: 0, z: 10, floor: 0, type: "elevator" },
  "node_rdc_elevator_east": { id: "node_rdc_elevator_east", label: "Ascenseur Est RDC", x: 12, y: 0, z: 3, floor: 0, type: "elevator" },

  // --- PREMIER ÉTAGE (y = 4) ---
  "node_e1_hall": { id: "node_e1_hall", label: "Palier 1er Étage", x: 0, y: 4, z: -6, floor: 1, type: "intersection" },
  "node_e1_corridor_left": { id: "node_e1_corridor_left", label: "Couloir Gauche R1", x: -6, y: 4, z: -6, floor: 1, type: "intersection" },
  "node_e1_corridor_right": { id: "node_e1_corridor_right", label: "Couloir Droite R1", x: 6, y: 4, z: -6, floor: 1, type: "intersection" },
  
  "node_maternite": { id: "node_maternite", label: "Maternité", x: -9, y: 4, z: -6, floor: 1, type: "room" },
  "node_pediatrie": { id: "node_pediatrie", label: "Pédiatrie", x: 6, y: 4, z: -1, floor: 1, type: "room" },
  
  // Raccordements verticaux au R1
  "node_e1_elevator": { id: "node_e1_elevator", label: "Ascenseur Central R1", x: -2, y: 4, z: -7, floor: 1, type: "elevator" },
  "node_e1_stairs": { id: "node_e1_stairs", label: "Escalier Central R1", x: 2, y: 4, z: -7, floor: 1, type: "stairs" },
  "node_e1_elevator_sw": { id: "node_e1_elevator_sw", label: "Ascenseur Sud-Ouest R1", x: -9, y: 4, z: 10, floor: 1, type: "elevator" },
  "node_e1_elevator_east": { id: "node_e1_elevator_east", label: "Ascenseur Est R1", x: 12, y: 4, z: 3, floor: 1, type: "elevator" },

  // --- DEUXIÈME ÉTAGE (y = 8) ---
  "node_e2_hall": { id: "node_e2_hall", label: "Palier 2e Étage", x: 0, y: 8, z: -6, floor: 2, type: "intersection" },
  "node_e2_corridor_left": { id: "node_e2_corridor_left", label: "Couloir Gauche R2", x: -5, y: 8, z: -6, floor: 2, type: "intersection" },
  "node_e2_corridor_right": { id: "node_e2_corridor_right", label: "Couloir Droite R2", x: 5, y: 8, z: -6, floor: 2, type: "intersection" },
  
  "node_cardiologie": { id: "node_cardiologie", label: "Cardiologie", x: -8, y: 8, z: -6, floor: 2, type: "room" },
  "node_administration": { id: "node_administration", label: "Administration", x: 5, y: 8, z: -10, floor: 2, type: "room" },
  
  // Raccordements verticaux au R2
  "node_e2_elevator": { id: "node_e2_elevator", label: "Ascenseur Central R2", x: -2, y: 8, z: -7, floor: 2, type: "elevator" },
  "node_e2_stairs": { id: "node_e2_stairs", label: "Escalier Central R2", x: 2, y: 8, z: -7, floor: 2, type: "stairs" },
  "node_e2_elevator_sw": { id: "node_e2_elevator_sw", label: "Ascenseur Sud-Ouest R2", x: -9, y: 8, z: 10, floor: 2, type: "elevator" },
  "node_e2_elevator_east": { id: "node_e2_elevator_east", label: "Ascenseur Est R2", x: 12, y: 8, z: 3, floor: 2, type: "elevator" }
};

// Liaisons du graphe avec indication PMR (accessible aux fauteuils roulants)
export const edges = [
  // --- REZ-DE-CHAUSSÉE (Couloirs et liaisons réelles contournant les patios) ---
  { source: "node_borne", target: "node_rdc_hall", distance: 3, pmr: true, type: "walkway" },
  
  { source: "node_rdc_hall", target: "node_rdc_corridor_urgences", distance: 7, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_urgences", target: "node_urgences", distance: 7, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_urgences", target: "node_rdc_elevator", distance: 6, pmr: true, type: "walkway" },
  
  { source: "node_rdc_hall", target: "node_rdc_elevator", distance: 8, pmr: true, type: "walkway" },
  { source: "node_rdc_hall", target: "node_rdc_stairs", distance: 8, pmr: true, type: "walkway" },
  
  { source: "node_rdc_hall", target: "node_rdc_corridor_admissions", distance: 5, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_admissions", target: "node_admissions", distance: 3, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_admissions", target: "node_rdc_corridor_imagerie", distance: 8, pmr: true, type: "walkway" },
  
  { source: "node_rdc_corridor_imagerie", target: "node_imagerie", distance: 8, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_imagerie", target: "node_laboratoire", distance: 2, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_imagerie", target: "node_rdc_elevator_east", distance: 7, pmr: true, type: "walkway" },
  
  { source: "node_rdc_hall", target: "node_rdc_corridor_restaurant", distance: 7, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_restaurant", target: "node_restaurant", distance: 4, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_restaurant", target: "node_rdc_elevator_sw", distance: 5, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_restaurant", target: "node_rdc_corridor_admin", distance: 7, pmr: true, type: "walkway" },
  
  { source: "node_rdc_corridor_admin", target: "node_admin_rdc", distance: 3, pmr: true, type: "walkway" },
  { source: "node_rdc_corridor_admin", target: "node_rdc_elevator_sw", distance: 3, pmr: true, type: "walkway" },

  // --- PREMIER ÉTAGE ---
  { source: "node_e1_hall", target: "node_e1_corridor_left", distance: 6, pmr: true, type: "walkway" },
  { source: "node_e1_hall", target: "node_e1_corridor_right", distance: 6, pmr: true, type: "walkway" },
  { source: "node_e1_hall", target: "node_e1_elevator", distance: 2.2, pmr: true, type: "walkway" },
  { source: "node_e1_hall", target: "node_e1_stairs", distance: 2.2, pmr: true, type: "walkway" },
  { source: "node_e1_corridor_left", target: "node_maternite", distance: 3, pmr: true, type: "walkway" },
  { source: "node_e1_corridor_right", target: "node_pediatrie", distance: 5, pmr: true, type: "walkway" },
  
  { source: "node_maternite", target: "node_e1_elevator_sw", distance: 7, pmr: true, type: "walkway" },
  { source: "node_pediatrie", target: "node_e1_elevator_east", distance: 7, pmr: true, type: "walkway" },

  // --- DEUXIÈME ÉTAGE ---
  { source: "node_e2_hall", target: "node_e2_corridor_left", distance: 5, pmr: true, type: "walkway" },
  { source: "node_e2_hall", target: "node_e2_corridor_right", distance: 5, pmr: true, type: "walkway" },
  { source: "node_e2_hall", target: "node_e2_elevator", distance: 2.2, pmr: true, type: "walkway" },
  { source: "node_e2_hall", target: "node_e2_stairs", distance: 2.2, pmr: true, type: "walkway" },
  { source: "node_e2_corridor_left", target: "node_cardiologie", distance: 3, pmr: true, type: "walkway" },
  { source: "node_e2_corridor_right", target: "node_administration", distance: 4.5, pmr: true, type: "walkway" },
  
  { source: "node_cardiologie", target: "node_e2_elevator_sw", distance: 7, pmr: true, type: "walkway" },
  { source: "node_administration", target: "node_e2_elevator_east", distance: 7, pmr: true, type: "walkway" },

  // --- LIAISONS VERTICALES (Ascenseur Central - PMR OK) ---
  { source: "node_rdc_elevator", target: "node_e1_elevator", distance: 4, pmr: true, type: "elevator" },
  { source: "node_e1_elevator", target: "node_e2_elevator", distance: 4, pmr: true, type: "elevator" },

  // --- LIAISONS VERTICALES (Ascenseur Sud-Ouest - PMR OK) ---
  { source: "node_rdc_elevator_sw", target: "node_e1_elevator_sw", distance: 4, pmr: true, type: "elevator" },
  { source: "node_e1_elevator_sw", target: "node_e2_elevator_sw", distance: 4, pmr: true, type: "elevator" },

  // --- LIAISONS VERTICALES (Ascenseur Est - PMR OK) ---
  { source: "node_rdc_elevator_east", target: "node_e1_elevator_east", distance: 4, pmr: true, type: "elevator" },
  { source: "node_e1_elevator_east", target: "node_e2_elevator_east", distance: 4, pmr: true, type: "elevator" },

  // --- LIAISONS VERTICALES (Escalier Central - PMR NON) ---
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
 */
export function calculateRoute(startNodeId, endNodeId, pmrOnly = false, isElevatorBroken = false, isStairsBroken = false) {
  // Construction de la liste d'adjacence à la volée en fonction du filtre PMR et des pannes
  const graph = {};
  
  // Initialiser tous les nœuds dans la liste d'adjacence
  Object.keys(nodes).forEach(id => {
    graph[id] = {};
  });

  // Ajouter les liaisons bidirectionnelles autorisées
  edges.forEach(edge => {
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

  Object.keys(nodes).forEach(nodeId => {
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
  let currentFloor = nodes[startNodeId].floor;

  // Introduction
  instructionsFR.push("Départ de votre position actuelle.");
  instructionsAR.push("الانطلاق من موقعك الحالي.");

  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const uId = pathNodeIds[i];
    const vId = pathNodeIds[i + 1];
    const u = nodes[uId];
    const v = nodes[vId];

    // Trouver le type d'arête entre u et v
    const edge = edges.find(e => 
      (e.source === uId && e.target === vId) || 
      (e.source === vId && e.target === uId)
    );

    if (edge) {
      if (edge.type === "elevator" && u.floor !== v.floor) {
        instructionsFR.push(`Prenez l'un des ascenseurs jusqu'au ${v.floor === 0 ? "Rez-de-chaussée" : v.floor === 1 ? "1er étage" : "2e étage"}.`);
        instructionsAR.push(`خذ أحد المصاعد إلى ${v.floor === 0 ? "الطابق الأرضي" : v.floor === 1 ? "الطابق الأول" : "الطابق الثاني"}.`);
        currentFloor = v.floor;
      } else if (edge.type === "stairs" && u.floor !== v.floor) {
        instructionsFR.push(`Prenez l'escalier jusqu'au ${v.floor === 0 ? "Rez-de-chaussée" : v.floor === 1 ? "1er étage" : "2e étage"}.`);
        instructionsAR.push(`خذ السلالم إلى ${v.floor === 0 ? "الطابق الأرضي" : v.floor === 1 ? "الطابق الأول" : "الطابق الثاني"}.`);
        currentFloor = v.floor;
      } else {
        // Guidage horizontal simple
        if (v.type === "room") {
          const dest = destinations.find(d => d.nodeId === vId);
          const nameFR = dest ? dest.nomFR : v.label;
          const nameAR = dest ? dest.nomAR : v.label;
          const zoneColor = dest ? (dest.zone === "A" ? "Rouge" : dest.zone === "B" ? "Bleue" : dest.zone === "C" ? "Violette" : dest.zone === "D" ? "Verte" : dest.zone === "E" ? "Jaune" : "Orange") : "";
          const zoneColorAR = dest ? (dest.zone === "A" ? "الحمراء" : dest.zone === "B" ? "الزرقاء" : dest.zone === "C" ? "البنفسجية" : dest.zone === "D" ? "الخضراء" : dest.zone === "E" ? "الصفراء" : "البرتقالية") : "";

          instructionsFR.push(`Votre destination, ${nameFR}, est juste en face de vous, en Zone ${zoneColor} (Aile ${dest ? dest.zone : ""}).`);
          instructionsAR.push(`وجهتكم، ${nameAR}، أمامكم مباشرة، في المنطقة ${zoneColorAR} (الجناح ${dest ? dest.zone : ""}).`);
        } else if (u.type === "borne" && v.type === "intersection") {
          instructionsFR.push("Dirigez-vous vers le centre du hall d'accueil.");
          instructionsAR.push("اتجه نحو وسط قاعة الاستقبال.");
        } else if (v.type === "intersection" && v.label.includes("Couloir")) {
          instructionsFR.push(`Continuez le long du couloir en suivant la signalisation.`);
          instructionsAR.push(`واصل السير في الممر باتباع الإشارات.`);
        }
      }
    }
  }

  // Conclusion
  instructionsFR.push("Vous êtes arrivé à votre destination.");
  instructionsAR.push("لقد وصلت إلى وجهتك.");

  return {
    path: pathNodeIds.map(id => nodes[id]),
    instructionsFR,
    instructionsAR,
    totalDistance: distances[endNodeId]
  };
}
