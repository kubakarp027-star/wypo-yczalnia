// ============================================
// DANE SAMOCHODÓW
// ============================================
const carsData = [
    { id: 1, name: "Ford Transit", image: "bus_ford.png", price: 100, desc: "", category: "Bus" },
    { id: 2, name: "Ford Transit", image: "bus_ford2.png", price: 100, desc: "", category: "Bus" },
    { id: 3, name: "Ford Transit", image: "bus_ford5.png", price: 100, desc: "", category: "Bus" },
    { id: 4, name: "Ford Transit", image: "bus_ford4.png", price: 100, desc: "", category: "Bus" },
    { id: 5, name: "Ford Transit", image: "bus_ford3.png", price: 100, desc: "", category: "Bus" },
    { id: 6, name: "Ford Ranger", image: "ranger.png", price: 200, desc: "", category: "Pickup" },
    { id: 7, name: "Toyota Proace Verso", image: "bus_toyota.png", price: 100, desc: "", category: "Bus" },
    { id: 8, name: "Renault Trafic", image: "bus_renault.png", price: 100, desc: "", category: "Bus" },
    { id: 9, name: "Fiat Ducato", image: "bus_fiat.png", price: 100, desc: "", category: "Bus" },
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
                <div class="price"><span> Od </span>${car.price} zł <span>/ dzień</span></div>
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
/*  chwilowo wyłączone
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
*/
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
