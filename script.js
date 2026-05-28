// ============================================
// DANE SAMOCHODÓW
// ============================================
const carsData = [
    { id: 1, name: "Lexus is220d", image: "https://flib.samar.pl/700/000/752000d6a7c3e637c362560.webp", price: 189, desc: "Elegancki sedan z napędem RWD. Idealny na dłuższe trasy.", category: "Sedan" },
    { id: 2, name: "Ford Ranger", image: "https://live.dealer-asset.co/images/pl3021/news/All-New-Ford-Ranger-Raptor_02.jpg?s=1024", price: 359, desc: "Luksusowy SUV z przestronnym wnętrzem i mocnym silnikiem.", category: "SUV" },
    { id: 3, name: "Mercedes C-Class", image: "https://www.autocentrum.pl/YXNhLWMudjkvCjpkYg57LWxSbngsFnQ-JwQpeC4UK3U4DT4kJBo3d3sMfG8sTW1qLV94NX5Ab2l_Wn4zfxRvPmEFKSUuED09PUUnOywGOHUtRiYnKlck", price: 249, desc: "Komfort i prestiż w jednym. Nowoczesne rozwiązania technologiczne.", category: "Sedan" },
    { id: 4, name: "Volkswagen Eos", image: "https://img.classistatic.de/api/v1/mo-prod/images/96/9612c198-a444-429c-8c1e-ff4ce247ac54?rule=mo-1600", price: 429, desc: "Mocny silnik V8 i sportowy charakter. Poczuj adrenalinę!", category: "Sport" },
    { id: 5, name: "Ford C-Max", image: "https://i.ytimg.com/vi/G4NBY_efutE/maxresdefault.jpg", price: 399, desc: "Przestronny bus idealny na przeprowadzki lub transport grupowy.", category: "Bus" },
    { id: 6, name: "Toyota Corolla", image: "https://scene7.toyota.eu/is/image/toyotaeurope/COR0001a_25_WEB_CROP:Large-Landscape?ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0&fmt=png-alpha", price: 129, desc: "Ekonomiczny i niezawodny sedan. Świetny do miasta.", category: "Sedan" },
    { id: 7, name: "Volkswagen Tiguan", image: "https://www.vwpress.pl/sites/default/files/styles/lightbox_xxlarge/public/2020-03/Volkswagen_Tiguan_2020_3.jpg", price: 279, desc: "Rodzinny SUV z dużą ilością miejsca.", category: "SUV" },
    { id: 8, name: "Renault Trafic", image: "https://cdn.renault.pl/content/dam/RenaultPL/renault-pl/ModelRange/Trafic/renault-trafic-bus-9-miejsc-2024.png", price: 349, desc: "Przestronny bus 9-osobowy. Idealny na wycieczki.", category: "Bus" }
];

// ============================================
// ZMIENNE GLOBALNE
// ============================================
let filteredCars = [...carsData];
let currentCategory = "all";
let currentSort = null;

// ============================================
// FUNKCJE POMOCNICZE
// ============================================
function calculatePricing(dayPrice) {
    const weekPrice = dayPrice * 7 * 0.85; // 15% zniżki
    const monthPrice = dayPrice * 30 * 0.75; // 25% zniżki
    return {
        day: dayPrice,
        week: Math.round(weekPrice),
        month: Math.round(monthPrice)
    };
}

// ============================================
// RENDEROWANIE SAMOCHODÓW
// ============================================
function renderCars() {
    let carsToRender = [...filteredCars];
    
    if (currentSort === "asc") {
        carsToRender.sort((a, b) => a.price - b.price);
    } else if (currentSort === "desc") {
        carsToRender.sort((a, b) => b.price - a.price);
    }
    
    const grid = document.getElementById("carsGrid");
    if (!grid) return;
    
    if (carsToRender.length === 0) {
        grid.innerHTML = `<div class="no-results"><i class="fas fa-car-side"></i><p>Brak samochodów w tej kategorii</p></div>`;
        return;
    }
    
    grid.innerHTML = carsToRender.map(car => `
        <div class="car-card scroll-reveal">
            <img class="car-img" src="${car.image}" alt="${car.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/1a1a1a/0066ff?text=${encodeURIComponent(car.name)}'">
            <div class="car-info">
                <h3>${car.name}</h3>
                <div class="price">${car.price} zł <span>/ dzień</span></div>
                <p class="car-desc">${car.desc}</p>
                <button class="btn-rent" data-car-id="${car.id}">
                    Wynajmij <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Dodanie eventów do przycisków wynajmu
    document.querySelectorAll('.btn-rent').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const carId = parseInt(btn.getAttribute('data-car-id'));
            const car = carsData.find(c => c.id === carId);
            if (car) openRentModal(car);
        });
    });
    
    activateScrollReveal();
}

// ============================================
// MODAL - OTWIERANIE I ZAMYKANIE
// ============================================
function openRentModal(car) {
    const modal = document.getElementById('rentModal');
    const modalTitle = document.getElementById('modalCarTitle');
    const modalImage = document.getElementById('modalCarImage');
    const priceDay = document.getElementById('priceDay');
    const priceWeek = document.getElementById('priceWeek');
    const priceMonth = document.getElementById('priceMonth');
    
    const pricing = calculatePricing(car.price);
    
    modalTitle.textContent = `Wynajmij ${car.name}`;
    modalImage.src = car.image;
    modalImage.alt = car.name;
    modalImage.onerror = function() {
        this.src = 'https://placehold.co/600x400/1a1a1a/0066ff?text=' + encodeURIComponent(car.name);
    };
    priceDay.textContent = `${pricing.day} zł`;
    priceWeek.textContent = `${pricing.week} zł`;
    priceMonth.textContent = `${pricing.month} zł`;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById('rentModal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// ============================================
// FILTROWANIE I SORTOWANIE
// ============================================
function applyFilters() {
    if (currentCategory === "all") {
        filteredCars = [...carsData];
    } else {
        filteredCars = carsData.filter(car => car.category === currentCategory);
    }
    renderCars();
}

// Obsługa filtrów
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        applyFilters();
    });
});

// Obsługa sortowania
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

// ============================================
// MOBILE MENU
// ============================================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function activateScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    
    reveals.forEach(el => observer.observe(el));
}

// ============================================
// SMOOTH SCROLL DLA KOTWIC
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === "#" || href === "") return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFEKT
// ============================================
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(0, 0, 0, 0.98)";
        navbar.style.backdropFilter = "blur(12px)";
    } else {
        navbar.style.background = "rgba(10, 10, 10, 0.95)";
    }
});

// ============================================
// OBSŁUGA MODALA
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // Dodanie klas scroll-reveal
    const sections = document.querySelectorAll('.feature-card');
    sections.forEach(el => {
        if (!el.classList.contains('scroll-reveal')) el.classList.add('scroll-reveal');
    });
    activateScrollReveal();
    
    // Modal close
    const modal = document.getElementById('rentModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // Zamknięcie ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Dodanie obsługi przycisków z API kontaktowym na telefonach
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Na telefonach zadziała domyślnie - ta funkcja tylko loguje
            console.log('Rozpoczynanie połączenia...');
        });
    });
});

// ============================================
// INICJALIZACJA
// ============================================
renderCars();
