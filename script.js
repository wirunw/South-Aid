// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializeNavigation();
    initializeSmoothScroll();
    initializeAnimations();
    initializeEmergencyFeatures();
});

// Search functionality
function initializeSearch() {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Real-time search as user types
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            showAllCards();
        } else {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showAllCards();
        return;
    }

    let visibleCount = 0;
    cards.forEach(card => {
        const cardText = getCardText(card).toLowerCase();
        if (cardText.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    showSearchResults(visibleCount, searchTerm);
}

function getCardText(card) {
    const title = card.querySelector('h3')?.textContent || '';
    const content = card.querySelector('.card-content')?.textContent || '';
    const header = card.querySelector('.card-header')?.textContent || '';
    return title + ' ' + content + ' ' + header;
}

function showSearchResults(count, searchTerm) {
    // Remove existing result message if any
    const existingResult = document.querySelector('.search-results');
    if (existingResult) {
        existingResult.remove();
    }

    if (count === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'search-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: white; border-radius: 15px; margin: 2rem 0;">
                <i class="fas fa-search" style="font-size: 3rem; color: #95a5a6; margin-bottom: 1rem;"></i>
                <h3 style="color: #2c3e50; margin-bottom: 0.5rem;">ไม่พบผลการค้นหา</h3>
                <p style="color: #7f8c8d;">ไม่พบข้อมูลที่ตรงกับ "${searchTerm}"</p>
                <button onclick="clearSearch()" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-times"></i> ล้างการค้นหา
                </button>
            </div>
        `;
        
        const searchSection = document.querySelector('.search-section');
        searchSection.parentNode.insertBefore(noResults, searchSection.nextSibling);
    }
}

function clearSearch() {
    searchInput.value = '';
    showAllCards();
    const existingResult = document.querySelector('.search-results');
    if (existingResult) {
        existingResult.remove();
    }
}

function showAllCards() {
    cards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('fade-in');
    });
    const existingResult = document.querySelector('.search-results');
    if (existingResult) {
        existingResult.remove();
    }
}

// Filter functionality
function initializeFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterCards(filter);
        });
    });
}

function filterCards(category) {
    let visibleCount = 0;
    
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            const cardCategory = card.dataset.category;
            if (cardCategory === category) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        }
    });

    // Show filter results message if needed
    showFilterResults(visibleCount, category);
}

function showFilterResults(count, category) {
    // Remove existing result message if any
    const existingResult = document.querySelector('.filter-results');
    if (existingResult) {
        existingResult.remove();
    }

    if (count === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'filter-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: white; border-radius: 15px; margin: 2rem 0;">
                <i class="fas fa-filter" style="font-size: 3rem; color: #95a5a6; margin-bottom: 1rem;"></i>
                <h3 style="color: #2c3e50; margin-bottom: 0.5rem;">ไม่พบข้อมูลในหมวดหมู่นี้</h3>
                <p style="color: #7f8c8d;">ไม่พบข้อมูลในหมวดหมู่ "${getCategoryName(category)}"</p>
            </div>
        `;
        
        const firstSection = document.querySelector('.section');
        firstSection.parentNode.insertBefore(noResults, firstSection.nextSibling);
    }
}

function getCategoryName(category) {
    const names = {
        'monitoring': 'ติดตามสถานการณ์',
        'help': 'ขอความช่วยเหลือ',
        'shelter': 'ศูนย์พักพิง',
        'donate': 'บริจาค'
    };
    return names[category] || category;
}

// Navigation functionality
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100; // Account for sticky header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on scroll
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
    cards.forEach(card => observer.observe(card));
    document.querySelectorAll('.section').forEach(section => observer.observe(section));
}

// Emergency features
function initializeEmergencyFeatures() {
    // Add click-to-call functionality for phone numbers
    document.querySelectorAll('.phone-number').forEach(phoneElement => {
        phoneElement.style.cursor = 'pointer';
        phoneElement.addEventListener('click', function() {
            const phoneNumber = this.textContent.replace(/[^0-9+]/g, '');
            if (phoneNumber) {
                window.location.href = `tel:${phoneNumber}`;
            }
        });
        
        // Add hover effect
        phoneElement.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        
        phoneElement.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    });

    // Add click-to-call for phone numbers in contact info
    document.querySelectorAll('.contact-info p').forEach(p => {
        const phoneText = p.textContent;
        const phoneMatch = phoneText.match(/(\d{2,3}-\d{3,4}-\d{3,4}|\d{10})/);
        
        if (phoneMatch && (phoneText.includes('โทร') || phoneText.includes('Tel'))) {
            p.style.cursor = 'pointer';
            p.addEventListener('click', function() {
                const phoneNumber = phoneMatch[0].replace(/[^0-9+]/g, '');
                if (phoneNumber) {
                    window.location.href = `tel:${phoneNumber}`;
                }
            });
            
            // Add hover effect
            p.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                this.style.borderRadius = '5px';
                this.style.transition = 'background-color 0.3s ease';
            });
            
            p.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
        }
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

// Utility functions
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

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        clearSearch();
        searchInput.blur();
    }
    
    // Number keys for quick filters
    if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const index = parseInt(e.key) - 1;
        if (filterBtns[index]) {
            filterBtns[index].click();
        }
    }
});

// Add print functionality
function printPage() {
    window.print();
}

// Add share functionality
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

// Add back to top button
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
        background: #3498db;
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
        backToTopBtn.style.background = '#2980b9';
        backToTopBtn.style.transform = 'scale(1.1)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.background = '#3498db';
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

// Add loading state for external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        // Add loading indicator
        const originalContent = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังโหลด...';
        this.style.pointerEvents = 'none';
        
        // Restore after a short delay
        setTimeout(() => {
            this.innerHTML = originalContent;
            this.style.pointerEvents = 'auto';
        }, 2000);
    });
});

// Console welcome message
console.log('%cศูนย์ช่วยเหลือผู้ประสบภัยน้ำท่วมภาคใต้ 2025', 'color: #3498db; font-size: 20px; font-weight: bold;');
console.log('%cสร้างขึ้นเพื่อการช่วยเหลือมนุษย์ 🙏', 'color: #27ae60; font-size: 14px;');
console.log('%cหากพบข้อผิดพลาดหรือต้องการแจ้งเพิ่มเติม กรุณาติดต่อ', 'color: #e74c3c; font-size: 12px;');
