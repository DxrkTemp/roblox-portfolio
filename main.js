const themeBtn = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
  );
});

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
}

const elements = document.querySelectorAll(".fade-left, .fade-right");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  { threshold: 0.2 }
);

elements.forEach(el => observer.observe(el));

window.addEventListener("load", () => {
  const widths = ["80%", "50%", "50%", "50%", "50%", "50%", "35%", "35%"];

  document.querySelectorAll(".skill-bar").forEach((bar, index) => {
    const fill = document.createElement("div");
    fill.style.width = widths[index] || "50%";
    bar.appendChild(fill);
  });
});

const typedCodeEl = document.getElementById("typedCode");

const codeLines = [
  { text: "local Developer = {", cls: "" },
  { text: '    Name = "DxrkTempestDev",', cls: "str" },
  { text: '    Role = "Lua Scripter / Web Dev",', cls: "str" },
  { text: "    Experience = 4,", cls: "num" },
  { text: "    Available = true", cls: "bool" },
  { text: "}", cls: "" },
];

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function colorize(line) {
  let text = escapeHtml(line);
  text = text.replace(/(&quot;|"[^"]*")/g, m => `<span class="tok-str">${m}</span>`);
  text = text.replace(/\b(local|true|false)\b/g, m => `<span class="tok-kw">${m}</span>`);
  text = text.replace(/\b(\d+)\b/g, m => `<span class="tok-num">${m}</span>`);
  return text;
}

async function typeCode() {
  if (!typedCodeEl) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    typedCodeEl.innerHTML = codeLines.map(l => colorize(l.text)).join("\n");
    return;
  }

  for (const line of codeLines) {
    let current = "";
    for (const char of line.text) {
      current += char;
      typedCodeEl.innerHTML = typedCodeEl.innerHTML.split("\n").slice(0, -1).concat(colorize(current)).join("\n");
      await new Promise(r => setTimeout(r, 14));
    }
    typedCodeEl.innerHTML += "\n";
    await new Promise(r => setTimeout(r, 80));
  }
}

typeCode();

const progressBar = document.getElementById("scrollProgressBar");
const statusSection = document.getElementById("statusSection");
const tabs = document.querySelectorAll(".tab[data-section]");
const trackedSections = document.querySelectorAll("section[id]");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        tabs.forEach(tab => {
          tab.classList.toggle("active", tab.dataset.section === id);
          if (tab.dataset.section === id) tab.setAttribute("aria-current", "true");
          else tab.removeAttribute("aria-current");
        });

        if (statusSection) statusSection.textContent = "#" + id;
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);

trackedSections.forEach(sec => sectionObserver.observe(sec));

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const cmdBtn = document.getElementById("cmdBtn");
const cmdPalette = document.getElementById("cmdPalette");
const cmdInput = document.getElementById("cmdInput");
const cmdList = document.getElementById("cmdList");

const commands = Array.from(tabs).map(tab => ({
  id: tab.dataset.section,
  name: tab.textContent.trim().replace(/\.\w+$/, ""),
  ext: tab.querySelector(".tab-ext")?.textContent || "",
}));

let selectedIndex = 0;

function renderCommands(filter = "") {
  const filtered = commands.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
  cmdList.innerHTML = "";

  filtered.forEach((c, i) => {
    const li = document.createElement("li");
    li.className = i === 0 ? "selected" : "";
    li.innerHTML = `<span class="cmd-name">${c.name}</span><span class="cmd-ext">${c.ext}</span>`;
    li.addEventListener("click", () => jumpTo(c.id));
    li.dataset.id = c.id;
    cmdList.appendChild(li);
  });

  selectedIndex = 0;
}

function jumpTo(id) {
  closeCmdPalette();
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: "smooth" });
}

function openCmdPalette() {
  cmdPalette.classList.add("show");
  cmdInput.value = "";
  renderCommands();
  setTimeout(() => cmdInput.focus(), 10);
}

function closeCmdPalette() {
  cmdPalette.classList.remove("show");
}

cmdBtn.addEventListener("click", openCmdPalette);

cmdPalette.addEventListener("click", e => {
  if (e.target === cmdPalette) closeCmdPalette();
});

cmdInput.addEventListener("input", () => renderCommands(cmdInput.value));

document.addEventListener("keydown", e => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    cmdPalette.classList.contains("show") ? closeCmdPalette() : openCmdPalette();
    return;
  }

  if (!cmdPalette.classList.contains("show")) return;

  const items = cmdList.querySelectorAll("li");
  if (e.key === "Escape") {
    closeCmdPalette();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (items.length) {
      items[selectedIndex]?.classList.remove("selected");
      selectedIndex = (selectedIndex + 1) % items.length;
      items[selectedIndex].classList.add("selected");
      items[selectedIndex].scrollIntoView({ block: "nearest" });
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (items.length) {
      items[selectedIndex]?.classList.remove("selected");
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      items[selectedIndex].classList.add("selected");
      items[selectedIndex].scrollIntoView({ block: "nearest" });
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    const target = items[selectedIndex];
    if (target) jumpTo(target.dataset.id);
  }
});

document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable — fail silently */
    }
    const icon = btn.querySelector("i");
    btn.classList.add("copied");
    if (icon) icon.className = "fas fa-check";
    setTimeout(() => {
      btn.classList.remove("copied");
      if (icon) icon.className = "fas fa-copy";
    }, 1600);
  });
});

document.querySelectorAll(".video-card").forEach(card => {
  const video = card.querySelector("video");
  if (!video) return;

  card.addEventListener("mouseenter", () => video.play());
  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

  card.addEventListener("click", e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      if (video.paused) video.play();
      else video.pause();
    }
  });
});

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".tab").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

const galleryImages = document.querySelectorAll(".bot-gallery img");
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.querySelector(".close-modal");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

let currentImage = 0;
let lastFocusedEl = null;

function showImage(index) {
  currentImage = index;
  modalImage.src = galleryImages[currentImage].src;
}

function openGallery(index) {
  lastFocusedEl = document.activeElement;
  modal.classList.add("show");
  showImage(index);
  closeModal.focus();
}

function closeGallery() {
  modal.classList.remove("show");
  if (lastFocusedEl) lastFocusedEl.focus();
}

galleryImages.forEach((img, index) => {
  img.setAttribute("tabindex", "0");
  img.setAttribute("role", "button");
  img.addEventListener("click", () => openGallery(index));
  img.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openGallery(index);
    }
  });
});

closeModal.addEventListener("click", closeGallery);

nextBtn.addEventListener("click", () => {
  currentImage = (currentImage + 1) % galleryImages.length;
  showImage(currentImage);
});

prevBtn.addEventListener("click", () => {
  currentImage = (currentImage - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentImage);
});

modal.addEventListener("click", e => {
  if (e.target === modal) closeGallery();
});

document.addEventListener("keydown", e => {
  if (!modal.classList.contains("show")) return;
  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();

  if (e.key === "Tab") {
    const focusable = modal.querySelectorAll("button, [tabindex]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
