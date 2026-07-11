window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
  }
});

const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.style.boxShadow = "0 8px 30px rgba(0,0,0,.08)";
    header.style.background = "rgba(246,239,232,.96)";
  } else {
    header.style.boxShadow = "none";
    header.style.background = "rgba(246,239,232,.90)";
  }
});

const fadeElements = document.querySelectorAll(".project,.card-box,.footer,.hero,.about-card,.info-card,.service-card");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade");
      setTimeout(() => {
        entry.target.classList.add("show");
      }, 150);
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach((el) => observer.observe(el));

const counters = document.querySelectorAll(".card-box h2");
const speed = 150;

counters.forEach((counter) => {
  const update = () => {
    const target = Number(counter.getAttribute("data-count") || counter.innerText.replace(/\D/g, ""));
    const count = Number(counter.getAttribute("data-count-value") || 0);
    const increment = Math.ceil(target / speed);

    if (count < target) {
      counter.setAttribute("data-count-value", String(count + increment));
      counter.innerText = `${count + increment}+`;
      setTimeout(update, 15);
    } else {
      counter.innerText = `${target}+`;
    }
  };

  update();
});

document.querySelectorAll("a").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "translateY(-5px)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translateY(0px)";
  });
});

const progress = document.createElement("div");
progress.style.position = "fixed";
progress.style.top = "0";
progress.style.left = "0";
progress.style.height = "4px";
progress.style.background = "#ff5a36";
progress.style.zIndex = "999999";
progress.style.width = "0%";
document.body.appendChild(progress);

window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = (window.pageYOffset / total) * 100;
  progress.style.width = `${progressWidth}%`;
});

document.querySelectorAll(".project").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0px)";
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

console.log("%cNextGen Devs Portfolio", "font-size:24px;color:#ff5a36;font-weight:bold;");