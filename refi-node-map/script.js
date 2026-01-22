function el(id) {
    const node = document.getElementById(id);
    if (!node) {
        throw new Error(`Missing element: #${id}`);
    }
    return node;
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

const MAP_Y_OFFSET_PCT = 0;

function latLngToPct(lat, lng) {
    const x = ((Number(lng) + 180) / 360) * 100;
    const y = ((90 - Number(lat)) / 180) * 100;
    return { xPct: clamp(x, 0, 100), yPct: clamp(y, 0, 100) };
}

function sanitizeHref(href) {
    const trimmed = String(href || "").trim();
    if (!trimmed) return "#";
    if (/^(https?:\/\/|mailto:)/i.test(trimmed)) return trimmed;
    return "#";
}

function sanitizeImageSrc(src) {
    const trimmed = String(src || "").trim();
    if (!trimmed) return "";
    if (/^javascript:/i.test(trimmed)) return "";
    return trimmed;
}

function extractFirstImage(md) {
    const match = String(md || "").match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (!match) return { url: "", alt: "", stripped: md };
    const alt = match[1] || "";
    const url = match[2] || "";
    const stripped = String(md || "").replace(match[0], "").trim();
    return { url, alt, stripped };
}

function parseYearFromPath(path) {
    const match = String(path || "").match(/(\d{4})\.md$/);
    return match ? Number(match[1]) : null;
}

function parseLastUpdate(value) {
    const text = String(value || "").trim();
    if (!text) return 0;
    const match = text.match(/^([A-Za-z]{3,})\s+(\d{4})$/);
    if (!match) return 0;
    const month = match[1].toLowerCase();
    const year = Number(match[2]);
    const monthIndex = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
    }[month.slice(0, 3)];
    if (!Number.isFinite(year) || monthIndex === undefined) return 0;
    return Date.UTC(year, monthIndex, 1);
}

function getYearsFromContent(node) {
    const map = node && node.contentByYear && typeof node.contentByYear === "object" ? node.contentByYear : null;
    if (!map) return [];
    return Object.keys(map)
        .map((key) => Number(key))
        .filter((year) => Number.isFinite(year));
}

function normalizeYears(years) {
    return [...new Set(years.filter((year) => Number.isFinite(year)))]
        .sort((a, b) => b - a);
}

function nodeYearPath(node, year) {
    const slug = node.slug || node.id || "";
    return `nodes/${slug}/${year}.md`;
}

function getYearCandidates(baseYear) {
    const currentYear = new Date().getFullYear();
    const minYear = 2020;
    const maxYear = Math.max(currentYear + 1, baseYear || currentYear);
    const years = [];
    for (let year = maxYear; year >= minYear; year -= 1) {
        years.push(year);
    }
    if (baseYear && !years.includes(baseYear)) years.push(baseYear);
    return years;
}

function inlineMarkdown(text) {
    let out = escapeHtml(text);
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
        const safeHref = sanitizeHref(href);
        return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    });
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return out;
}

function renderMarkdown(md) {
    const lines = String(md || "").replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
    let html = "";
    let inList = false;

    const closeList = () => {
        if (inList) {
            html += "</ul>";
            inList = false;
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
            closeList();
            return;
        }

        if (trimmed.startsWith("### ")) {
            closeList();
            html += `<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`;
            return;
        }

        if (trimmed.startsWith("## ")) {
            closeList();
            html += `<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`;
            return;
        }

        if (trimmed.startsWith("# ")) {
            closeList();
            html += `<h2>${inlineMarkdown(trimmed.slice(2))}</h2>`;
            return;
        }

        const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
            closeList();
            const alt = imageMatch[1] || "";
            const src = sanitizeImageSrc(imageMatch[2] || "");
            if (!src) return;
            html += `<figure class="node-media">
                <img class="node-media__img" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />
            </figure>`;
            return;
        }

        if (trimmed.startsWith("- ")) {
            if (!inList) {
                html += "<ul>";
                inList = true;
            }
            html += `<li>${inlineMarkdown(trimmed.slice(2))}</li>`;
            return;
        }

        closeList();
        html += `<p>${inlineMarkdown(trimmed)}</p>`;
    });

    closeList();
    return html;
}

function renderNodeMeta(node) {
    const linkHtml = Array.isArray(node.keyLinks)
        ? node.keyLinks
            .filter((link) => link && link.label && link.url)
            .map((link) => {
                const safeHref = sanitizeHref(link.url);
                return `<a href=\"${escapeHtml(safeHref)}\" target=\"_blank\" rel=\"noopener noreferrer\">${escapeHtml(link.label)}</a>`;
            })
            .join(", ")
        : "";
    const items = [
        { label: "Location", value: node.location },
        { label: "Lead Stewards", value: node.leadStewards },
        { label: "Node Stage", value: node.nodeStage },
        { label: "Last Update", value: node.lastUpdate },
        { label: "Key Links", value: linkHtml, isHtml: true }
    ];
    const html = items
        .filter((item) => item.value)
        .map((item) => {
            const label = escapeHtml(item.label);
            const value = item.isHtml ? item.value : escapeHtml(item.value);
            return `<div class="node-modal__metaItem"><span class="node-modal__metaLabel">${label}</span><span class="node-modal__metaValue">${value}</span></div>`;
        })
        .join("");
    return html;
}

function getContinentLabel(node) {
    const haystack = `${node.name || ""} ${node.location || ""}`.toLowerCase();
    const matches = (value) => haystack.includes(value);

    if (matches("tanzania") || matches("uganda") || matches("lagos") || matches("nigeria") || matches("cape town") || matches("south africa")) {
        return "Africa";
    }
    if (matches("thailand") || matches("phangan") || matches("asia") || matches("hong kong") || matches("singapore") || matches("china")) {
        return "Asia";
    }
    if (matches("barcelona") || matches("spain") || matches("lisbon") || matches("portugal") || matches("italia") || matches("italy") || matches("sicilia") || matches("sicily") || matches("hague") || matches("netherlands") || matches("europe") || matches("london") || matches("united kingdom") || matches("uk") || matches("geneva") || matches("switzerland")) {
        return "Europe";
    }
    if (matches("mexico") || matches("bay area") || matches("san francisco") || matches("usa") || matches("united states") || matches("portland") || matches("red hook") || matches("costa rica") || matches("canada") || matches("toronto")) {
        return "North America";
    }
    if (matches("colombia") || matches("venezuela") || matches("belo horizonte") || matches("brazil") || matches("medell") || matches("bogota") || matches("atlántico") || matches("atlantico") || matches("suriname") || matches("paramaribo")) {
        return "South America";
    }
    return "Unknown";
}

const FLAG_BY_ID = {
    "refi-belo-horizonte": "🇧🇷",
    "refi-bogota": "🇨🇴",
    "refi-cape-town": "🇿🇦",
    "refi-colombia": "🇨🇴",
    "refi-phangan": "🇹🇭",
    "refi-red-hook": "🇺🇸",
    "refi-the-hague": "🇳🇱",
    "refi-venezuela": "🇻🇪",
    "refi-atlantico": "🇨🇴",
    "refi-barcelona": "🇪🇸",
    "refi-bay-area": "🇺🇸",
    "refi-costa-rica": "🇨🇷",
    "refi-italia": "🇮🇹",
    "refi-lagos": "🇳🇬",
    "refi-lisboa": "🇵🇹",
    "refi-medellin": "🇨🇴",
    "refi-mexico": "🇲🇽",
    "refi-portland": "🇺🇸",
    "refi-tanzania": "🇹🇿",
    "refi-tulum": "🇲🇽",
    "refi-uganda": "🇺🇬",
    "rifai-sicilia": "🇮🇹",
    "refi-geneva": "🇨🇭",
    "refi-hong-kong": "🇭🇰",
    "refi-london": "🇬🇧",
    "refi-miami": "🇺🇸",
    "refi-paramaribo": "🇸🇷",
    "refi-singapore": "🇸🇬",
    "refi-toronto": "🇨🇦"
};

function getFlagEmoji(node) {
    if (!node) return "🌍";
    return FLAG_BY_ID[node.id] || "🌍";
}

function setModalLogo(modalLogo, node) {
    const nodeId = node && node.id ? String(node.id) : "";
    if (!nodeId) {
        modalLogo.hidden = true;
        modalLogo.removeAttribute("src");
        return;
    }
    const base = `nodes/${nodeId}/images/logo`;
    const extensions = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
    let idx = 0;

    const tryNext = () => {
        if (idx >= extensions.length) {
            modalLogo.hidden = true;
            modalLogo.removeAttribute("src");
            return;
        }
        const ext = extensions[idx++];
        modalLogo.src = `${base}.${ext}`;
        modalLogo.hidden = false;
    };

    modalLogo.alt = `${node.name || "Node"} logo`;
    modalLogo.onload = () => {
        modalLogo.hidden = false;
    };
    modalLogo.onerror = () => {
        tryNext();
    };
    tryNext();
}

function setCoverImage(targetImg, node) {
    const nodeId = node && node.id ? String(node.id) : "";
    if (!nodeId || !targetImg) {
        return false;
    }
    const base = `nodes/${nodeId}/images/cover`;
    const extensions = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
    let idx = 0;

    const tryNext = () => {
        if (idx >= extensions.length) {
            targetImg.hidden = true;
            targetImg.removeAttribute("src");
            return;
        }
        const ext = extensions[idx++];
        targetImg.src = `${base}.${ext}`;
        targetImg.hidden = false;
    };

    targetImg.alt = `${node.name || "Node"} cover`;
    targetImg.onload = () => {
        targetImg.hidden = false;
        const parent = targetImg.closest(".node-card__media");
        if (parent) parent.classList.remove("is-empty");
    };
    targetImg.onerror = () => {
        tryNext();
    };
    tryNext();
    return true;
}

function main() {
    const nodes = Array.isArray(window.__NODE_DATA__) ? window.__NODE_DATA__ : [];

    const mapPins = el("mapPins");
    const nodeGrid = el("nodeGrid");
    const nodeFilters = el("nodeFilters");
    const modal = el("nodeModal");
    const modalTitle = el("modalTitle");
    const modalMeta = el("modalMeta");
    const modalContent = el("modalContent");
    const modalHero = el("modalHero");
    const modalHeroImg = el("modalHeroImg");
    const modalClose = el("modalClose");
    const modalLogo = el("modalLogo");
    const modalYears = el("modalYears");
    const modalYearTabs = el("modalYearTabs");
    const scrollIndicator = document.getElementById("scrollIndicator");
    const mapSection = document.getElementById("mapSection");
    const nodeSort = el("nodeSort");
    const btnTour = el("btnTour");
    const btnAdmin = el("btnAdmin");
    const btnPickPin = el("btnPickPin");
    const tourPanel = el("tourPanel");
    const tourPanelTitle = el("tourPanelTitle");
    const tourPanelMeta = el("tourPanelMeta");
    const tourPanelText = el("tourPanelText");
    const tourPanelPrev = el("tourPanelPrev");
    const tourPanelNext = el("tourPanelNext");
    const tourPanelEnd = el("tourPanelEnd");
    const tourPanelOpen = el("tourPanelOpen");
    const tourLayer = el("tourLayer");
    const tourPath = el("tourPath");
    const mapHud = el("mapHud");
    const hudX = el("hudX");
    const hudY = el("hudY");
    const hudStatus = el("hudStatus");
    const adminModal = el("adminModal");
    const adminClose = el("adminClose");
    const adminCoords = el("adminCoords");

    let isAdmin = false;
    let pickMode = false;
    let dragState = null;
    const state = { activeNodeId: null, activeYearByNodeId: {} };
    const filters = { continent: "All" };
    const sorts = { mode: "lastUpdateDesc" };
    const tour = { active: false, ids: [], idx: 0 };
    let cardObserver = null;
    const yearContentCache = new Map();
    const yearListCache = new Map();
    let isSwitchingNode = false;

    function updateModalOpenState(open) {
        document.body.classList.toggle("is-modal-open", !!open);
    }

    function updateModalScrollState() {
        const max = 240;
        const progress = clamp(modal.scrollTop / max, 0, 1);
        modal.style.setProperty("--hero-collapse", progress.toFixed(3));
        modal.style.setProperty("--header-opacity", (0.65 + progress * 0.3).toFixed(3));
    }

    function resetModalScrollState() {
        modal.scrollTop = 0;
        modal.style.setProperty("--hero-collapse", "0");
        modal.style.setProperty("--header-opacity", "0.9");
    }

    function ensureMetaLinksTarget() {
        modalMeta.querySelectorAll("a").forEach((anchor) => {
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
        });
    }

    async function fetchNodeYearContent(node, year) {
        const baseYear = parseYearFromPath(node.mdPath);
        const cacheKey = `${node.id}:${year}`;
        if (yearContentCache.has(cacheKey)) {
            return yearContentCache.get(cacheKey);
        }
        const byYear = node.contentByYear;
        if (byYear && typeof byYear === "object") {
            const embedded = byYear[String(year)];
            if (embedded) {
                yearContentCache.set(cacheKey, embedded);
                return embedded;
            }
        }
        if (window.location.protocol === "file:" && node.content && year === baseYear) {
            yearContentCache.set(cacheKey, node.content);
            return node.content;
        }
        const path = nodeYearPath(node, year);
        const res = await fetch(path, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error(`Failed to load ${path}`);
        }
        const md = await res.text();
        yearContentCache.set(cacheKey, md);
        return md;
    }

    async function getAvailableYears(node) {
        if (yearListCache.has(node.id)) {
            return yearListCache.get(node.id);
        }
        const baseYear = parseYearFromPath(node.mdPath);
        const embeddedYears = getYearsFromContent(node);
        if (window.location.protocol === "file:" && embeddedYears.length) {
            const sorted = normalizeYears(embeddedYears);
            yearListCache.set(node.id, sorted);
            return sorted;
        }
        const candidates = getYearCandidates(baseYear);
        const available = new Set(embeddedYears);
        for (const year of candidates) {
            try {
                await fetchNodeYearContent(node, year);
                available.add(year);
            } catch {
                // ignore missing years
            }
        }
        if (!available.size && baseYear) {
            available.add(baseYear);
        }
        const sorted = normalizeYears(Array.from(available));
        yearListCache.set(node.id, sorted);
        return sorted;
    }

    function renderYearTabs(years, activeYear) {
        if (!years || years.length < 2) {
            modalYears.hidden = true;
            modalYearTabs.innerHTML = "";
            return;
        }
        modalYears.hidden = false;
        modalYearTabs.innerHTML = years
            .map((year) => {
                const active = year === activeYear ? "is-active" : "";
                return `<button class="node-modal__yearTab ${active}" type="button" data-year="${year}">${year}</button>`;
            })
            .join("");
    }


    function setAdminMode(on) {
        isAdmin = !!on;
        document.body.classList.toggle("is-admin", isAdmin);
        btnAdmin.textContent = isAdmin ? "Admin (on)" : "Admin";
        if (!isAdmin) {
            mapHud.hidden = true;
            setPickMode(false);
        }
    }

    function setPickMode(on) {
        pickMode = !!on;
        document.body.classList.toggle("is-picking-pin", pickMode);
        if (isAdmin) {
            mapHud.hidden = !pickMode;
        }
        btnPickPin.textContent = "Copy coordinates";
    }

    function updateHudFromEvent(e) {
        const rect = mapPins.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const xPct = clamp(x, 0, 100).toFixed(1);
        const yPct = clamp(y, 0, 100).toFixed(1);
        hudX.textContent = xPct;
        hudY.textContent = yPct;
        return { xPct, yPct };
    }

    function mapCoordinatesText() {
        return nodes
            .map((node) => {
                const { xPct, yPct } = nodePoint(node);
                return `${node.name || node.id}: xPct:${Number(xPct).toFixed(1)}, yPct:${Number(yPct).toFixed(1)}`;
            })
            .join("\n");
    }

    function startDrag(pin, e) {
        const rect = mapPins.getBoundingClientRect();
        dragState = { pin, rect };
        pin.classList.add("is-dragging");
        e.preventDefault();
    }

    function updateDrag(e) {
        if (!dragState) return;
        const { pin, rect } = dragState;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const xPct = clamp(x, 0, 100);
        const yPct = clamp(y, 0, 100);
        pin.style.left = `${xPct}%`;
        pin.style.top = `${yPct}%`;
        const node = nodes.find((n) => n.id === pin.dataset.nodeId);
        if (node) {
            node.mapCoordinates = `xPct:${xPct.toFixed(1)}, yPct:${yPct.toFixed(1)}`;
        }
        hudX.textContent = xPct.toFixed(1);
        hudY.textContent = yPct.toFixed(1);
    }

    function endDrag() {
        if (!dragState) return;
        dragState.pin.classList.remove("is-dragging");
        dragState = null;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            return false;
        }
    }

    function setHudStatus(message) {
        hudStatus.textContent = message;
        window.setTimeout(() => {
            hudStatus.textContent = "Click the map to copy x/y%.";
        }, 1400);
    }

function nodePoint(node) {
    if (Number.isFinite(node.lat) && Number.isFinite(node.lng)) {
        const point = latLngToPct(node.lat, node.lng);
        return {
            xPct: point.xPct,
            yPct: clamp(point.yPct + MAP_Y_OFFSET_PCT, 0, 100)
        };
    }
    if (typeof node.mapCoordinates === "string") {
        const matchX = node.mapCoordinates.match(/xPct\s*:\s*([0-9.]+)/i);
        const matchY = node.mapCoordinates.match(/yPct\s*:\s*([0-9.]+)/i);
        const x = matchX ? Number(matchX[1]) : NaN;
        const y = matchY ? Number(matchY[1]) : NaN;
        if (Number.isFinite(x) && Number.isFinite(y)) {
            return {
                xPct: x,
                yPct: clamp(y + MAP_Y_OFFSET_PCT, 0, 100)
            };
        }
    }
    if (Number.isFinite(node.xPct) && Number.isFinite(node.yPct)) {
        return {
            xPct: node.xPct,
            yPct: clamp(node.yPct + MAP_Y_OFFSET_PCT, 0, 100)
        };
    }
    return { xPct: 50, yPct: 50 };
}

    function pinPointForNodeId(nodeId) {
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return null;
        return nodePoint(node);
    }

    function renderPins() {
        mapPins.innerHTML = nodes
            .map((node) => {
                const { xPct, yPct } = nodePoint(node);
                const location = node.location || "TBD";
                const stage = node.nodeStage || "TBD";
                const lastUpdate = node.lastUpdate || "TBD";
                const flag = getFlagEmoji(node);
                return `
                    <button class="pin" type="button" data-node-id="${escapeHtml(node.id)}" style="left:${xPct}%; top:${yPct}%;">
                        <span class="pin__dot" aria-hidden="true"></span>
                        <div class="pin__bubble" aria-hidden="true">
                            <div class="pin__title">
                                <span class="pin__flag" aria-hidden="true">${escapeHtml(flag)}</span>
                                <span class="pin__label">${escapeHtml(node.name)}</span>
                            </div>
                            <div class="pin__meta">
                                <div class="pin__metaRow">
                                    <span class="pin__metaLabel">Location</span>
                                    <span class="pin__metaValue">${escapeHtml(location)}</span>
                                </div>
                                <div class="pin__metaRow">
                                    <span class="pin__metaLabel">Stage</span>
                                    <span class="pin__metaValue">${escapeHtml(stage)}</span>
                                </div>
                                <div class="pin__metaRow">
                                    <span class="pin__metaLabel">Last Update</span>
                                    <span class="pin__metaValue">${escapeHtml(lastUpdate)}</span>
                                </div>
                            </div>
                        </div>
                    </button>
                `;
            })
            .join("");
    }

    function sortNodes(list) {
        const sorted = [...list];
        sorted.sort((a, b) => {
            switch (sorts.mode) {
                case "lastUpdateAsc":
                    return parseLastUpdate(a.lastUpdate) - parseLastUpdate(b.lastUpdate);
                case "lastUpdateDesc":
                    return parseLastUpdate(b.lastUpdate) - parseLastUpdate(a.lastUpdate);
                case "nameDesc":
                    return String(b.name || "").localeCompare(String(a.name || ""), undefined, { sensitivity: "base" });
                case "locationAsc":
                    return String(a.location || "").localeCompare(String(b.location || ""), undefined, { sensitivity: "base" });
                case "locationDesc":
                    return String(b.location || "").localeCompare(String(a.location || ""), undefined, { sensitivity: "base" });
                case "nameAsc":
                default:
                    return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
            }
        });
        return sorted;
    }

    function renderNodeGrid() {
        const filtered = nodes.filter((node) => {
            if (filters.continent === "All") return true;
            return getContinentLabel(node) === filters.continent;
        });
        const sorted = sortNodes(filtered);
        nodeGrid.innerHTML = sorted
            .map((node) => {
                const location = node.location ? node.location : "Location TBD";
                const metaLine = location;
                return `
                    <article class="node-card" data-node-id="${escapeHtml(node.id)}">
                        <div class="node-card__media is-empty">
                            <img class="node-card__img" data-cover-node-id="${escapeHtml(node.id)}" alt="" loading="lazy" hidden />
                        </div>
                        <div class="node-card__body">
                            <div class="node-title">${escapeHtml(node.name)}</div>
                            <p class="node-description">${escapeHtml(metaLine)}</p>
                        </div>
                    </article>
                `;
            })
            .join("");
        hydrateCoverImages();
    }

    function observeNodeCards() {
        const cards = Array.from(nodeGrid.querySelectorAll(".node-card"));
        if (cardObserver) {
            cardObserver.disconnect();
        }
        if (!("IntersectionObserver" in window)) {
            cards.forEach((card) => card.classList.add("is-visible"));
            return;
        }
        cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        cardObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        cards.forEach((card) => cardObserver.observe(card));
    }

    function hydrateCoverImages() {
        const coverImages = Array.from(nodeGrid.querySelectorAll("[data-cover-node-id]"));
        coverImages.forEach((img) => {
            const node = nodes.find((n) => n.id === img.dataset.coverNodeId);
            if (!node) return;
            setCoverImage(img, node);
        });
    }

    function renderFilters() {
        const order = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Unknown"];
        const counts = {};
        nodes.forEach((node) => {
            const continent = getContinentLabel(node);
            counts[continent] = (counts[continent] || 0) + 1;
        });

        const items = order.filter((label) => counts[label]).map((label) => ({
            label,
            count: counts[label]
        }));
        const buttons = [
            { label: "All", count: nodes.length },
            ...items
        ];

        nodeFilters.innerHTML = buttons
            .map((item) => {
                const active = filters.continent === item.label ? "is-active" : "";
                return `<button class="node-filter ${active}" type="button" data-filter="${escapeHtml(item.label)}">${escapeHtml(item.label)} (${item.count})</button>`;
            })
            .join("");
    }

    function animatePath(fromId, toId) {
        const a = pinPointForNodeId(fromId);
        const b = pinPointForNodeId(toId);
        if (!a || !b) {
            tourPath.setAttribute("d", "");
            tourLayer.classList.remove("is-animating");
            return;
        }
        const d = `M ${a.xPct} ${a.yPct} L ${b.xPct} ${b.yPct}`;
        tourPath.setAttribute("d", d);
        tourLayer.classList.remove("is-animating");
        void tourLayer.offsetWidth;
        tourLayer.classList.add("is-animating");
        window.setTimeout(() => tourLayer.classList.remove("is-animating"), 1000);
    }

    function setTourCurrentPin(nodeId) {
        Array.from(mapPins.querySelectorAll(".pin")).forEach((p) => {
            p.classList.toggle("is-tour-current", p.dataset.nodeId === nodeId);
        });
    }

    function updateTourUI() {
        tourPanel.hidden = !tour.active;
        btnTour.textContent = tour.active ? "Tour (on)" : "Tour";
        const len = tour.ids.length;
        tourPanelPrev.disabled = !tour.active || len < 2;
        tourPanelNext.disabled = !tour.active || len < 2;
    }

    function openTourStep(nextIdx, fromId) {
        if (!tour.active) return;
        const len = tour.ids.length;
        if (len === 0) return;
        const idx = (nextIdx + len) % len;
        tour.idx = idx;
        const id = tour.ids[idx];
        const node = nodes.find((n) => n.id === id);
        if (!node) return;
        tourPanelTitle.textContent = node.name;
        tourPanelMeta.textContent = `Stop ${idx + 1} of ${len}`;
        tourPanelText.textContent = "Open the profile to learn about this local node.";
        setTourCurrentPin(id);
        if (fromId && fromId !== id) {
            animatePath(fromId, id);
        } else {
            tourPath.setAttribute("d", "");
        }
        updateTourUI();
    }

    function startTour() {
        if (nodes.length === 0) return;
        tour.active = true;
        tour.ids = nodes.map((n) => n.id);
        tour.idx = 0;
        updateTourUI();
        openTourStep(0, null);
    }

    function endTour() {
        tour.active = false;
        tour.ids = [];
        tour.idx = 0;
        updateTourUI();
        tourPath.setAttribute("d", "");
        setTourCurrentPin("");
    }

    function openModal() {
        if (!modal.open) modal.showModal();
        updateModalOpenState(true);
        resetModalScrollState();
        modal.classList.remove("is-opening");
        requestAnimationFrame(() => {
            modal.classList.add("is-opening");
        });
    }

    function closeModal() {
        if (modal.open) modal.close();
        updateModalOpenState(false);
        resetModalScrollState();
    }

    async function loadNodeYear(node, year, years) {
        modal.classList.add("is-loading");
        modalContent.innerHTML = "<p class=\"muted\">Loading...</p>";
        try {
            const md = await fetchNodeYearContent(node, year);
            modalHero.hidden = !modalHeroImg.src;
            modalContent.innerHTML = renderMarkdown(md);
        } catch (err) {
            if (node.content && year === parseYearFromPath(node.mdPath)) {
                modalHero.hidden = !modalHeroImg.src;
                modalContent.innerHTML = renderMarkdown(node.content);
            } else {
                modalHero.hidden = true;
                modalContent.innerHTML = `<p class="muted">Unable to load ${year} update.</p>`;
            }
        }
        state.activeYearByNodeId[node.id] = year;
        renderYearTabs(years, year);
        resetModalScrollState();
        window.setTimeout(() => modal.classList.remove("is-loading"), 140);
    }

    async function openNode(nodeId) {
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;
        state.activeNodeId = nodeId;
        modalTitle.textContent = node.name;
        setModalLogo(modalLogo, node);
        setCoverImage(modalHeroImg, node);
        const metaHtml = renderNodeMeta(node);
        modalMeta.innerHTML = metaHtml;
        modalMeta.hidden = !metaHtml;
        ensureMetaLinksTarget();
        openModal();
        const years = await getAvailableYears(node);
        const baseYear = parseYearFromPath(node.mdPath);
        const defaultYear = state.activeYearByNodeId[node.id] || years[0] || baseYear;
        if (defaultYear) {
            await loadNodeYear(node, defaultYear, years);
        } else {
            modalHero.hidden = true;
            modalContent.innerHTML = `<p class="muted">Unable to load node content.</p>`;
            renderYearTabs([], null);
        }
    }

    mapPins.addEventListener("click", async (e) => {
        const pin = e.target.closest(".pin[data-node-id]");
        if (pin) {
            if (!isAdmin) openNode(pin.dataset.nodeId);
            return;
        }
        if (!isAdmin) return;
        const coords = updateHudFromEvent(e);
        const text = `xPct:${coords.xPct}, yPct:${coords.yPct}`;
        const ok = await copyToClipboard(text);
        setHudStatus(ok ? `Copied: ${text}` : `Copy blocked — use: ${text}`);
    });

    mapPins.addEventListener("mousedown", (e) => {
        if (!isAdmin) return;
        const pin = e.target.closest(".pin[data-node-id]");
        if (!pin) return;
        startDrag(pin, e);
    });

    window.addEventListener("mousemove", (e) => {
        if (!isAdmin) return;
        if (dragState) {
            updateDrag(e);
        }
    });

    window.addEventListener("mouseup", () => {
        if (!isAdmin) return;
        endDrag();
    });

    mapPins.addEventListener("mousemove", (e) => {
        if (!isAdmin) return;
        updateHudFromEvent(e);
    });

    mapPins.addEventListener("mouseenter", () => {
        if (!isAdmin) return;
        mapHud.hidden = false;
    });

    mapPins.addEventListener("mouseleave", () => {
        if (!isAdmin || pickMode) return;
        mapHud.hidden = true;
    });

    nodeGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".node-card[data-node-id]");
        if (card) {
            openNode(card.dataset.nodeId);
        }
    });

    nodeFilters.addEventListener("click", (e) => {
        const button = e.target.closest(".node-filter[data-filter]");
        if (!button) return;
        filters.continent = button.dataset.filter || "All";
        renderFilters();
        renderNodeGrid();
        observeNodeCards();
    });

    nodeSort.addEventListener("change", (e) => {
        sorts.mode = e.target.value || "lastUpdateDesc";
        renderNodeGrid();
        observeNodeCards();
    });

    async function openAdjacentNode(direction) {
        if (!modal.open || isSwitchingNode) return;
        const currentId = state.activeNodeId;
        if (!currentId || nodes.length === 0) return;
        const idx = nodes.findIndex((node) => node.id === currentId);
        if (idx === -1) return;
        const nextIdx = (idx + direction + nodes.length) % nodes.length;
        const nextId = nodes[nextIdx].id;
        if (!nextId || nextId === currentId) return;
        isSwitchingNode = true;
        modal.classList.add("is-switching");
        window.setTimeout(async () => {
            await openNode(nextId);
            window.setTimeout(() => {
                modal.classList.remove("is-switching");
                isSwitchingNode = false;
            }, 200);
        }, 140);
    }

    document.addEventListener("keydown", (e) => {
        if (!modal.open) return;
        const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            openAdjacentNode(-1);
        }
        if (e.key === "ArrowRight") {
            e.preventDefault();
            openAdjacentNode(1);
        }
    });

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    modal.addEventListener("close", () => updateModalOpenState(false));
    modal.addEventListener("scroll", updateModalScrollState);
    modalYearTabs.addEventListener("click", (e) => {
        const button = e.target.closest(".node-modal__yearTab[data-year]");
        if (!button) return;
        const node = nodes.find((item) => item.id === state.activeNodeId);
        if (!node) return;
        const year = Number(button.dataset.year);
        const years = yearListCache.get(node.id) || [];
        if (Number.isNaN(year) || year === state.activeYearByNodeId[node.id]) return;
        loadNodeYear(node, year, years);
    });


    btnTour.addEventListener("click", () => {
        if (tour.active) endTour();
        else startTour();
    });
    tourPanelEnd.addEventListener("click", endTour);
    tourPanelPrev.addEventListener("click", () => {
        const fromId = tour.ids[tour.idx];
        openTourStep(tour.idx - 1, fromId);
    });
    tourPanelNext.addEventListener("click", () => {
        const fromId = tour.ids[tour.idx];
        openTourStep(tour.idx + 1, fromId);
    });
    tourPanelOpen.addEventListener("click", () => {
        if (!tour.active || tour.ids.length === 0) return;
        openNode(tour.ids[tour.idx]);
    });

    btnAdmin.addEventListener("click", () => {
        setAdminMode(!isAdmin);
        if (isAdmin && !adminModal.open) adminModal.showModal();
    });

    adminClose.addEventListener("click", () => {
        if (adminModal.open) adminModal.close();
    });
    adminModal.addEventListener("click", (e) => {
        if (e.target === adminModal) adminModal.close();
    });

    btnPickPin.addEventListener("click", () => {
        if (!isAdmin) return;
        const text = mapCoordinatesText();
        copyToClipboard(text).then((ok) => {
            adminCoords.textContent = ok ? "Copied node coordinates." : "Copy blocked — check clipboard.";
            setHudStatus(ok ? "Copied all coordinates." : "Copy blocked — check clipboard.");
        });
    });

    if (scrollIndicator && mapSection) {
        scrollIndicator.addEventListener("click", () => {
            mapSection.scrollIntoView({ behavior: "smooth" });
        });
        scrollIndicator.style.cursor = "pointer";
    }

    renderPins();
    renderFilters();
    renderNodeGrid();
    observeNodeCards();
    hydrateCoverImages();
    setAdminMode(false);
    updateTourUI();
}

document.addEventListener("DOMContentLoaded", main);
