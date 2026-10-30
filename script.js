/* ======================================================
   FOOTER YEAR
   ====================================================== */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ======================================================
   CURSOR GLOW
   ====================================================== */
const cursorGlow = document.getElementById("cursorGlow");
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = 0,
    mouseY = 0,
    glowX = 0,
    glowY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  const animateGlow = () => {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top = glowY + "px";
    requestAnimationFrame(animateGlow);
  };
  animateGlow();
}

/* ======================================================
   HEADER SCROLL STATE
   ====================================================== */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

/* ======================================================
   MOBILE NAV
   ====================================================== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
    }),
  );
}

/* ======================================================
   ACTIVE NAV LINK ON SCROLL
   ====================================================== */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
  });
  navItems.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`),
  );
});

/* ======================================================
   REVEAL ON SCROLL
   ====================================================== */
const revealEls = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);
revealEls.forEach((el) => revealObs.observe(el));

/* ======================================================
   ANIMATED COUNTERS
   ====================================================== */
const counters = document.querySelectorAll("[data-count]");
const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  },
  { threshold: 0.5 },
);
counters.forEach((el) => counterObs.observe(el));

/* ======================================================
   TYPING EFFECT
   ====================================================== */
const typedEl = document.getElementById("typedText");
if (typedEl) {
  const words = [
    "MERN Stack Developer",
    "Full Stack Engineer",
    "React Enthusiast",
    "UI/UX Craftsman",
    "Problem Solver",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const word = words[wordIndex];
    if (!deleting) {
      typedEl.textContent = word.substring(0, ++charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = word.substring(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 45 : 90);
  };
  type();
}

/* ======================================================
   PROFILE CARD 3D TILT
   ====================================================== */
const tiltCard = document.getElementById("tiltCard");
if (tiltCard && window.matchMedia("(pointer: fine)").matches) {
  tiltCard.addEventListener("mousemove", (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    tiltCard.style.transform = `
      perspective(1000px)
      rotateY(${(x - 0.5) * 12}deg)
      rotateX(${-(y - 0.5) * 12}deg)
      translateY(-4px)
    `;

    const glow = tiltCard.querySelector(".card-glow");
    if (glow) {
      glow.style.setProperty("--mx", `${x * 100}%`);
      glow.style.setProperty("--my", `${y * 100}%`);
    }
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "";
  });
}

/* ======================================================
   PROFILE PHOTO 3D DRAG
   ====================================================== */
const photoBox = document.getElementById("profilePhoto");
if (photoBox) {
  const photo = photoBox.querySelector("img");
  if (photo) {
    let dragging = false;
    let startX = 0;
    let rotation = 0;

    const startDrag = (x) => {
      dragging = true;
      startX = x;
      photoBox.style.cursor = "grabbing";
    };
    const moveDrag = (x) => {
      if (!dragging) return;
      rotation += (x - startX) * 0.7;
      rotation = Math.max(-90, Math.min(90, rotation));
      photo.style.transform = `rotateY(${rotation}deg)`;
      startX = x;
    };
    const endDrag = () => {
      dragging = false;
      photoBox.style.cursor = "grab";
    };

    photoBox.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startDrag(e.clientX);
    });
    document.addEventListener("mousemove", (e) => moveDrag(e.clientX));
    document.addEventListener("mouseup", endDrag);

    photoBox.addEventListener(
      "touchstart",
      (e) => startDrag(e.touches[0].clientX),
      { passive: true },
    );
    document.addEventListener(
      "touchmove",
      (e) => dragging && moveDrag(e.touches[0].clientX),
      { passive: true },
    );
    document.addEventListener("touchend", endDrag);
  }
}

/* ======================================================
   SKILLS SLIDER
   ====================================================== */
const skillsData = [
  { n: "HTML", t: "Markup Language", c: "#e34c26", i: "HTML" },
  { n: "CSS", t: "Styling Language", c: "#264de4", i: "CSS" },
  { n: "JavaScript", t: "Programming Language", c: "#f7df1e", i: "JS" },
  { n: "React JS", t: "Frontend Library", c: "#61dafb", i: "⚛" },
  { n: "jQuery", t: "JS Library", c: "#0769ad", i: "JQ" },
  { n: "Node JS", t: "JS Runtime", c: "#3c873a", i: "JS" },
  { n: "Express JS", t: "Backend Framework", c: "#ffffff", i: "EX" },
  { n: "MongoDB", t: "Database", c: "#47a248", i: "DB" },
  { n: "Tailwind CSS", t: "CSS Framework", c: "#38bdf8", i: "~" },
  { n: "Bootstrap", t: "CSS Framework", c: "#7952b3", i: "B" },
  { n: "VS Code", t: "Code Editor", c: "#007acc", i: "VS" },
  { n: "GitHub", t: "Repository", c: "#ffffff", i: "GH" },
];

const skillCard = (s) => `
  <div class="skill" style="--skill-color:${s.c};">
    <div class="skill-icon" style="background:${s.c}22; color:${s.c};">${s.i}</div>
    <div class="skill-info">
      <div class="skill-name">${s.n}</div>
      <div class="skill-type">${s.t}</div>
    </div>
  </div>
`;

const track = document.getElementById("skillsTrack");
const trackRev = document.getElementById("skillsTrackReverse");
if (track) {
  track.innerHTML =
    skillsData.map(skillCard).join("") + skillsData.map(skillCard).join("");
}
if (trackRev) {
  const rev = [...skillsData].reverse();
  trackRev.innerHTML =
    rev.map(skillCard).join("") + rev.map(skillCard).join("");
}

// Mouse-tracked glow on skill cards
document.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".skills-track .skill").forEach((card) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    }
  });
});

/* ======================================================
   PROJECTS
   ====================================================== */
// const projects = [
//   {
//     n: "Real Estate Management",
//     tags: ["MERN", "JWT", "MongoDB"],
//     d: "Full-stack real estate platform with buyer, seller and admin panels, property management, wishlist and inquiries.",
//     link: "https://real-estate-seven-orpin.vercel.app/",
//     img: "",
//     status: "live",
//   },
//   {
//     n: "Hospital Management System",
//     tags: ["MERN", "Auth", "Payments"],
//     d: "Healthcare platform with patient, doctor and admin panels, appointments, services and online payments.",
//     link: "https://hospital-gamma-nine.vercel.app/",
//     img: "images/hospital.png",
//     status: "live",
//   },
//   {
//     n: "Food Delivery App",
//     tags: ["MERN", "Cart", "Orders"],
//     d: "Food delivery app with user auth, food management, cart, orders and admin functionality.",
//     link: "https://food-theta-lovat.vercel.app/",
//     img: "images/food-delivery.png",
//     status: "live",
//   },
//   {
//     n: "Shopping Website",
//     tags: ["MERN", "E-commerce"],
//     d: "Full-stack shopping site with auth, product management, cart, orders and admin features.",
//     link: "",
//     img: "images/shopping.png",
//     status: "soon",
//   },
//   {
//     n: "FitFusion Gym Website",
//     tags: ["HTML", "CSS", "JS", "Bootstrap"],
//     d: "Responsive gym website with modern fitness-focused UI and smooth animations.",
//     link: "",
//     img: "images/fitfusion.png",
//     status: "soon",
//   },
// ];

const projects = [
  {
    n: "Real Estate Management",
    tags: ["MERN", "JWT", "MongoDB"],
    d: "Full-stack real estate platform with buyer, seller and admin panels, property management, wishlist and inquiries.",
    link: "https://real-estate-seven-orpin.vercel.app/",
    img: "images/RealEstate.jpg.jpg", // ← NOTE: no slash, no space
    status: "live",
  },
  {
    n: "Hospital Management System",
    tags: ["MERN", "Auth", "Payments"],
    d: "Healthcare platform with patient, doctor and admin panels, appointments, services and online payments.",
    link: "https://hospital-gamma-nine.vercel.app/",
    img: "images/hospital.jpg.jpg", // ← SAME style
    status: "live",
  },
  {
    n: "Food Delivery App",
    tags: ["MERN", "Cart", "Orders"],
    d: "Food delivery app with user auth, food management, cart, orders and admin functionality.",
    link: "https://food-theta-lovat.vercel.app/",
    img: "images/1789984230458.jpg", // ← SAME style
    status: "live",
  },
  {
    n: "Shopping Website",
    tags: ["MERN", "E-commerce"],
    d: "Full-stack shopping site with auth, product management, cart, orders and admin features.",
    link: "",
    img: "images/shopping.png", // ← SAME style
    status: "soon",
  },
  {
    n: "FitFusion Gym Website",
    tags: ["HTML", "CSS", "JS"],
    d: "Responsive gym website with modern fitness-focused UI and smooth animations.",
    link: "",
    img: "images/zym.png", // ← SAME style
    status: "soon",
  },
];

const projectsGrid = document.getElementById("projectsGrid");
if (projectsGrid) {
  projectsGrid.innerHTML = projects
    .map(
      (p) => `
    <a class="project-card reveal" href="${p.link || "#"}" target="${p.link ? "_blank" : "_self"}" rel="noopener noreferrer">
      <div class="project-thumb">
        <img src="${p.img}" alt="${p.n}" loading="lazy" />
        <div class="project-overlay">
          ${p.link ? `<span class="project-overlay-btn">View Live →</span>` : `<span class="project-overlay-btn">Coming Soon</span>`}
        </div>
      </div>
      <div class="project-body">
        <div class="project-tags">
          ${p.tags.map((t) => `<span class="project-tag">${t}</span>`).join("")}
        </div>
        <h3>${p.n}</h3>
        <p>${p.d}</p>
        <div class="project-footer">
          <span class="project-status ${p.status === "soon" ? "coming" : ""}">
            ${p.status === "live" ? "Live" : "In progress"}
          </span>
          <span class="project-arrow">→</span>
        </div>
      </div>
    </a>
  `,
    )
    .join("");

  projectsGrid
    .querySelectorAll(".reveal")
    .forEach((el) => revealObs.observe(el));
}

/* ======================================================
   EMAILJS
   ====================================================== */
if (typeof emailjs !== "undefined") {
  emailjs.init({ publicKey: "P44nX0U63QRnCb1fs" });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (typeof emailjs === "undefined") {
      alert("Email service load nahi hua. Page refresh karke try karein.");
      return;
    }

    const btn = this.querySelector('button[type="submit"]');

    // Loading state
    btn.classList.add("loading");
    btn.disabled = true;

    emailjs
      .sendForm("service_zpw0ffc", "template_7qvpsod", this)
      .then(() => {
        btn.classList.remove("loading");
        btn.disabled = false;

        // Success animation
        btn.innerHTML = `
          <span class="btn-text" style="display:inline;">✓ Sent successfully!</span>
        `;
        btn.style.background = "linear-gradient(135deg, #4ade80, #22c55e)";
        btn.style.color = "#0a0a12";

        this.reset();

        setTimeout(() => {
          btn.innerHTML = `
            <span class="btn-text">Send message</span>
            <span class="btn-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </span>
            <span class="btn-loading">
              <span class="loader-dot"></span>
              <span class="loader-dot"></span>
              <span class="loader-dot"></span>
            </span>
          `;
          btn.style.background = "";
          btn.style.color = "";
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        btn.classList.remove("loading");
        btn.disabled = false;
        alert("Message send nahi ho paya. Please try again.");
      });
  });
}

/* ======================================================
   SMOOTH ANCHOR SCROLL
   ====================================================== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
