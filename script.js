// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScroll();
    initializeMap();
    initializeAccordion();
    initializeDonationCards();
    initializeFilters();
    initializeEmergencyFeatures();
    initializeAnimations();
});

// --- SMOOTH SCROLLING FOR NAVIGATION LINKS ---
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// --- MAP INITIALIZATION ---
function initializeMap() {
    // Check if map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = L.map('map').setView([7.1, 100.5], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const locations = {
        shelter: [
            { coords: [7.0089, 100.4971], title: "ศูนย์พักพิง ม.สงขลานครินทร์ (หาดใหญ่)" },
            { coords: [7.1753, 100.6130], title: "ศูนย์พักพิง ม.ราชภัฏสงขลา" },
            { coords: [7.0047, 100.4849], title: "ศูนย์พักพิง อาคารลานกีฬาภาษีเจริญ" },
            { coords: [7.0193, 100.4756], title: "ศูนย์พักพิง โรงเรียนอนุบาลเทศบาลเมืองบ้านพรุ" },
            { coords: [7.0041, 100.4956], title: "ศูนย์บริการประสานงานกลาง (รพ.สงขลานครินทร์)" },
            { coords: [6.8779, 100.4308], title: "อบจ.สตูล บริการช่วยเหลือฉุกเฉิน" }
        ],
        donation: [
            { coords: [7.0089, 100.4971], title: "จุดรับบริจาค ม.สงขลานครินทร์ (อาคารมรรคทิพย์)" },
            { coords: [7.0089, 100.4971], title: "จุดรับบริจาค ม.สงขลานครินทร์ (ศูนย์กีฬา)" },
            { coords: [7.0, 100.48], title: "จุดรับบริจาค เทศบาลเมืองบ้านพรุ" }
        ]
    };

    const layers = {
        shelter: L.layerGroup().addTo(map),
        donation: L.layerGroup().addTo(map)
    };

    const icons = {
        shelter: L.icon({ 
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', 
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', 
            iconSize: [25, 41], 
            iconAnchor: [12, 41], 
            popupAnchor: [1, -34], 
            shadowSize: [41, 41] 
        }),
        donation: L.icon({ 
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', 
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', 
            iconSize: [25, 41], 
            iconAnchor: [12, 41], 
            popupAnchor: [1, -34], 
            shadowSize: [41, 41] 
        })
    };

    for (const type in locations) {
        locations[type].forEach(loc => {
            L.marker(loc.coords, { icon: icons[type] })
                .bindPopup(`<b>${loc.title}</b>`)
                .addTo(layers[type]);
        });
    }

    // Map toggle buttons
    document.querySelectorAll('.map-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const layer = btn.dataset.layer;
            if (map.hasLayer(layers[layer])) {
                map.removeLayer(layers[layer]);
                btn.classList.remove('active');
            } else {
                map.addLayer(layers[layer]);
                btn.classList.add('active');
            }
        });
    });
}

// --- ACCORDION LOGIC ---
function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            content.classList.toggle('show');
            const icon = header.querySelector('.fa-chevron-down, .fa-chevron-up');
            if(icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    });
}

// --- DONATION CARD DETAILS LOGIC ---
function initializeDonationCards() {
    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            content.classList.toggle('show');
            btn.textContent = content.classList.contains('show') ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด & บริจาค';
        });
    });
}

// --- FILTER LOGIC ---
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const donationCards = document.querySelectorAll('.donation-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            donationCards.forEach(card => {
                if (filter === 'all' || card.dataset.category.includes(filter)) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// --- EMERGENCY FEATURES ---
function initializeEmergencyFeatures() {
    // Add click-to-call functionality for phone numbers
    document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
        phoneLink.addEventListener('click', function(e) {
            // Let the default behavior handle the call
            console.log('Calling:', this.getAttribute('href'));
        });
    });

    // Add emergency alert functionality
    addEmergencyAlert();
}

function addEmergencyAlert() {
    // Create emergency alert banner
    const emergencyAlert = document.createElement('div');
    emergencyAlert.className = 'emergency-alert';
    emergencyAlert.innerHTML = `
        <div style="background: #e74c3c; color: white; padding: 1rem; text-align: center; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1001; box-shadow: 0 -2px 10px rgba(0,0,0,0.2);">
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; animation: pulse 1s infinite;"></i>
                <span style="font-weight: 600;">ฉุกเฉิน: หากต้องการความช่วยเหลือด่วน โทร 1669</span>
                <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;">
                    <i class="fas fa-times"></i> ปิด
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(emergencyAlert);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (emergencyAlert.style.display !== 'none') {
            emergencyAlert.style.display = 'none';
        }
    }, 10000);
}

// --- ANIMATIONS ---
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .donation-card, .section').forEach(element => {
        observer.observe(element);
    });
}

// --- UTILITY FUNCTIONS ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- KEYBOARD SHORTCUTS ---
document.addEventListener('keydown', function(e) {
    // Escape to close emergency alert
    if (e.key === 'Escape') {
        const emergencyAlert = document.querySelector('.emergency-alert');
        if (emergencyAlert) {
            emergencyAlert.style.display = 'none';
        }
    }
    
    // Number keys for quick filters (1-5)
    if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const index = parseInt(e.key) - 1;
        if (filterButtons[index]) {
            filterButtons[index].click();
        }
    }
});

// --- ADD BACK TO TOP BUTTON ---
function addBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--info-color);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.background = '#0dcaf0';
        backToTopBtn.style.transform = 'scale(1.1)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.background = 'var(--info-color)';
        backToTopBtn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

// Initialize back to top button
addBackToTopButton();

// --- SHARE FUNCTIONALITY ---
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'ศูนย์ช่วยเหลือผู้ประสบภัยน้ำท่วมภาคใต้ 2025',
            text: 'ข้อมูลช่วยเหลือผู้ประสบภัยน้ำท่วมภาคใต้ - แหล่งข้อมูล ศูนย์พักพิง บริจาค และติดต่อฉุกเฉิน',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('คัดลอกลิงก์แล้ว!');
        });
    }
}

// --- CONSOLE WELCOME MESSAGE ---
console.log('%cศูนย์ช่วยเหลือผู้ประสบภัยน้ำท่วมภาคใต้ 2025', 'color: #0dcaf0; font-size: 20px; font-weight: bold;');
console.log('%cสร้างขึ้นเพื่อการช่วยเหลือมนุษย์ 🙏', 'color: #198754; font-size: 14px;');
console.log('%cหากพบข้อผิดพลาดหรือต้องการแจ้งเพิ่มเติม กรุณาติดต่อ', 'color: #dc3545; font-size: 12px;');
