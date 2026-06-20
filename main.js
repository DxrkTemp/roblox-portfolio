const themeBtn = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme")
      ? "light"
      : "dark"
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
  const widths = ["80%", "35%", "35%", "50%", "50%", "50%", "50%", "50%"];

  document.querySelectorAll(".skill-bar").forEach((bar, index) => {
    const fill = document.createElement("div");
    fill.style.width = widths[index] || "50%";
    bar.appendChild(fill);
  });
});

document.querySelectorAll(".video-card").forEach(card => {
  const video = card.querySelector("video");

  card.addEventListener("mouseenter", () => {
    video.play();
  });

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

  card.addEventListener("click", e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  });
});

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
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

function showImage(index) {
  currentImage = index;
  modalImage.src = galleryImages[currentImage].src;
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    modal.classList.add("show");
    showImage(index);
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

nextBtn.addEventListener("click", () => {
  currentImage = (currentImage + 1) % galleryImages.length;
  showImage(currentImage);
});

prevBtn.addEventListener("click", () => {
  currentImage =
    (currentImage - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentImage);
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

document.addEventListener("keydown", e => {
  if (!modal.classList.contains("show")) return;

  if (e.key === "Escape") {
    modal.classList.remove("show");
  }

  if (e.key === "ArrowRight") {
    nextBtn.click();
  }

  if (e.key === "ArrowLeft") {
    prevBtn.click();
  }
});
