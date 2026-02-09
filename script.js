const WHATSAPP_PHONE = "7XXXXXXXXXX";
const BRAND_NAME = "BRAND_NAME_HERE";
const MODELS = [
  {
    name: "Model Axiom",
    features: ["Деликатная механика", "Стабильность работы", "Компактный профиль"],
    image: "assets/implant-1.svg",
  },
  {
    name: "Model Atlas",
    features: ["Точная адаптация", "Сдержанный внешний контур", "Премиальные материалы"],
    image: "assets/implant-2.svg",
  },
  {
    name: "Model Orion",
    features: ["Надежная система", "Комфорт в использовании", "Стандарты США"],
    image: "assets/implant-3.svg",
  },
];

const DOCTORS = [
  {
    id: "d1",
    name: "Андрей Сергеев",
    title: "Врач-уролог",
    city: "Краснодар",
    experienceYears: 14,
    credentials: ["Клиническая практика", "Конфиденциальный прием"],
    photo: "assets/doctor-1.svg",
  },
  {
    id: "d2",
    name: "Ирина Воронова",
    title: "Врач-уролог",
    city: "Краснодар",
    experienceYears: 11,
    credentials: ["Индивидуальный план", "Премиальный сервис"],
    photo: "assets/doctor-2.svg",
  },
  {
    id: "d3",
    name: "Никита Климов",
    title: "Хирург-уролог",
    city: "Сочи",
    experienceYears: 16,
    credentials: ["Сертифицированные импланты", "Сопровождение"],
    photo: "assets/doctor-3.svg",
  },
  {
    id: "d4",
    name: "Ольга Селина",
    title: "Координатор сети",
    city: "Новороссийск",
    experienceYears: 9,
    credentials: ["Без давления", "Комфортная коммуникация"],
    photo: "assets/doctor-4.svg",
  },
  {
    id: "d5",
    name: "Михаил Руденко",
    title: "Врач-уролог",
    city: "Ростов-на-Дону",
    experienceYears: 18,
    credentials: ["Планирование", "Контроль качества"],
    photo: "assets/doctor-5.svg",
  },
  {
    id: "d6",
    name: "Елена Левина",
    title: "Куратор сопровождения",
    city: "Сочи",
    experienceYears: 12,
    credentials: ["Деликатная коммуникация", "Без лишних вопросов"],
    photo: "assets/doctor-6.svg",
  },
];

const messageTemplate =
  "Здравствуйте. Хочу конфиденциально узнать о фаллопротезировании. Город: [ваш город]. Предпочтительный врач: [если выбран].";

const buildWhatsAppLink = ({ city = "", doctorName = "" } = {}) => {
  const message = messageTemplate
    .replace("[ваш город]", city || "не указан")
    .replace("[если выбран]", doctorName || "не выбран");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
};

const ctaButtons = [
  "cta-header",
  "cta-hero",
  "cta-mobile",
  "cta-privacy",
  "cta-footer",
  "floatWa",
  "topbar-wa",
].map((id) => document.getElementById(id));

ctaButtons.forEach((btn) => {
  if (!btn) return;
  btn.setAttribute("href", buildWhatsAppLink());
  btn.setAttribute("target", "_blank");
  btn.setAttribute("rel", "noreferrer");
});

const brandName = document.getElementById("brandName");
if (brandName) {
  brandName.textContent = BRAND_NAME;
}

const implantGrid = document.getElementById("implantGrid");
if (implantGrid) {
  implantGrid.innerHTML = MODELS.map(
    (model) => `
      <article class="implant-card">
        <img src="${model.image}" alt="${model.name}" loading="lazy" />
        <h3>${model.name}</h3>
        <ul>
          ${model.features.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `
  ).join("");
}

const doctorList = document.getElementById("doctorList");
const doctorGrid = document.getElementById("doctorGrid");
const cityFilters = document.getElementById("cityFilters");

const renderDoctors = (list) => {
  const cards = list
    .map(
      (doctor) => `
      <article class="doctor-card">
        <div class="doctor-card__media">
          <img src="${doctor.photo}" alt="${doctor.name}" loading="lazy" />
          <div class="doctor-card__play">▶</div>
        </div>
        <h3>${doctor.name}</h3>
        <p>${doctor.title} · ${doctor.city}</p>
        <p>Общий стаж: ${doctor.experienceYears} лет</p>
        <p>${doctor.credentials.join(" · ")}</p>
        <a class="doctor-card__cta" href="${buildWhatsAppLink({
          city: doctor.city,
          doctorName: doctor.name,
        })}" target="_blank" rel="noreferrer">
          Написать анонимно →
        </a>
      </article>
    `
    )
    .join("");

  if (doctorList) {
    doctorList.innerHTML = cards;
  }
  if (doctorGrid) {
    doctorGrid.innerHTML = cards;
  }
};

const buildFilters = () => {
  if (!cityFilters) return;
  const counts = DOCTORS.reduce(
    (acc, doctor) => {
      acc[doctor.city] = (acc[doctor.city] || 0) + 1;
      return acc;
    },
    { Все: DOCTORS.length }
  );

  const cities = ["Все", ...Object.keys(counts).filter((c) => c !== "Все")];
  cityFilters.innerHTML = cities
    .map(
      (city) => `
      <button class="chip" data-city="${city}">
        ${city} <span>${counts[city]}</span>
      </button>
    `
    )
    .join("");

  const chips = cityFilters.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      const city = chip.dataset.city;
      const filtered = city === "Все" ? DOCTORS : DOCTORS.filter((d) => d.city === city);
      renderDoctors(filtered);
    });
  });

  const first = cityFilters.querySelector(".chip");
  if (first) {
    first.classList.add("active");
  }
};

buildFilters();
renderDoctors(DOCTORS);

const header = document.getElementById("header");
const handleScroll = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 20);
};

handleScroll();
window.addEventListener("scroll", handleScroll);

const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileClose = document.getElementById("mobileClose");

const toggleMenu = (open) => {
  if (!mobileMenu || !burger) return;
  const isOpen = open ?? !mobileMenu.classList.contains("open");
  mobileMenu.classList.toggle("open", isOpen);
  mobileMenu.setAttribute("aria-hidden", (!isOpen).toString());
  burger.setAttribute("aria-expanded", isOpen.toString());
};

if (burger) {
  burger.addEventListener("click", () => toggleMenu());
}
if (mobileClose) {
  mobileClose.addEventListener("click", () => toggleMenu(false));
}
if (mobileMenu) {
  mobileMenu.addEventListener("click", (event) => {
    if (event.target === mobileMenu) toggleMenu(false);
  });
}

const accordionItems = document.querySelectorAll(".accordion__item");
accordionItems.forEach((item) => {
  const button = item.querySelector(".accordion__title");
  if (!button) return;
  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", isOpen.toString());
  });
});

const trackPrev = document.getElementById("trackPrev");
const trackNext = document.getElementById("trackNext");
if (doctorList && trackPrev && trackNext) {
  trackPrev.addEventListener("click", () => {
    doctorList.scrollBy({ left: -280, behavior: "smooth" });
  });
  trackNext.addEventListener("click", () => {
    doctorList.scrollBy({ left: 280, behavior: "smooth" });
  });
}

const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const policyModal = document.getElementById("policyModal");
const policyOpen = document.getElementById("privacyPolicy");
const policyClose = document.getElementById("policyClose");

const togglePolicy = (open) => {
  if (!policyModal) return;
  policyModal.classList.toggle("open", open);
  policyModal.setAttribute("aria-hidden", (!open).toString());
};

if (policyOpen) {
  policyOpen.addEventListener("click", () => togglePolicy(true));
}
if (policyClose) {
  policyClose.addEventListener("click", () => togglePolicy(false));
}
if (policyModal) {
  policyModal.addEventListener("click", (event) => {
    if (event.target === policyModal) togglePolicy(false);
  });
}
