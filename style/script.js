/* -------------------------------------------------
   script.js – ONE DOMContentLoaded, everything after includeHTML()
   ------------------------------------------------- */

(async () => {
  // -------------------------------------------------
  // 1. Load partials (navbar / footer)
  // -------------------------------------------------
  async function includeHTML() {
    const elements = document.querySelectorAll("[data-include]");
    for (const el of elements) {
      const file = el.getAttribute("data-include");
      try {
        const resp = await fetch(file);
        if (resp.ok) el.innerHTML = await resp.text();
        else el.innerHTML = "Include not found.";
      } catch (e) {
        el.innerHTML = "Error loading include.";
      }
    }
  }

  // -------------------------------------------------
  // 2. Hamburger menu (mobile)
  // -------------------------------------------------
  function initHamburger() {
    const btn = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-links");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => menu.classList.toggle("active"));
  }

  // -------------------------------------------------
  // 3. Verified-link popup
  // -------------------------------------------------
  function initVerifiedPopup() {
    const popup = document.getElementById("verifiedPopup");
    const continueBtn = document.getElementById("continueBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    let pendingUrl = null;

    if (!popup || !continueBtn || !cancelBtn) {
      console.warn("Popup elements missing – aborting initVerifiedPopup");
      return;
    }

    // ---- Delegation on the *document* (works even for future elements) ----
    document.documentElement.addEventListener("click", (e) => {
      const link = e.target.closest("a.verified-link");
      if (!link) return;

      e.preventDefault();               // stop normal navigation
      pendingUrl = link.href;
      popup.style.display = "flex";     // show overlay
    });

    continueBtn.addEventListener("click", () => {
      if (pendingUrl) {
        window.open(pendingUrl, "_blank");
        closePopup();
      }
    });

    cancelBtn.addEventListener("click", closePopup);

    // click on the dark overlay → close
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });

    function closePopup() {
      popup.style.display = "none";
      pendingUrl = null;
    }
  }
  
  

  // -------------------------------------------------
  // 4. Run everything in the correct order
  // -------------------------------------------------
  await includeHTML();      // 1. inject navbar/footer
  initHamburger();          // 2. mobile menu
  initVerifiedPopup();      // 3. popup (links now exist)
})();