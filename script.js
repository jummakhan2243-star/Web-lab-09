// Spaceflight News API - free, no API key required
const API_URL = "https://api.spaceflightnewsapi.net/v4/articles/";

const newsContainer = document.getElementById("news");
const statusText = document.getElementById("status");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resetBtn = document.getElementById("reset-btn");

function showStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.className = isError ? "error" : "";
}

// Fetch articles from the API (optionally filtered by a search term)
async function fetchNews(searchTerm = "") {
  showStatus("Loading news...");
  newsContainer.innerHTML = "";

  let url = `${API_URL}?limit=12`;
  if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    if (data.results.length === 0) {
      showStatus("No articles found. Try another keyword.");
      return;
    }
    showStatus(searchTerm ? `Results for "${searchTerm}"` : "Latest articles");
    displayNews(data.results);
  } catch (error) {
    console.error("Error:", error);
    showStatus("Could not load news: " + error.message, true);
  }
}

// Build a card for every article and add it to the page
function displayNews(articles) {
  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = article.image_url;
    img.alt = article.title;
    img.onerror = () => img.remove();

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = article.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${article.news_site} • ${new Date(article.published_at).toLocaleDateString()}`;

    const summary = document.createElement("p");
    summary.className = "summary";
    summary.textContent = article.summary;

    const link = document.createElement("a");
    link.href = article.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Read more";

    body.append(title, meta, summary, link);
    card.append(img, body);
    newsContainer.appendChild(card);
  });
}

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  fetchNews(searchInput.value.trim());
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  fetchNews();
});

fetchNews(); // load latest news when the page opens
