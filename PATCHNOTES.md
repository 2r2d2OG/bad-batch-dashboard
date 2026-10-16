# Patch notes — Datapad tactique // Clone Force 99 (Havoc Marauder)

Les versions les plus récentes sont en haut. Le numéro de build correspond au firmware affiché dans le footer de `index.html`.

---

## BUILD 3.5 — Interrupteur ON / OFF des recrutements
*16/10/2026*

- **Interrupteur ON / OFF** (Hunter, onglet Recrutement) : les recrutements sont fermés par défaut.
- **ON** : grand bandeau « Recrutements ouverts / Postuler » sur la page de connexion et formulaire de candidature ouvert.
- **OFF** : bandeau masqué (le petit lien « Postuler » a été retiré) et `candidature.html` affiche « Recrutements fermés ».
- Les membres voient l'état (ouvert / fermé) dans leurs candidatures reçues.

---

## BUILD 3.4 — Archives de recrutement et liens hors du code
*16/10/2026*

- **Archives des recrutements** : bouton « 📦 Archiver » par candidat, « Archiver les clôturés » (réussis et ratés, les « en attente » restent), panneau d'archives replié avec recherche, filtres et « Désarchiver ».
- **Liens de recrutement** déplacés dans Firestore (visibles uniquement par Hunter) : plus aucun lien Google dans `index.html`, éditeur « ✏ Modifier les liens » et import.
- Le bouton « Supprimer » d'un candidat remplace l'ancien « Archiver » (il retire le candidat de toutes les listes).

---

## BUILD 3.3 — Résultats colorés, commentaires et recrutements passés
*16/10/2026*

- **Code couleur** par candidat : 🟥 test théorique raté, 🟧 en attente, 🟩 réussi ; filtre par résultat dans le classement.
- **Commentaires** après recrutement : commentaire général et commentaire de la mission RP, visibles par tous les membres.
- **Import des recrutements passés** (Hunter) : 18 candidats déjà évalués, avec temps, erreurs, note théorique et commentaires.

---

## BUILD 3.2 — Candidatures en ligne et avis des membres
*16/10/2026*

- **Nouvelle page `candidature.html`** : formulaire public de candidature (identité, Discord, régiment, grade, disponibilités, personnage, motivations, connaissances), lien « Postuler » sur l'écran de connexion.
- **Onglet Recrutement ouvert à tous les membres** : candidatures reçues, avis favorable / défavorable, pastille des avis en attente.
- **Hunter** : lance le recrutement depuis la candidature (infos reprises dans la fiche), puis retient pour la mission d'essai ou refuse ; les membres votent ensuite sur le classement.

---

## BUILD 3.1 — Recrutement : candidats, questionnaire et classement
*16/10/2026*

- **Onglet Recrutement (Hunter)** : candidats par poste, questionnaire tiré au hasard (10 questions CF99 + 5 du personnage), notes des épreuves et classement par moyenne /20.
- **Barème modifiable** : seuils de temps, pénalités, poids de chaque épreuve et note du questionnaire ; tout est recalculé.
- La banque de questions est importée dans Firestore (fichier `banque-questions.json`), elle n'est donc pas dans le code du repo.

---

## BUILD 3.0 — Confort, recrutement et plans
*16/10/2026*

- **Formulaire de rapport** : plus écrasé par les mises à jour en direct. Vrais sélecteurs de date.
- **Bouton PDS** : ne touche plus aucune statistique de spécialité. Stats « fun » supprimées.
- **Blâmes** : la fenêtre ne se rouvre plus à chaque mise à jour ; historique détaillé sur les fiches.
- **Hunter** : corrections de PDS tracées (qui, quand, avant/après) dans le registre, export CSV, onglet Recrutement, modification/suppression des plans, 8 nouveaux plans Clone Wars / Bad Batch.
- **Onglets** triés plus logiquement, centrés pour Hunter. Texte plus grand et mieux adapté au PC.
- **Technique** : Tailwind précompilé (`tailwind.css`, secours CDN), chargement des données limité (rapports 35 j, registre 180 j).

---

## BUILD 2.8 — Registre d'activité, purge mensuelle et allègement de l'interface
*15/10/2026*

- **Rapports de mission** supprimés automatiquement après 1 mois.
- **PDS retirées des rapports** : elles n'apparaissent plus dans le registre des rapports ni dans « Derniers rapports ».
- **Nouvel onglet « Registre & Stats » (Hunter)** : PDS et rapports de chaque membre par date et heure, courbes d'activité (par jour ou par semaine), cartes de synthèse et filtres. L'historique est conservé après la purge des rapports.
- **Module de recrutement supprimé** (accueil, poste de commandement et modale).

**Commit suggéré :** `feat: registre d'activité Hunter, purge des rapports à 1 mois, PDS hors rapports, retrait du recrutement — build 2.8`

---

## BUILD 2.7 — Archives de piratage au choix et PDS modifiables par Hunter
*15/10/2026*

- **Tech** : case « Ajouter ce rapport aux Archives de piratage » dans le formulaire de rapport (décochée par défaut). Avant, tous ses rapports étaient copiés automatiquement.
- **Hunter** : champ « PDS de la semaine en cours » dans « Modifier Dossier » pour corriger le compteur d'un opérateur.

**Commit suggéré :** `feat: archives de piratage au choix pour Tech, PDS modifiables par Hunter — build 2.7`

---

## BUILD 2.6 — Fin du double comptage PDS entre bouton et rapport
*15/10/2026*

### Correction
- Cliquer sur **PDS 18H / 21H** puis rédiger un rapport comptait deux PDS pour la même prise de service (et inversement).

### Fonctionnement
- Le formulaire de rapport a un nouveau champ **« PDS validée par ce rapport »** : `PDS 18H`, `PDS 21H` ou `Aucune`.
- Le bouton PDS et le rapport partagent désormais les **mêmes créneaux** : un créneau (18H ou 21H) n'est crédité **qu'une seule fois par jour et par opérateur**, quel que soit l'ordre (bouton puis rapport, ou rapport puis bouton).
- Le créneau proposé par défaut est le premier pas encore validé aujourd'hui (`Aucune` si les deux le sont). Le choix manuel n'est plus écrasé par les rafraîchissements en direct.
- Les opérateurs cochés dans « Déployés ensemble » suivent la même règle : un frère qui a déjà validé ce créneau ce jour-là n'est pas recrédité.
- Le bouton PDS passe à « ✓ validée » quand le créneau a été validé par un rapport.
- Une notification confirme le résultat (PDS validée, déjà validée, ou rapport sans PDS).
- La date du rapport sert de clé du créneau (normalisée en JJ/MM/AAAA ; date invalide = aujourd'hui).

### Données Firestore
- Les documents `missions` reçoivent un champ `creneauPds` (`18h`, `21h` ou `aucune`).

### À savoir
- Les doubles comptages déjà enregistrés ne sont pas corrigés rétroactivement : ils disparaissent à la prochaine remise à zéro hebdomadaire.

**Commit suggéré :** `fix(pds): un créneau 18h/21h n'est crédité qu'une fois par jour (bouton + rapport) — build 2.6`

---

## BUILD 2.5 — Contrôle hebdomadaire des PDS : avertissement puis blâme automatique
*14/10/2026*

### Nouveautés
- **Bilan automatique à chaque clôture de semaine** pour Tech, Wrecker et Crosshair (Hunter reste exempté).
- **Avertissement** dès la première semaine où le quota de PDS n'est pas atteint.
- **Blâme automatique** à partir de la deuxième semaine consécutive non conforme, avec motif et score consignés dans l'historique des blâmes. Le plafond reste de 3 blâmes.
- **Prise en compte des absences** : une absence déclarée (en cours ou archivée au carnet) qui recouvre au moins un jour de la semaine exempte le joueur. Une absence sans date de fin compte comme en cours. Une semaine exemptée ne fait ni progresser ni retomber la série de semaines non conformes.
- **Notification du joueur averti** : fenêtre d'avertissement avec accusé de réception à sa prochaine connexion.
- **Notification de Hunter** : fenêtre « Rapport disciplinaire automatique » listant les avertissements et blâmes appliqués, avec accusé de réception.
- **Panneau « Bilan hebdomadaire des PDS »** dans le Poste de commandement (Hunter et B.O.S) : score et statut de chaque joueur sur les 6 dernières semaines.
- **Badge « ⚠ Avertissement PDS »** sur les fiches du Poste de commandement et de l'Effectif.

### Comportement à connaître
- Le bouton **Clôturer semaine & reset** (Hunter) ne sanctionne personne : la semaine en cours n'est pas évaluée à la clôture automatique suivante.
- Il n'y a pas de serveur : le bilan est calculé à la première ouverture de la page après le début de la nouvelle semaine (et non à minuit pile).
- Un blâme injustifié peut être retiré avec « − Retirer ». L'avertissement disparaît à la prochaine semaine conforme.

### Données Firestore
- Nouvelle collection : `bilansPDS` (un document par semaine évaluée).
- `config/escouade` : nouveaux champs `semaineActive` et `semaineSansSanction`.
- `operateurs/*` : nouveaux champs `strikesPDS` et `avertissementPds`.
- Aucune modification des règles Firestore n'est nécessaire.

**Commit suggéré :** `feat(pds): bilan hebdo, avertissement puis blâme automatique (absences prises en compte) — build 2.5`

---

## BUILD 2.4 — Remise à zéro hebdomadaire automatique des PDS
*14/10/2026*

### Nouveautés
- **Reset automatique des PDS chaque lundi** (semaine ISO, du lundi au dimanche) : compteurs de la semaine et PDS du jour remis à 0 pour tous les opérateurs.
- Transaction Firestore : si plusieurs appareils sont ouverts en même temps, une seule remise à zéro est appliquée.
- Les totaux cumulés, blâmes, absences et rapports ne sont pas touchés.

### Correction
- Les PDS ne se réinitialisaient jamais d'elles-mêmes : seul le bouton manuel de Hunter existait.

### Migration
- Au premier lancement, la semaine en cours est simplement enregistrée sans rien effacer. Hunter doit cliquer **une fois** sur « Clôturer semaine & reset » pour repartir proprement.

**Commit suggéré :** `feat(pds): reset hebdomadaire automatique (semaine ISO) — build 2.4`

---

## BUILD 2.3 — Commandement, ordre canonique et corrections
*14/10/2026*

### Nouveautés
- **Gestion des mots de passe par Hunter** : bouton « 🔑 Réinitialiser / Changer mot de passe » sur chaque fiche de l'Effectif (Hunter uniquement). Modale dédiée, hash SHA-256 enregistré dans `config/escouade.motsDePasseHashes`, son de succès et notification tactique.
- **Connexion B.O.S** : le mot de passe est désormais accepté sans tenir compte de la casse ni des espaces autour (en plus de l'empreinte SHA-256 existante).
- **Ordre canonique des matricules** partout : Hunter (FC-99-01), Tech (CF99-002), Wrecker (CF99-003), Crosshair (CF99-004). Appliqué à l'écran de connexion, aux cartes du Poste de commandement, aux fiches de l'Effectif, au filtre des rapports et aux cases à cocher des déploiements collectifs.
- **Footer** : firmware mis à jour.

### Corrections
- **Script bloquant** : accolade manquante dans `afficherVueRapports()`, qui empêchait toute interaction avec la page.
- **Section Rapports** : `</div>` manquant après le formulaire. Le registre était imbriqué dans le formulaire et disparaissait en mode B.O.S.
- **PDS 18h/21h** : l'enregistrement dans Firestore échouait systématiquement (les dates contiennent des `/`, désormais gérées via `FieldPath`).
- **Documents Firestore** : création automatique de `config/escouade` et des documents opérateurs s'ils n'existent pas, sans quoi les écritures échouaient.
- **Doublons** : rapports, archives, carnet d'absences et plans ne s'affichent plus deux fois, et les compteurs ne sont plus comptés deux fois.
- **Sécurité** : suppression de la possibilité de se connecter en saisissant directement l'empreinte du mot de passe.
- **Mobile** : le zoom n'est plus bloqué (`maximum-scale` et `user-scalable=no` retirés).
- **Style** : classe Tailwind inexistante `py-0.2` remplacée par `py-px`.

**Commit suggéré :** `fix+feat: corrections bloquantes, ordre canonique, reset mdp par Hunter — build 2.3`
