const DATA_URL = "data/index.json";

let allRecords = [];

async function loadArchive() {
  try {
    const response = await fetch(DATA_URL + "?v=" + Date.now());
    if (!response.ok) throw new Error("Archive data unavailable");
    allRecords = await response.json();
    render();
  } catch (error) {
    console.error(error);
    allRecords = [];
    render();
  }
}

function render() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const filter = document.getElementById("filter").value;

  const filtered = allRecords.filter(r => {
    const matchesText =
      !query ||
      String(r.nova_id || "").toLowerCase().includes(query) ||
      String(r.record_key || "").toLowerCase().includes(query);

    const matchesType =
      filter === "all" || r.record_type === filter;

    return matchesText && matchesType;
  });

  const artworkCount = allRecords.filter(r => r.record_type === "artwork").length;
  const verificationCount = allRecords.filter(r => r.record_type === "verification").length;

  document.getElementById("heroCount").textContent = allRecords.length;
  document.getElementById("artworkCount").textContent = artworkCount;
  document.getElementById("verificationCount").textContent = verificationCount;

  const latest = allRecords[0];
  document.getElementById("latestDate").textContent =
    latest ? formatDate(latest.created || latest.received_at) : "—";

  const box = document.getElementById("records");
  const empty = document.getElementById("empty");

  box.innerHTML = "";

  if (!filtered.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  filtered.forEach(record => {
    box.appendChild(createCard(record));
  });
}

function createCard(record) {
  const card = document.createElement("article");
  card.className = "card";

  const imageName =
    record.image ||
    record.verification_image ||
    record.original_image;

  let imageHtml = '<div class="placeholder">Image unavailable</div>';

  if (imageName) {
    const name = String(imageName).split("/").pop();
    const url =
      "data/images/" +
      encodeURIComponent(record.record_key) +
      "/" +
      encodeURIComponent(name);

    imageHtml = `<img src="${url}" loading="lazy" alt="ArtNova artwork">`;
  }

  const typeLabel =
    record.record_type === "verification"
      ? "VERIFICATION"
      : "REGISTERED ARTWORK";

  const title =
    record.nova_id ||
    record.matched_nova_id ||
    record.record_key ||
    "Unknown record";

  const fingerprint =
    record.fingerprint ||
    "Verification record";

  card.innerHTML = `
    <div class="image">${imageHtml}</div>
    <div class="card-body">
      <div class="tag">${typeLabel}</div>
      <h3>${escapeHtml(title)}</h3>
      <div class="meta">
        ${record.date ? escapeHtml(record.date) : ""}
        ${record.time ? " · " + escapeHtml(record.time) : ""}
        ${record.location ? "<br>" + escapeHtml(record.location) : ""}
      </div>
      <div class="fingerprint">${escapeHtml(fingerprint)}</div>
      <details>
        <summary>View record data</summary>
        <pre>${escapeHtml(JSON.stringify(record, null, 2))}</pre>
      </details>
    </div>
  `;

  return card;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("filter").addEventListener("change", render);

loadArchive();
setInterval(loadArchive, 15000);
