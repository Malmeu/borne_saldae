# Cahier des charges — Borne interactive d’orientation hospitalière 3D avec Three.js

## 1. Présentation du projet

Le présent cahier des charges définit les exigences fonctionnelles, techniques, UX, graphiques, organisationnelles et opérationnelles d’une application de borne interactive d’orientation pour un hôpital. L’objectif est de concevoir une expérience de navigation simple, fiable et inclusive permettant aux visiteurs, patients, accompagnants et nouveaux agents de trouver rapidement un service, un étage, une salle ou un point d’intérêt à l’intérieur de l’établissement.[cite:21][cite:18]

Le projet repose sur une visualisation 3D des plans par étage, exploitée dans une interface tactile grand public, avec moteur de rendu basé sur Three.js. La borne devra permettre la recherche d’une destination, l’affichage d’un itinéraire clair, la compréhension des changements d’étage, et une continuité entre logique spatiale, signalétique physique et contenus numériques.[cite:18][cite:21]

Ce système doit être pensé comme une composante du dispositif global de wayfinding de l’hôpital, et non comme un simple écran cartographique. Les sources consultées soulignent qu’un bon wayfinding combine processus, environnement, communication et outils, avec une attention particulière au stress des usagers, à la cohérence des messages, à l’accessibilité et à la maintenabilité dans le temps.[cite:21][cite:18]

## 2. Contexte et problématique

L’hôpital est un environnement complexe, souvent composé de plusieurs niveaux, ailes, zones techniques, services cliniques et parcours différenciés. Dans un tel contexte, une mauvaise orientation augmente le stress, retarde les rendez-vous, mobilise inutilement le personnel d’accueil et nuit à la perception globale de la qualité de service.[cite:21][cite:18]

Le projet vise donc à répondre aux problèmes suivants : difficulté à se repérer dans un bâtiment complexe, hétérogénéité des informations de circulation, dépendance excessive au personnel pour donner des directions, évolution fréquente des services, et besoin d’une interface compréhensible par des publics variés, y compris les personnes âgées, anxieuses, peu alphabétisées ou non francophones.[cite:21][cite:18]

L’application doit être conçue pour des utilisateurs n’ayant pas de connaissance préalable du bâtiment. Les recommandations de wayfinding en santé indiquent qu’il faut prioritairement servir les primo-visiteurs et les usagers ayant besoin de davantage d’information, tout en restant utile aux agents et aux visiteurs récurrents.[cite:21]

## 3. Vision produit

Le produit attendu est une borne tactile plein écran, installée à des points de décision majeurs de l’hôpital, par exemple le hall principal, les entrées de pôles, les ascenseurs principaux ou certaines jonctions de circulation. Ces emplacements sont considérés comme stratégiques car les guides de déploiement recommandent de positionner les kiosques précisément là où l’usager doit faire un choix de direction.[cite:18]

L’application devra permettre à un utilisateur de rechercher une destination par nom de service, spécialité, médecin, salle, étage ou mot-clé associé, puis de visualiser un parcours compréhensible sur un plan 3D orienté, avec mise en évidence du point de départ, du point d’arrivée, des étapes intermédiaires et des transitions inter-étages.[cite:18][cite:21]

Le rendu 3D doit être utilisé pour clarifier l’espace, notamment dans les bâtiments multi-étages, sans transformer l’expérience en visite immersive complexe. Les bonnes pratiques indiquent qu’une représentation 3D ou en perspective peut réduire la charge cognitive lorsqu’elle reste lisible, hiérarchisée et subordonnée à la mission de navigation.[cite:18]

## 4. Objectifs du projet

### 4.1 Objectifs métier

- Réduire le nombre de demandes directionnelles adressées aux agents d’accueil et au personnel soignant.[cite:18]
- Améliorer l’expérience patient et visiteur en diminuant l’anxiété liée à la recherche d’un service.[cite:21][cite:18]
- Réduire les retards aux consultations causés par des difficultés d’orientation.[cite:18]
- Moderniser l’image de l’établissement avec un dispositif numérique cohérent avec un hôpital moderne.[cite:18]
- Créer une base évolutive pouvant être étendue vers le mobile, les QR codes ou des intégrations futures.[cite:18][cite:21]

### 4.2 Objectifs utilisateurs

- Trouver rapidement une destination à partir d’un vocabulaire simple.[cite:21][cite:18]
- Comprendre immédiatement où l’on se trouve grâce à un marqueur “vous êtes ici” clair et orienté selon la position de la borne.[cite:18]
- Visualiser un trajet simple, sans surcharge d’informations.[cite:21][cite:18]
- Identifier facilement les ascenseurs, escaliers, accueils, sanitaires, urgences, laboratoire, imagerie, pharmacie, admissions et autres points clés grâce à une iconographie standardisée.[cite:18][cite:21]
- Bénéficier d’options d’accessibilité, notamment pour les parcours PMR et les interfaces à fort contraste.[cite:18][cite:21]

### 4.3 Objectifs techniques

- Disposer d’une application web robuste, exploitable sur borne tactile verrouillée en plein écran.[cite:18]
- Utiliser Three.js comme moteur d’affichage 3D principal pour les étages et les trajets.[cite:18]
- Structurer les données de destination et de navigation dans un modèle maintenable, modifiable sans refonte complète de l’application.[cite:18][cite:21]
- Prévoir un mécanisme de mise à jour centralisée du contenu, car les services hospitaliers évoluent dans le temps.[cite:18][cite:21]

## 5. Périmètre

### 5.1 Inclus dans le périmètre V1

- Application borne tactile interactive.
- Recherche de destination.
- Visualisation 3D des étages principaux.
- Calcul et affichage d’itinéraire entre borne et destination.
- Support des trajets multi-étages avec passage par ascenseur ou escalier.
- Filtres de parcours accessibles PMR si disponibles.[cite:18][cite:21]
- Interface multilingue de base, au minimum français et arabe, avec possibilité d’ajouter d’autres langues.[cite:18][cite:21]
- Écran d’accueil avec raccourcis vers les destinations les plus demandées.[cite:18]
- Mode veille / attract loop pour la borne lorsqu’elle n’est pas utilisée.[cite:18]
- Console d’administration simple pour mettre à jour destinations et libellés, ou à défaut un back-office minimal/API de contenu.[cite:18]

### 5.2 Hors périmètre V1 mais à anticiper

- Navigation indoor temps réel sur smartphone.
- Positionnement par balises, BLE, UWB ou Wi-Fi.
- Guidage vocal complet turn-by-turn sur mobile.
- Intégration SIH avancée, agenda temps réel, gestion des rendez-vous, appel patient.[cite:18]
- Synchronisation automatique avec annuaire médical ou système de planning.
- Réalité augmentée ou WebXR grand public.[cite:18]

## 6. Publics cibles

Les publics cibles principaux sont les patients, accompagnants, visiteurs, nouveaux agents, prestataires et toute personne découvrant l’établissement ou une partie inconnue de celui-ci. Les recommandations sectorielles insistent sur le fait que les utilisateurs “première visite” sont la cible prioritaire d’un système de wayfinding, car ils ont les besoins d’information les plus élevés.[cite:21]

Le système devra également prendre en compte les personnes ayant des besoins spécifiques : personnes âgées, personnes en situation de stress, personnes à mobilité réduite, personnes malvoyantes ou malentendantes, personnes avec faible littératie, et publics culturellement ou linguistiquement divers. Les guides de référence recommandent des messages simples, un codage lisible, des contrastes forts, la disponibilité de plusieurs langues et des parcours adaptés.[cite:21][cite:18]

## 7. Principes UX et design

L’interface devra être conçue pour minimiser la charge cognitive. Les sources recommandent des écrans propres, des boutons larges, une hiérarchie visuelle forte, une information délivrée au bon moment et une limitation volontaire de la densité informationnelle sur l’écran d’accueil.[cite:18][cite:21]

### 7.1 Principes directeurs

- Simplicité d’usage en moins de trois actions pour atteindre un résultat courant.[cite:18]
- Utilisation d’un langage courant plutôt que de terminologies médicales complexes quand cela est possible.[cite:21]
- Cohérence graphique avec la signalétique physique de l’hôpital, notamment couleurs de zones ou ailes, noms de pôles et repères spatiaux.[cite:18][cite:21]
- Mise en avant systématique du marqueur de position, du trajet et de la destination.[cite:18]
- Usage d’icônes universelles pour les points d’intérêt récurrents.[cite:18][cite:21]
- Très grands éléments tactiles adaptés à une borne publique.[cite:18]

### 7.2 Accessibilité

L’application devra intégrer des exigences d’accessibilité inspirées des principes de conception universelle, les documents consultés rappelant que la conformité minimale n’est pas suffisante et que l’objectif doit être l’autonomie, la dignité, la sécurité et la facilité d’usage.[cite:21]

Exigences minimales :

- Contrastes élevés.
- Taille de police importante et constante.
- Interface compatible avec usage debout et en fauteuil si le meuble de borne est adapté.[cite:18][cite:21]
- Parcours PMR distinct si des escaliers sont présents.[cite:18][cite:21]
- Icônes et pictogrammes compréhensibles sans lecture avancée.[cite:18][cite:21]
- Version multilingue.[cite:18][cite:21]
- Option audio à envisager en V2 pour certaines catégories d’usagers, les guides mentionnant l’intérêt des instructions parlées ou des supports audio dans certains cas.[cite:21]

## 8. Parcours utilisateur attendus

### 8.1 Parcours standard

1. L’utilisateur touche l’écran d’accueil.
2. Il choisit une destination via recherche, catégories ou raccourcis.
3. L’application affiche la fiche destination.
4. L’application affiche le parcours depuis la borne courante.
5. Si nécessaire, l’application montre le passage d’un étage à l’autre.
6. L’utilisateur peut visualiser les étapes successives ou un résumé simplifié.[cite:18][cite:21]

### 8.2 Parcours rapide

Depuis l’écran d’accueil, l’utilisateur sélectionne un raccourci de type “Urgences”, “Imagerie”, “Laboratoire”, “Admissions”, “Maternité”, “Consultations”, “Pharmacie”, “Caisse”, “Sortie”, “Ascenseurs”, ou tout autre point fortement recherché. Les analyses de wayfinding numérique recommandent d’exploiter les recherches fréquentes pour proposer des quick links sur l’écran d’entrée.[cite:18]

### 8.3 Parcours accessible PMR

L’utilisateur active un filtre “itinéraire accessible” qui force le calcul d’un trajet sans escalier et privilégiant ascenseurs, rampes et circulations adaptées. Les bonnes pratiques de wayfinding numérique recommandent explicitement le filtrage de routes accessibles pour les fauteuils roulants et autres besoins de mobilité.[cite:18]

### 8.4 Parcours multi-langue

L’utilisateur choisit sa langue dès l’accueil ou via un sélecteur toujours visible. Les contenus de navigation, les catégories, les intitulés de boutons et les consignes de parcours devront être traduits de manière cohérente et non littérale lorsque la compréhension l’exige.[cite:18][cite:21]

## 9. Fonctionnalités détaillées

### 9.1 Écran d’accueil

L’écran d’accueil devra comporter :

- Logo de l’hôpital.
- Message d’accueil simple.
- Champ de recherche central.
- Boutons de raccourcis vers les destinations les plus demandées.
- Accès au choix de langue.
- Accès au mode accessible / PMR.
- Aide ou tutoriel très court.[cite:18]

### 9.2 Moteur de recherche

Le moteur de recherche devra accepter les recherches par :

- Nom du service.
- Synonymes ou alias.
- Nom de médecin, si la donnée existe.
- Numéro de salle.
- Catégorie fonctionnelle.
- Mot-clé courant, par exemple “radio” pour “imagerie”.[cite:18][cite:21]

La recherche devra tolérer les fautes mineures, les variantes d’écriture et les abréviations courantes. Une logique de normalisation est fortement recommandée, car les guides insistent sur l’importance de la cohérence terminologique dans tout le système de wayfinding.[cite:21]

### 9.3 Fiche destination

Pour chaque destination, l’application devra afficher :

- Nom du service ou de la salle.
- Catégorie.
- Étage.
- Zone / aile / couleur.
- Numéro éventuel.
- Informations d’accès spécifiques, par exemple “prendre ascenseur B”.
- Disponibilité d’un parcours accessible.[cite:18][cite:21]

### 9.4 Visualisation 3D

La visualisation 3D devra être réalisée avec Three.js et chargera des modèles optimisés par étage ou par bloc. La 3D devra rester fonctionnelle, lisible et légère, avec hiérarchisation claire entre structure de bâtiment, circulations, repères, destination et chemin.[cite:18]

Exigences de rendu :

- Vue axonométrique ou perspective légère, plus lisible qu’une immersion libre complète pour une borne publique.[cite:18]
- Possibilité de surligner l’étage concerné.
- Affichage du chemin sous forme de ligne, ruban, halo ou animation simple.[cite:18]
- Mise en évidence du point “vous êtes ici”.[cite:18]
- Mise en évidence de la destination.
- Possibilité de masquer les étages non pertinents pour réduire la complexité visuelle.[cite:18]

### 9.5 Navigation inter-étages

Le système devra gérer explicitement les transitions entre niveaux via ascenseurs, escaliers et, si applicable, rampes ou passages spécifiques. Les guides hospitaliers rappellent que les points de transition mal visibles, comme les ascenseurs cachés ou couloirs tortueux, sont une source fréquente de difficulté de repérage.[cite:21]

### 9.6 Résumé pas-à-pas

En complément du trajet visuel, l’application devra proposer un résumé simple de type :

1. Aller tout droit jusqu’au hall B.
2. Prendre l’ascenseur B vers le 2e étage.
3. Sortir à gauche.
4. Le service d’imagerie se trouve en zone bleue.[cite:21][cite:18]

Cette synthèse textuelle devra rester courte, avec vocabulaire simple, conformément aux recommandations de simplification linguistique pour les usagers avec faible littératie ou en situation de stress.[cite:21]

### 9.7 Handoff mobile (option V1.1 ou V2)

Le système pourra générer un QR code permettant d’ouvrir l’itinéraire sur smartphone. Les références consultées considèrent cette continuité borne-mobile comme l’un des apports majeurs du wayfinding numérique moderne.[cite:18]

### 9.8 Mode inactif / attract loop

Lorsque la borne n’est pas utilisée, elle devra afficher un écran attractif institutionnel pouvant présenter les services majeurs, des messages d’information ou des consignes d’orientation générale, tout en permettant un retour immédiat à la fonction de recherche au premier toucher.[cite:18]

### 9.9 Mode urgence / override

Le système devra être conçu pour pouvoir basculer, à terme, en affichage d’urgence redirigeant les usagers vers les sorties sûres ou consignes temporaires. Les systèmes de wayfinding numériques sont souvent valorisés pour cette capacité d’override d’urgence.[cite:18]

## 10. Données et modélisation métier

Le système devra reposer sur un modèle de données normalisé. Les guides de déploiement recommandent de disposer de plans de qualité, de noms de salles et de départements standardisés, et d’une base de données mise à jour centralement.[cite:18]

### 10.1 Entités principales

- Bâtiment.
- Étage.
- Zone / aile.
- Point d’intérêt.
- Service.
- Salle.
- Noeud de navigation.
- Segment de parcours.
- Point de décision.
- Borne.
- Langue.
- Alias de recherche.[cite:18][cite:21]

### 10.2 Structure minimale d’une destination

| Champ | Description |
|---|---|
| id | Identifiant unique |
| code | Code interne ou code de repérage |
| nom | Intitulé principal |
| aliases | Synonymes de recherche |
| type | Service, salle, accueil, ascenseur, etc. |
| batiment | Bâtiment ou bloc |
| etage | Niveau concerné |
| zone | Zone, aile ou couleur |
| node_id | Noeud de rattachement dans le graphe |
| accessible | Disponibilité d’un accès PMR |
| langues | Libellés traduits |

La mise en place d’une stratégie de codage courte, claire et mémorisable peut améliorer la compréhension, en particulier pour les personnes avec faible littératie ou difficultés linguistiques, comme le relèvent les recommandations hospitalières.[cite:21]

### 10.3 Modèle de navigation

Le calcul d’itinéraire devra s’appuyer sur un graphe de navigation plutôt que sur une navigation libre dans toute la géométrie 3D. Cette approche est mieux adaptée à un hôpital car elle permet de maîtriser les chemins réels, d’intégrer les contraintes d’exploitation, de proposer des routes PMR et de maintenir le système lorsque les services changent.[cite:18][cite:21]

Le graphe devra contenir :

- Noeuds aux intersections, halls, accueils, ascenseurs, escaliers, entrées de service et points remarquables.[cite:18][cite:21]
- Arêtes avec distance, sens éventuel, accessibilité, temps estimé, et type de circulation.
- Liens inter-étages pour les transitions verticales.
- Règles métier permettant de privilégier certains parcours selon le profil d’accessibilité.[cite:18]

## 11. Exigences 3D et Three.js

### 11.1 Choix technologique

Le moteur de visualisation principal sera Three.js pour la scène 3D, la caméra, l’éclairage, la sélection d’objets, le rendu du chemin et les animations légères. Le projet devra préférer un pipeline GLTF/GLB pour les modèles, format largement utilisé dans les expériences web 3D car il facilite l’optimisation et le chargement dans un navigateur moderne.[cite:18]

### 11.2 Sources des plans

Les modèles 3D pourront être produits à partir de :

- plans DWG/DXF/PDF architecte,
- maquettes BIM si disponibles,
- modélisation manuelle simplifiée dans Blender ou logiciel équivalent,
- export d’éléments utiles uniquement, sans détails décoratifs inutiles.[cite:18][cite:21]

### 11.3 Contraintes de modélisation

- Simplifier la géométrie aux besoins de l’orientation.
- Séparer clairement structure, circulations, repères et objets interactifs.
- Prévoir un fichier ou groupe de fichiers par étage ou par zone.
- Nommer rigoureusement les objets selon une convention exploitable côté code.
- Prévoir différentes couches d’affichage pour filtrer ce qui est visible.[cite:18]

### 11.4 Interaction 3D

L’utilisateur final ne doit pas manipuler une caméra libre complexe comme dans un logiciel 3D. L’interface doit proposer une expérience cadrée, stable et robuste, avec éventuellement : zoom contrôlé, rotation limitée ou changement de niveau guidé, afin de préserver la clarté de lecture.[cite:18]

### 11.5 Optimisation

- Compression des modèles et textures.
- Nombre de polygones maîtrisé.
- Occlusion et masquage des niveaux non nécessaires.
- Chargement différé si plusieurs étages sont disponibles.
- Préchargement des ressources critiques pour limiter l’attente sur borne tactile.[cite:18]

## 12. Architecture applicative recommandée

### 12.1 Front-end

- React pour la structure applicative et les composants d’interface.
- Three.js pour la scène 3D.
- React Three Fiber possible si souhaité, mais non obligatoire.
- Moteur de recherche local ou via API selon volumétrie.
- Internationalisation structurée des libellés.[cite:18]

### 12.2 Back-end / contenu

Deux approches sont acceptables :

- API dédiée avec base de données centralisée.
- CMS headless ou base simple exposant destinations, traductions, catégories, parcours et paramètres de borne.[cite:18]

Le système doit permettre des mises à jour rapides sans recompiler l’application à chaque changement de nom ou de service. Les recommandations du secteur insistent sur la nécessité d’une maintenance continue, car les établissements hospitaliers évoluent fréquemment.[cite:21][cite:18]

### 12.3 Base de données

Une base relationnelle est recommandée, avec tables de destinations, alias, étages, noeuds, arêtes, bornes, traductions et logs de recherche. Les statistiques de recherche pourront servir à améliorer les raccourcis et à identifier les destinations fréquemment demandées ou mal comprises.[cite:18]

## 13. Exigences d’administration

L’exploitation du système nécessite un minimum d’outillage d’administration. Les guides de wayfinding rappellent qu’un système non maintenu devient rapidement obsolète, surtout dans les établissements en évolution.[cite:21]

Le back-office devra permettre, selon les droits :

- ajout, modification, archivage d’une destination,
- gestion des alias et synonymes,
- mise à jour des traductions,
- activation ou désactivation de parcours,
- marquage d’un ascenseur ou d’une zone comme indisponible,
- mise à jour des raccourcis de l’écran d’accueil,
- consultation des termes les plus recherchés.[cite:18][cite:21]

## 14. Exigences matérielles borne

La solution devra être compatible avec une borne tactile professionnelle, écran vertical ou légèrement incliné, exploitée en mode kiosk. Les contenus consultés soulignent l’importance du placement physique, de l’ergonomie et du respect des zones de portée pour l’accessibilité.[cite:18]

Exigences minimales :

- Écran tactile capacitif grand format.
- Résolution Full HD minimum, idéalement 4K si la lisibilité l’exige.
- Ordinateur embarqué ou mini-PC capable d’exécuter Three.js de manière fluide.
- Démarrage automatique en mode plein écran.
- Protection contre sortie d’application.
- Connexion réseau pour mises à jour.
- Système d’exploitation maîtrisé et verrouillé.
- Luminosité suffisante pour hall hospitalier.[cite:18]

## 15. Sécurité, confidentialité et conformité

L’application de borne ne doit pas exposer de données personnelles inutilement. En V1, le système doit rester centré sur des destinations, services et repères spatiaux, sans traitement nominatif sensible sauf décision explicite de l’établissement pour certains cas d’usage.[cite:18]

Si des noms de praticiens sont affichés, il faudra définir des règles de publication, de mise à jour et de responsabilité éditoriale. La borne devra aussi être durcie contre les usages non prévus, avec restrictions système, limitation des entrées externes et journalisation des incidents techniques.[cite:18]

## 16. Exigences de performance

Le système devra donner une impression d’immédiateté. Pour une borne publique, les temps de latence doivent être très faibles afin d’éviter l’abandon ou les manipulations répétées.

Objectifs recommandés :

- lancement de l’application automatique après démarrage machine,
- accès à l’écran d’accueil en quelques secondes,
- recherche quasi instantanée,
- affichage d’un itinéraire en moins de 2 secondes dans les cas usuels,
- transitions 3D fluides et stables sur le matériel retenu.[cite:18]

## 17. Journalisation et analytique

Le système devra enregistrer des indicateurs d’usage non nominatifs :

- destinations les plus recherchées,
- recherches sans résultat,
- langues utilisées,
- activation du mode PMR,
- temps moyen de session,
- écrans abandonnés.[cite:18]

Ces données permettront d’optimiser l’écran d’accueil, d’améliorer les synonymes, d’identifier les zones confuses et d’aligner la signalétique physique avec les difficultés réellement observées.[cite:18][cite:21]

## 18. Méthodologie projet

Les recommandations hospitalières structurent le wayfinding en trois temps : analyser et définir, développer et implémenter, puis gérer et maintenir. Cette logique doit être reprise dans le projet.[cite:21]

### 18.1 Phase 1 — Analyse et cadrage

- Collecte des plans.
- Audit des flux existants.
- Inventaire des destinations.
- Standardisation des terminologies.
- Identification des points de décision.
- Entretiens avec accueil, sécurité, soignants, maintenance, direction, usagers.[cite:21][cite:18]
- Définition des parcours prioritaires.
- Définition des langues et besoins d’accessibilité.[cite:21]

### 18.2 Phase 2 — Conception

- Arborescence fonctionnelle.
- Wireframes borne.
- Conception UI.
- Définition du modèle de données.
- Construction du graphe de navigation.
- Préparation des modèles 3D.
- Prototype interactif.
- Tests utilisateurs sur scénarios réels.[cite:21][cite:18]

### 18.3 Phase 3 — Développement

- Développement front-end React / Three.js.
- Développement back-office ou API contenu.
- Intégration recherche et calcul d’itinéraire.
- Intégration i18n.
- Intégration analytics.
- Optimisation pour borne tactile.

### 18.4 Phase 4 — Recette et déploiement

- Tests fonctionnels.
- Tests sur site.
- Vérification des parcours multi-étages.
- Validation des traductions.
- Validation accessibilité.
- Formation des équipes internes.
- Mise en production borne pilote.[cite:21]

### 18.5 Phase 5 — Maintenance et amélioration continue

- Procédure de mise à jour des services.
- Revue périodique des recherches utilisateurs.
- Ajout des nouveaux points d’intérêt.
- Mise à jour après travaux, déménagements, changements de dénomination.[cite:21][cite:18]

## 19. Ateliers à prévoir

Les documents sectoriels insistent sur la collaboration interdisciplinaire et l’engagement utilisateur dès les premières étapes. Le projet devra donc prévoir des ateliers impliquant architecture, exploitation, accueil, sécurité, maintenance, communication, représentants usagers et accessibilité.[cite:21]

Ateliers recommandés :

- Atelier cartographie des parcours.
- Atelier nomenclature et terminologie.
- Atelier accessibilité et publics spécifiques.
- Atelier positionnement physique des bornes.
- Atelier hiérarchie des destinations prioritaires.
- Atelier validation des repères visuels et codes couleurs.[cite:21][cite:18]

## 20. Livrables attendus

### 20.1 Livrables de cadrage

- Note de cadrage projet.
- Cartographie des flux et points de décision.
- Inventaire des destinations.
- Référentiel de dénomination.
- Plan de gouvernance et maintenance.[cite:21]

### 20.2 Livrables de conception

- Arborescence fonctionnelle.
- Parcours utilisateurs.
- Wireframes.
- Maquettes UI.
- Prototype cliquable.
- Spécifications du graphe de navigation.
- Spécifications de structure de données.
- Guide de modélisation 3D.[cite:18][cite:21]

### 20.3 Livrables de réalisation

- Application borne exploitable.
- Code source front-end.
- Code source back-office/API le cas échéant.
- Modèles 3D optimisés.
- Base de données initiale des destinations.
- Documentation d’installation.
- Documentation d’exploitation.
- Plan de tests.
- Procédure de mise à jour éditoriale.[cite:18][cite:21]

## 21. Critères d’acceptation

Le projet sera considéré conforme si :

- l’utilisateur trouve une destination courante en quelques interactions,[cite:18]
- la borne affiche un parcours correct depuis sa position vers cette destination,[cite:18]
- les changements d’étage sont compréhensibles,[cite:21]
- la navigation accessible fonctionne lorsque requise,[cite:18][cite:21]
- la recherche gère les synonymes et termes fréquents,[cite:18][cite:21]
- les libellés sont cohérents avec la signalétique et les documents de l’hôpital,[cite:21]
- les performances sont fluides sur le matériel cible,[cite:18]
- les équipes internes peuvent mettre à jour le contenu sans dépendance excessive au prestataire,[cite:18][cite:21]
- le système supporte l’évolution des services dans le temps.[cite:21]

## 22. Indicateurs de succès

Les KPI recommandés pour mesurer l’efficacité du projet sont :

- baisse des demandes d’orientation au personnel d’accueil,[cite:18]
- diminution des retards liés à l’orientation,[cite:18]
- taux de réussite des scénarios test en autonomie,[cite:21]
- temps moyen pour trouver un service,
- fréquence des recherches sans résultat,[cite:18]
- taux d’usage des raccourcis de l’écran d’accueil,[cite:18]
- taux d’usage du mode PMR,
- satisfaction usagers recueillie sur site.

## 23. Recommandations de lotissement MVP

### Lot 1 — Pilote mono-bâtiment

- 1 borne.
- 1 bâtiment ou 1 bloc.
- 2 à 4 étages.
- destinations prioritaires uniquement.
- parcours standards + PMR.
- 2 langues.
- analytique de base.[cite:18][cite:21]

### Lot 2 — Extension établissement

- extension à tous les étages.
- ajout de nouvelles bornes.
- enrichissement des raccourcis et points d’intérêt.
- amélioration du back-office.
- optimisation des modèles 3D.

### Lot 3 — Écosystème augmenté

- QR code vers smartphone,[cite:18]
- intégration planning ou annuaire,
- mode urgence avancé,[cite:18]
- audio-guidage partiel,
- statistiques avancées.

## 24. Recommandations spécifiques pour Antigravity

Le prompt transmis à Antigravity devra demander non seulement une interface élégante, mais surtout un système de wayfinding hospitalier complet, fondé sur la simplicité, la clarté et l’accessibilité. Les références consultées montrent qu’un projet de ce type ne doit pas être conçu comme une simple démonstration 3D mais comme un dispositif orienté résolution de parcours réels, maintenance continue et cohérence avec l’environnement bâti.[cite:21][cite:18]

Il faudra donc exiger de l’outil qu’il produise :

- une architecture d’application borne React centrée sur un flux tactile grand public,
- une intégration Three.js pour une carte 3D lisible et performante,
- une structure de données maintenable pour étages, zones, destinations et graphes,
- une expérience multi-langue,
- un mode PMR,
- une logique de raccourcis vers les destinations les plus recherchées,
- une distinction claire entre UI institutionnelle et couche de navigation spatiale.[cite:18][cite:21]

## 25. Conclusion opérationnelle

Le projet doit être abordé comme un produit hospitalier d’orientation et non comme un simple visualiseur 3D. Les sources de référence convergent sur les mêmes fondamentaux : la réussite dépend de l’analyse des parcours réels, de la cohérence avec la signalétique physique, de la simplicité de l’interface, du choix de points de décision pertinents, de la maintenabilité du contenu et d’une conception inclusive adaptée à des publics variés.[cite:21][cite:18]

Le choix de Three.js est pertinent dès lors que la 3D reste au service de la compréhension spatiale, de la lisibilité des étages et de la réduction de la charge cognitive. Une V1 bien cadrée, centrée sur un graphe de navigation, un nombre limité de parcours critiques et une borne pilote sur site, constitue l’approche la plus robuste avant extension à l’ensemble de l’hôpital.[cite:18][cite:21]
