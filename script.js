// ----- DANE (mock) -----
const carsData = [
    { id: 1, name: "Audi A4", image: "https://cdn.galleries.smcloud.net/t/galleries/gf-zHhQ-nHhf-hhT8_audi-a4-b9-45-tfsi-quattro-lifting-2020-1920x1080-nocrop.jpg", price: 189, desc: "Elegancki sedan z napędem quattro. Idealny na dłuższe trasy.", category: "Sedan" },
    { id: 2, name: "BMW X5", image: "https://mediapool.bmwgroup.com/cache/P9/202301/P90492262/P90492262-the-new-bmw-x5-xdrive50e-04-23-600px.jpg", price: 359, desc: "Luksusowy SUV z przestronnym wnętrzem i mocnym silnikiem.", category: "SUV" },
    { id: 3, name: "Mercedes C-Class", image: "https://www.autocentrum.pl/YXNhLWMudjkvCjpkYg57LWxSbngsFnQ-JwQpeC4UK3U4DT4kJBo3d3sMfG8sTW1qLV94NX5Ab2l_Wn4zfxRvPmEFKSUuED09PUUnOywGOHUtRiYnKlck", price: 249, desc: "Komfort i prestiż w jednym. Nowoczesne rozwiązania technologiczne.", category: "Sedan" },
    { id: 4, name: "Ford Mustang", image: "https://www.ford.pl/content/dam/guxeu/rhd/central/cars/S650-Mustang/my26/column_cards/ford-eu-S650_Nite_Pony_CG_Thumbnail_1000x667.jpg", price: 429, desc: "Mocny silnik V8 i sportowy charakter. Poczuj adrenalinę!", category: "Sport" },
    { id: 5, name: "Ford Transit", image: "https://galeria.bankier.pl/p/8/4/50cdad7515d425-768-460-30-299-2800-1679.webp", price: 399, desc: "Przestronny bus idealny na przeprowadzki lub transport grupowy.", category: "Bus" },
    { id: 6, name: "Toyota Corolla", image: "https://scene7.toyota.eu/is/image/toyotaeurope/COR0001a_25_WEB_CROP:Large-Landscape?ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0&fmt=png-alpha", price: 129, desc: "Ekonomiczny i niezawodny sedan. Świetny do miasta.", category: "Sedan" }
];

let filteredCars = [...carsData];
let currentCategory = "all";
let currentSort = null;  // 'asc' or 'desc'

// Funkcja obliczająca ceny na dzień, tydzień i miesiąc
function calculatePricing(dayPrice) {
    const weekPrice = dayPrice * 7 * 0.85; // 15% zniżki przy tygodniu
    const monthPrice = dayPrice * 30 * 0.75; // 25% zniżki przy miesiącu
    return {
        day: dayPrice,
        week: Math.round(weekPrice),
        month: Math.round(monthPrice)
    };
}

// Renderowanie samochodów
function renderCars() {
    let carsToRender = [...filteredCars];
    if (currentSort === "asc") {
        carsToRender.sort((a,b) => a.price - b.price);
    } else if (currentSort === "desc") {
        carsToRender.sort((a,b) => b.price - a.price);
    }
    const grid = document.getElementById("carsGrid");
    if (!grid) return;
    if (carsToRender.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px;">Brak samochodów w tej kategorii 😢</div>`;
        return;
    }
    grid.innerHTML = carsToRender.map(car => `
        <div class="car-card scroll-reveal">
            <img class="car-img" src="${car.image}" alt="${car.name}" loading="lazy">
            <div class="car-info">
                <h3>${car.name}</h3>
                <div class="price">${car.price} zł <span>/ dzień</span></div>
                <p class="car-desc">${car.desc}</p>
                <button class="btn-rent" data-car-id="${car.id}">Wynajmij <i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    `).join('');

    // Do wszystkich przycisków wynajmu dodajemy event otwierania modala
    document.querySelectorAll('.btn-rent').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const carId = parseInt(btn.getAttribute('data-car-id'));
            const car = carsData.find(c => c.id === carId);
            if (car) {
                openRentModal(car);
            }
        });
    });
    activateScrollReveal();
}

// Funkcja otwierająca modal z danymi samochodu
function openRentModal(car) {
    const modal = document.getElementById('rentModal');
    const modalTitle = document.getElementById('modalCarTitle');
    const modalImage = document.getElementById('modalCarImage');
    const priceDay = document.getElementById('priceDay');
    const priceWeek = document.getElementById('priceWeek');
    const priceMonth = document.getElementById('priceMonth');
    
    // Oblicz ceny
    const pricing = calculatePricing(car.price);
    
    // Uzupełnij dane w modalu
    modalTitle.textContent = `Wynajmij ${car.name}`;
    modalImage.src = car.image;
    modalImage.alt = car.name;
    priceDay.textContent = `${pricing.day} zł`;
    priceWeek.textContent = `${pricing.week} zł`;
    priceMonth.textContent = `${pricing.month} zł`;
    
    // Pokaż modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Zablokuj scrollowanie strony
}

// Zamknięcie modala
function closeModal() {
    const modal = document.getElementById('rentModal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Odblokuj scrollowanie
    }
}

// Filtrowanie
function applyFilters() {
    if (currentCategory === "all") {
        filteredCars = [...carsData];
    } else {
        filteredCars = carsData.filter(car => car.category === currentCategory);
    }
    renderCars();
}

// Obsługa filtrów i sortowania
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        applyFilters();
    });
});

document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const sortVal = btn.getAttribute('data-sort');
        if (currentSort === sortVal) {
            currentSort = null;
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        } else {
            currentSort = sortVal;
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        renderCars();
    });
});

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if(menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Scroll reveal (Intersection Observer)
function activateScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(el => observer.observe(el));
}

// Obsługa modala - zamknięcie przez X lub kliknięcie poza modalem
document.addEventListener("DOMContentLoaded", () => {
    // Dodanie klas do sekcji i kart
    const sections = document.querySelectorAll('#features, #location, .car-card');
    sections.forEach(el => {
        if(!el.classList.contains('scroll-reveal')) el.classList.add('scroll-reveal');
    });
    activateScrollReveal();
    
    // Zmiana koloru navbar przy scrollu
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(0,0,0,0.95)";
            navbar.style.backdropFilter = "blur(12px)";
        } else {
            navbar.style.background = "rgba(10, 10, 10, 0.85)";
        }
    });
    
    // Obsługa modala
    const modal = document.getElementById('rentModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Zamknięcie po kliknięciu poza modalem
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Zamknięcie po naciśnięciu ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
});

// Smooth scroll dla kotwic
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if(href === "#" || href === "") return;
        const target = document.querySelector(href);
        if(target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Inicjalne renderowanie
renderCars();