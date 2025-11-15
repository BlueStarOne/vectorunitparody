// Helper function: fetch with retries
async function fetchWithRetry(url, retries = 2, delay = 300) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries) throw err;  // rethrow after last attempt
      console.warn(`Retrying fetch for ${url} (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, delay));  // wait before retry
    }
  }
}

// Main function
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Load the index of posts
    const postFolders = await fetchWithRetry("/blog-posts/posts-index.json");

    // 2. Select all cards
    const cards = document.querySelectorAll(".blog-card");

    // 3. Loop through cards and fill them
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      if (i < postFolders.length) {
        const folder = postFolders[i];
        const refPath = folder + "reference.json";

        try {
          const ref = await fetchWithRetry(refPath);

          // Fill card elements
          const img = card.querySelector("img");
          const a = card.querySelector("a");
          const title = card.querySelector(".blog-card-title");
          const desc = card.querySelector(".blog-card-desc");
          const date = card.querySelector(".blog-card-date");

          if (img && ref.image) img.src = ref.image + "?v=" + Date.now();
          if (a) a.href = ref.link || "#";
          if (title) title.textContent = ref.title || "";
          if (desc) desc.textContent = ref.description || "";
          if (date) date.textContent = ref.date || "";

          card.style.display = "flex"; // ensure visible

        } catch (err) {
          console.warn("Failed to load reference.json for:", folder, err);
          card.style.display = "none"; // hide card if reference fails
        }

      } else {
        // Hide any remaining empty cards
        card.style.display = "none";
      }
    }

  } catch (err) {
    console.error("Error loading blog cards:", err);
  }
});
