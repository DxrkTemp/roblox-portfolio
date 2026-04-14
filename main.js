const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  document.body.classList.toggle("light-theme");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
  );
};

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
}

const elements = document.querySelectorAll(".fade-left, .fade-right");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, { threshold: 0.2 });

elements.forEach(el => observer.observe(el));

window.addEventListener("load", () => {
  document.querySelectorAll(".skill-bar").forEach(bar => {
    const fill = document.createElement("div");
    fill.style.width = bar.dataset.skill || "50%";
    bar.appendChild(fill);
  });
});

document.querySelectorAll(".video-card").forEach(card => {
  const video = card.querySelector("video");

  card.addEventListener("mouseenter", () => video.play());

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

const menuBtn = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

document.querySelectorAll(".card").forEach(card => {

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (y - 0.5) * 12;
    const rotateY = (x - 0.5) * -12;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `;

    card.style.setProperty("--x", `${x * 100}%`);
    card.style.setProperty("--y", `${y * 100}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  });

});
