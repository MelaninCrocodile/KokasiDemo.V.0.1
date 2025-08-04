// Smooth scrolling for navigation links
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

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.borderBottom = '1px solid rgba(255, 0, 0, 0.5)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.borderBottom = '1px solid rgba(255, 0, 0, 0.3)';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});

// Sample hotspot data (in a real implementation, this would come from an API)
const hotspots = [
    {
        id: 1,
        name: "Vosloorus Shopping Centre",
        address: "123 Main Street, Vosloorus, Gauteng",
        distance: "0.5 km",
        status: "active",
        coordinates: { x: 20, y: 15 }
    },
    {
        id: 2,
        name: "Katlehong Community Center",
        address: "456 Community Road, Katlehong, Gauteng",
        distance: "1.2 km",
        status: "active",
        coordinates: { x: 40, y: 30 }
    },
    {
        id: 3,
        name: "Thokoza Library",
        address: "789 Library Street, Thokoza, Gauteng",
        distance: "2.1 km",
        status: "maintenance",
        coordinates: { x: 60, y: 25 }
    },
    {
        id: 4,
        name: "Alberton Mall",
        address: "321 Mall Avenue, Alberton, Gauteng",
        distance: "3.5 km",
        status: "active",
        coordinates: { x: 80, y: 45 }
    },
    {
        id: 5,
        name: "Germiston Stadium",
        address: "654 Stadium Drive, Germiston, Gauteng",
        distance: "4.2 km",
        status: "active",
        coordinates: { x: 30, y: 60 }
    },
    {
        id: 6,
        name: "Boksburg Central",
        address: "987 Central Plaza, Boksburg, Gauteng",
        distance: "5.1 km",
        status: "active",
        coordinates: { x: 70, y: 70 }
    }
];

let selectedHotspot = null;

// Initialize the hotspot locator
function initializeHotspotLocator() {
    displayHotspots(hotspots);
    createMapMarkers(hotspots);
}

// Display hotspots in the list
function displayHotspots(hotspotsToShow) {
    const hotspotList = document.getElementById('hotspotList');
    hotspotList.innerHTML = '';

    hotspotsToShow.forEach(hotspot => {
        const hotspotItem = document.createElement('div');
        hotspotItem.className = 'hotspot-item';
        hotspotItem.onclick = () => selectHotspot(hotspot.id);

        hotspotItem.innerHTML = `
                    <div class="hotspot-name">${hotspot.name}</div>
                    <div class="hotspot-address">${hotspot.address}</div>
                    <div class="hotspot-distance">${hotspot.distance} away</div>
                    <div class="hotspot-status status-${hotspot.status}">
                        ${hotspot.status === 'active' ? '🟢 Active' : '🟡 Under Maintenance'}
                    </div>
                `;

        hotspotList.appendChild(hotspotItem);
    });
}

// Create map markers
function createMapMarkers(hotspotsToShow) {
    const mapMarkers = document.getElementById('mapMarkers');
    mapMarkers.innerHTML = '';

    hotspotsToShow.forEach(hotspot => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.id = `marker-${hotspot.id}`;
        marker.style.left = `${hotspot.coordinates.x}%`;
        marker.style.top = `${hotspot.coordinates.y}%`;
        marker.onclick = () => selectHotspot(hotspot.id);
        marker.title = hotspot.name;

        if (hotspot.status === 'maintenance') {
            marker.style.background = '#f1c40f';
        }

        mapMarkers.appendChild(marker);
    });
}

// Select a hotspot
function selectHotspot(hotspotId) {
    // Remove previous selection
    document.querySelectorAll('.hotspot-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelectorAll('.map-marker').forEach(marker => {
        marker.classList.remove('selected');
    });

    // Add selection to current hotspot
    const hotspotItems = document.querySelectorAll('.hotspot-item');
    const hotspotIndex = hotspots.findIndex(h => h.id === hotspotId);
    if (hotspotIndex !== -1) {
        hotspotItems[hotspotIndex].classList.add('selected');
        document.getElementById(`marker-${hotspotId}`).classList.add('selected');
        selectedHotspot = hotspots[hotspotIndex];

        // Scroll to selected item
        hotspotItems[hotspotIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Get current location
function getCurrentLocation() {
    const button = document.querySelector('.location-button');
    const originalText = button.innerHTML;
    button.innerHTML = '📍 Getting Location...';
    button.disabled = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulate finding nearby hotspots
                setTimeout(() => {
                    button.innerHTML = '✅ Location Found';
                    // Filter hotspots by distance (simulate)
                    const nearbyHotspots = hotspots.slice(0, 3);
                    displayHotspots(nearbyHotspots);
                    createMapMarkers(nearbyHotspots);

                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 2000);
                }, 1500);
            },
            (error) => {
                button.innerHTML = '❌ Location Access Denied';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }
        );
    } else {
        button.innerHTML = '❌ Location Not Supported';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

// Search functionality
const searchInput = document.getElementById('locationSearch');
searchInput.addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredHotspots = hotspots.filter(hotspot =>
        hotspot.name.toLowerCase().includes(searchTerm) ||
        hotspot.address.toLowerCase().includes(searchTerm)
    );
    displayHotspots(filteredHotspots);
    createMapMarkers(filteredHotspots);
});

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm) {
            // Simulate search results
            const results = hotspots.filter(hotspot =>
                hotspot.address.toLowerCase().includes(searchTerm)
            );
            if (results.length > 0) {
                displayHotspots(results);
                createMapMarkers(results);
            } else {
                // Show all hotspots if no matches
                displayHotspots(hotspots);
                createMapMarkers(hotspots);
            }
        }
    }
});

// Dynamic typing effect for hero text
const heroTitle = document.querySelector('.hero h1');
const originalText = heroTitle.textContent;
heroTitle.textContent = '';

let i = 0;
const typeWriter = () => {
    if (i < originalText.length) {
        heroTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
};

setTimeout(typeWriter, 1000);

// Initialize hotspot locator when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeHotspotLocator();
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.textContent;

    // Show sending state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        query: document.getElementById('query').value
    };

    // Simulate form submission
    setTimeout(() => {
        submitButton.textContent = '✅ Message Sent!';
        submitButton.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

        // Reset form
        this.reset();

        // Show success message
        alert('Thank you for your message! We\'ll get back to you within 24 hours.');

        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.background = 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)';
        }, 3000);

    }, 2000);
});