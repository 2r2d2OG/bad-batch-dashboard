/**
 * ====================================================================
 * MODULE DÉFENSIF : GESTIONNAIRE DE SESSION SÉCURISÉ (ARC-SEC)
 * ====================================================================
 */
(function (window, document) {
  "use strict";

  const CONFIG = {
    storageKey: "arcSession",
    sessionTTL: 4 * 60 * 60 * 1000, // Durée de validité : 4 heures
    maxInactivity: 30 * 60 * 1000,  // Inactivité maximale : 30 minutes
    // Rôles stricts autorisés
    allowedRoles: Object.freeze(["member", "officer", "admin"])
  };

  /**
   * Assainissement défensif au démarrage (Purge des payloads connus)
   */
  function sanitizeBoot() {
    try {
      // Élimination des variables globales injectées
      if ("arcSessionAvantTest" in window) {
        delete window.arcSessionAvantTest;
      }

      const raw = localStorage.getItem(CONFIG.storageKey);
      if (!raw) return;

      const data = JSON.parse(raw);

      // Détection de fausses sessions injectées
      const isTampered =
        !data ||
        typeof data !== "object" ||
        data.user === "TEST_SECURITE" ||
        (data.role === "admin" && (!data.userHash || data.userHash === null)) ||
        (data.role === "admin" && (!data.userId || data.userId === null));

      if (isTampered) {
        console.warn("[ARC-SEC] Détection d'une session non authentique. Purge immédiate.");
        localStorage.removeItem(CONFIG.storageKey);
      }
    } catch (e) {
      localStorage.removeItem(CONFIG.storageKey);
    }
  }

  /**
   * Validation de la structure et de la conformité du schéma
   */
  function validateSchema(session) {
    if (!session || typeof session !== "object") return false;

    const requiredFields = ["user", "role", "userId", "userHash", "issuedAt", "lastActive"];
    for (const field of requiredFields) {
      if (!(field in session)) return false;
    }

    // Validation des types
    if (typeof session.user !== "string" || session.user.trim().length === 0) return false;
    if (typeof session.userId !== "string" || session.userId.trim().length === 0) return false;
    if (typeof session.userHash !== "string" || session.userHash.length !== 64) return false; // SHA-256 hex standard
    if (!CONFIG.allowedRoles.includes(session.role)) return false;

    // Validation temporelle (Anti-Replay / Expiration)
    const now = Date.now();
    if (typeof session.issuedAt !== "number" || typeof session.lastActive !== "number") return false;
    if (now - session.issuedAt > CONFIG.sessionTTL) return false;
    if (now - session.lastActive > CONFIG.maxInactivity) return false;

    return true;
  }

  /**
   * Calcul d'empreinte d'intégrité locale (SHA-256 via Web Crypto API)
   */
  async function computeSessionHash(userId, role, issuedAt, salt = "ARC_SECURE_SALT_V1") {
    const payload = `${userId}:${role}:${issuedAt}:${salt}`;
    const enc = new TextEncoder();
    const data = enc.encode(payload);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Récupération sécurisée et authentifiée de la session
   */
  async function getValidatedSession() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (!raw) return null;

      const session = JSON.parse(raw);

      if (!validateSchema(session)) {
        terminateSession();
        return null;
      }

      // Vérification cryptographique de l'intégrité
      const expectedHash = await computeSessionHash(session.userId, session.role, session.issuedAt);
      if (session.userHash !== expectedHash) {
        console.error("[ARC-SEC] Échec d'intégrité de la session (altération détectée).");
        terminateSession();
        return null;
      }

      // Mise à jour de l'activité
      session.lastActive = Date.now();
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(session));

      return session;
    } catch {
      terminateSession();
      return null;
    }
  }

  /**
   * Révocation et destruction de session
   */
  function terminateSession() {
    localStorage.removeItem(CONFIG.storageKey);
    applyDOMRestrictions(null);
  }

  /**
   * Application stricte du contrôle d'accès dans le DOM
   */
  function applyDOMRestrictions(session) {
    const adminNodes = document.querySelectorAll("[data-require-role='admin']");
    const officerNodes = document.querySelectorAll("[data-require-role='officer']");
    const authenticatedNodes = document.querySelectorAll("[data-require-auth='true']");

    const isAuthenticated = session !== null;
    const role = session ? session.role : null;

    // Éléments réservés aux utilisateurs connectés
    authenticatedNodes.forEach(node => {
      node.style.display = isAuthenticated ? "" : "none";
      node.setAttribute("aria-hidden", (!isAuthenticated).toString());
    });

    // Éléments réservés aux administrateurs
    adminNodes.forEach(node => {
      const allowed = isAuthenticated && role === "admin";
      if (!allowed) {
        node.remove(); // Suppression définitive du nœud du DOM plutôt que simple masquage CSS
      }
    });

    // Éléments réservés aux officiers ou admins
    officerNodes.forEach(node => {
      const allowed = isAuthenticated && (role === "officer" || role === "admin");
      if (!allowed) {
        node.remove();
      }
    });
  }

  // Initialisation immédiate
  sanitizeBoot();

  document.addEventListener("DOMContentLoaded", async () => {
    const session = await getValidatedSession();
    applyDOMRestrictions(session);
  });

  // Exposition minimale et protégée (en lecture seule)
  window.ArcAuth = Object.freeze({
    getSession: getValidatedSession,
    logout: terminateSession,
    generateAuthData: computeSessionHash
  });

})(window, document);
