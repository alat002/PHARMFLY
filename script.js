/* =========================================
   PHARMFLY JAVASCRIPT
========================================= */


/* =========================================
   MEDICINE DATABASE
========================================= */

const medicines = [

    "Paracetamol",
    "Ibuprofen",
    "Aspirin",
    "Diclofenac",
    "Naproxen",
    "Ketoprofen",
    "Mefenamic Acid",
    "Tramadol",

    "Amoxicillin",
    "Azithromycin",
    "Ciprofloxacin",
    "Metronidazole",
    "Doxycycline",
    "Cefuroxime",
    "Cefixime",
    "Cephalexin",
    "Clindamycin",
    "Clarithromycin",
    "Flucloxacillin",
    "Erythromycin",

    "Artemether/Lumefantrine",
    "Artesunate",
    "Sulfadoxine/Pyrimethamine",
    "Quinine",
    "Primaquine",

    "Cetirizine",
    "Loratadine",
    "Chlorpheniramine",
    "Fexofenadine",
    "Diphenhydramine",

    "Salbutamol Inhaler",
    "Budesonide Inhaler",
    "Beclomethasone Inhaler",
    "Ipratropium",
    "Montelukast",
    "Theophylline",

    "Omeprazole",
    "Pantoprazole",
    "Esomeprazole",
    "Lansoprazole",
    "Antacid",
    "Loperamide",
    "Bisacodyl",
    "Lactulose",
    "Domperidone",
    "Ondansetron",

    "Metformin",
    "Insulin",
    "Gliclazide",
    "Glimepiride",
    "Sitagliptin",

    "Amlodipine",
    "Losartan",
    "Lisinopril",
    "Enalapril",
    "Atenolol",
    "Bisoprolol",
    "Hydrochlorothiazide",
    "Furosemide",
    "Spironolactone",
    "Atorvastatin",
    "Simvastatin",

    "Hydrocortisone Cream",
    "Clotrimazole Cream",
    "Miconazole Cream",
    "Ketoconazole Cream",
    "Terbinafine Cream",
    "Calamine Lotion",
    "Benzoyl Peroxide",
    "Adapalene",

    "Eye Drops",
    "Chloramphenicol Eye Drops",
    "Artificial Tears",
    "Timolol Eye Drops",
    "Ear Drops",

    "Vitamin C",
    "Vitamin D",
    "Vitamin B Complex",
    "Vitamin B12",
    "Folic Acid",
    "Ferrous Sulphate",
    "Calcium Tablets",
    "Zinc Tablets",
    "Magnesium Tablets",

    "Cough Syrup",
    "Guaifenesin",
    "Dextromethorphan",
    "Nasal Spray",
    "Oxymetazoline Nasal Spray",

    "ORS",
    "Zinc Syrup",

    "Prednisolone",
    "Dexamethasone",
    "Hydroxychloroquine",
    "Aciclovir",
    "Fluconazole",
    "Albendazole",
    "Mebendazole",
    "Permethrin Cream",
    "Nystatin",
    "Ferrous Fumarate",
    "Potassium Chloride"
];


/* =========================================
   VARIABLES
========================================= */

let userLatitude = null;
let userLongitude = null;

let nearbyPharmacies = [];

let selectedPharmacy = null;

let selectedMedicine = null;


/* =========================================
   ELEMENTS
========================================= */

const requestModal =
    document.getElementById("requestModal");

const selectedMedicineInput =
    document.getElementById("selectedMedicine");

const locationInput =
    document.getElementById("location");

const locationStatus =
    document.getElementById("locationStatus");

const pharmacyResults =
    document.getElementById("pharmacyResults");

const selectedPharmacyText =
    document.getElementById("selectedPharmacyText");

const requestMessage =
    document.getElementById("requestMessage");


/* =========================================
   MEDICINE SEARCH
========================================= */

function searchMedicine() {

    const input =
        document.getElementById("medicineSearch");

    const results =
        document.getElementById("searchResults");

    const query =
        input.value.trim().toLowerCase();

    results.innerHTML = "";

    if (query === "") {
        return;
    }

    const matches = medicines
        .filter(medicine =>
            medicine.toLowerCase().includes(query)
        )
        .slice(0, 8);

    if (matches.length === 0) {

        results.innerHTML = `
            <div class="search-item">
                <div>
                    <strong>No medicine found</strong>
                    <small>Try another medicine name.</small>
                </div>
            </div>
        `;

        return;
    }

    matches.forEach(medicine => {

        const item =
            document.createElement("div");

        item.className = "search-item";

        item.innerHTML = `
            <span class="search-icon">💊</span>

            <div>
                <strong>${escapeHTML(medicine)}</strong>
                <small>Click to request this medicine</small>
            </div>
        `;

        item.onclick = () => {

            input.value = medicine;

            results.innerHTML = "";

            openRequest(medicine);
        };

        results.appendChild(item);

    });
}


/* =========================================
   MODAL MEDICINE SEARCH
========================================= */

function searchModalMedicine() {

    const input =
        document.getElementById("selectedMedicine");

    const results =
        document.getElementById("modalMedicineResults");

    const query =
        input.value.trim().toLowerCase();

    results.innerHTML = "";

    if (query === "") {
        return;
    }

    const matches = medicines
        .filter(medicine =>
            medicine.toLowerCase().includes(query)
        )
        .slice(0, 8);

    matches.forEach(medicine => {

        const item =
            document.createElement("div");

        item.className = "search-item";

        item.innerHTML = `
            <span class="search-icon">💊</span>

            <div>
                <strong>${escapeHTML(medicine)}</strong>
                <small>Select medicine</small>
            </div>
        `;

        item.onclick = () => {

            input.value = medicine;

            selectedMedicine = medicine;

            results.innerHTML = "";
        };

        results.appendChild(item);

    });
}


/* =========================================
   OPEN REQUEST
========================================= */

function openRequest(medicine = "") {

    requestModal.classList.add("show");

    requestMessage.innerHTML = "";

    if (medicine) {

        selectedMedicine = medicine;

        selectedMedicineInput.value = medicine;

    }

}


/* =========================================
   CLOSE REQUEST
========================================= */

function closeRequest() {

    requestModal.classList.remove("show");

}


/* =========================================
   CURRENT LOCATION
========================================= */

function useCurrentLocation() {

    if (!navigator.geolocation) {

        locationStatus.innerHTML =
            "❌ Geolocation is not supported by this browser.";

        return;
    }

    locationStatus.innerHTML =
        "📍 Detecting your location...";

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            userLatitude =
                position.coords.latitude;

            userLongitude =
                position.coords.longitude;

            try {

                const address =
                    await getReadableAddress(
                        userLatitude,
                        userLongitude
                    );

                locationInput.value = address;

                locationStatus.innerHTML =
                    "✅ Location detected.";

                await findNearbyPharmacies(
                    userLatitude,
                    userLongitude
                );

            } catch (error) {

                locationInput.value =
                    `${userLatitude.toFixed(5)}, ${userLongitude.toFixed(5)}`;

                locationStatus.innerHTML =
                    "⚠️ Coordinates detected. Address could not be loaded.";

                await findNearbyPharmacies(
                    userLatitude,
                    userLongitude
                );

            }

        },

        function(error) {

            locationStatus.innerHTML =
                "❌ Unable to detect location. Please type your location below and click Search This Location.";

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );
}


/* =========================================
   SEARCH MANUAL LOCATION
========================================= */

async function searchManualLocation() {

    const location =
        locationInput.value.trim();

    if (!location) {

        locationStatus.innerHTML =
            "❌ Please enter a location first.";

        return;
    }

    locationStatus.innerHTML =
        "🔎 Searching for this location...";

    pharmacyResults.innerHTML =
        "<p>Searching for nearby pharmacies...</p>";

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`
        );

        const data = await response.json();

        if (!data.length) {

            locationStatus.innerHTML =
                "❌ Location could not be found.";

            pharmacyResults.innerHTML =
                "<p>Please try a more specific location.</p>";

            return;
        }

        userLatitude =
            parseFloat(data[0].lat);

        userLongitude =
            parseFloat(data[0].lon);

        locationInput.value =
            data[0].display_name;

        locationStatus.innerHTML =
            "✅ Location found.";

        await findNearbyPharmacies(
            userLatitude,
            userLongitude
        );

    } catch (error) {

        console.error(error);

        locationStatus.innerHTML =
            "❌ Could not search location. Check your internet connection.";

    }

}


/* =========================================
   REVERSE GEOCODING
========================================= */

async function getReadableAddress(
    latitude,
    longitude
) {

    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`
    );

    if (!response.ok) {
        throw new Error("Address lookup failed");
    }

    const data = await response.json();

    return data.display_name ||
        `${latitude}, ${longitude}`;
}


/* =========================================
   FIND NEARBY PHARMACIES
========================================= */

async function findNearbyPharmacies(
    latitude,
    longitude
) {

    pharmacyResults.innerHTML =
        "<p>🏥 Searching for nearby pharmacies...</p>";

    const radius = 5000;

    const query = `
        [out:json][timeout:25];

        (
            node["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
            way["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
            relation["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
        );

        out center tags;
    `;

    try {

        const response = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                body: query
            }
        );

        if (!response.ok) {
            throw new Error("Pharmacy search failed");
        }

        const data =
            await response.json();

        nearbyPharmacies =
            data.elements
                .map(place => {

                    const lat =
                        place.lat ??
                        place.center?.lat;

                    const lon =
                        place.lon ??
                        place.center?.lon;

                    if (
                        typeof lat !== "number" ||
                        typeof lon !== "number"
                    ) {
                        return null;
                    }

                    const distance =
                        calculateDistance(
                            latitude,
                            longitude,
                            lat,
                            lon
                        );

                    return {
                        name:
                            place.tags?.name ||
                            "Pharmacy",

                        address:
                            buildPharmacyAddress(
                                place.tags || {}
                            ),

                        latitude: lat,
                        longitude: lon,

                        distance: distance
                    };

                })
                .filter(Boolean)
                .sort(
                    (a, b) =>
                        a.distance - b.distance
                )
                .slice(0, 10);

        displayPharmacies();

    } catch (error) {

        console.error(error);

        pharmacyResults.innerHTML = `
            <div class="tracking-error">
                ❌ Unable to load nearby pharmacies.
                Please check your internet connection and try again.
            </div>
        `;

    }

}


/* =========================================
   BUILD PHARMACY ADDRESS
========================================= */

function buildPharmacyAddress(tags) {

    const parts = [];

    if (tags["addr:housenumber"]) {
        parts.push(tags["addr:housenumber"]);
    }

    if (tags["addr:street"]) {
        parts.push(tags["addr:street"]);
    }

    if (tags["addr:suburb"]) {
        parts.push(tags["addr:suburb"]);
    }

    if (tags["addr:city"]) {
        parts.push(tags["addr:city"]);
    }

    if (tags["addr:state"]) {
        parts.push(tags["addr:state"]);
    }

    if (parts.length === 0) {
        return "Address not available on OpenStreetMap";
    }

    return parts.join(", ");
}


/* =========================================
   DISPLAY PHARMACIES
========================================= */

function displayPharmacies() {

    pharmacyResults.innerHTML = "";

    if (nearbyPharmacies.length === 0) {

        pharmacyResults.innerHTML = `
            <div class="tracking-error">
                No mapped pharmacies were found within 5 km.
            </div>
        `;

        return;
    }

    nearbyPharmacies.forEach(
        (pharmacy, index) => {

            const card =
                document.createElement("div");

            card.className =
                "pharmacy-card";

            const mapURL =
                `https://www.openstreetmap.org/?mlat=${pharmacy.latitude}&mlon=${pharmacy.longitude}#map=18/${pharmacy.latitude}/${pharmacy.longitude}`;

            card.innerHTML = `

                <h4>
                    🏥 ${escapeHTML(pharmacy.name)}
                </h4>

                <p class="pharmacy-address">
                    ${escapeHTML(pharmacy.address)}
                </p>

                <p class="pharmacy-distance">
                    📍 ${formatDistance(pharmacy.distance)}
                    away
                </p>

                <div class="pharmacy-actions">

                    <button
                        class="select-pharmacy-btn"
                        onclick="selectPharmacy(${index})"
                    >
                        Select Pharmacy
                    </button>

                    <a
                        class="map-btn"
                        href="${mapURL}"
                        target="_blank"
                    >
                        🗺️ View Map
                    </a>

                </div>
            `;

            pharmacyResults.appendChild(card);

        }
    );

}


/* =========================================
   SELECT PHARMACY
========================================= */

function selectPharmacy(index) {

    selectedPharmacy =
        nearbyPharmacies[index];

    selectedPharmacyText.innerHTML = `
        <strong>${escapeHTML(selectedPharmacy.name)}</strong><br>
        ${escapeHTML(selectedPharmacy.address)}<br>
        ${formatDistance(selectedPharmacy.distance)} away
    `;

    selectedPharmacyText.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================
   DISTANCE
========================================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371;

    const dLat =
        degreesToRadians(lat2 - lat1);

    const dLon =
        degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(
            degreesToRadians(lat1)
        ) *

        Math.cos(
            degreesToRadians(lat2)
        ) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}


function degreesToRadians(degrees) {

    return degrees * Math.PI / 180;

}


function formatDistance(distance) {

    if (distance < 1) {

        return `${Math.round(distance * 1000)} m`;

    }

    return `${distance.toFixed(1)} km`;

}


/* =========================================
   SUBMIT REQUEST
========================================= */

function submitRequest() {

    const medicine =
        selectedMedicineInput.value.trim();

    const location =
        locationInput.value.trim();

    const deliveryType =
        document.getElementById(
            "deliveryType"
        ).value;


    if (!medicine) {

        requestMessage.innerHTML = `
            <div class="tracking-error">
                ❌ Please select a medicine.
            </div>
        `;

        return;
    }


    if (!location) {

        requestMessage.innerHTML = `
            <div class="tracking-error">
                ❌ Please enter your delivery location.
            </div>
        `;

        return;
    }


    if (!selectedPharmacy) {

        requestMessage.innerHTML = `
            <div class="tracking-error">
                ❌ Please select a pharmacy.
            </div>
        `;

        return;
    }


    const trackingID =
        generateTrackingID();


    const eta =
        calculateETA(deliveryType);


    const request = {

        trackingID: trackingID,

        medicine: medicine,

        pharmacy: selectedPharmacy.name,

        pharmacyAddress:
            selectedPharmacy.address,

        deliveryType: deliveryType,

        destination: location,

        eta: eta,

        status: "Request Confirmed",

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        `pharmfly_${trackingID}`,
        JSON.stringify(request)
    );


    localStorage.setItem(
        "pharmfly_latest_request",
        JSON.stringify(request)
    );


    requestMessage.innerHTML = `

        <div class="success-message">

            <h3>
                ✅ Request Submitted Successfully
            </h3>

            <p>
                Your medicine delivery request has been created.
            </p>

            <div class="tracking-code">
                ${trackingID}
            </div>

            <p>
                <strong>Medicine:</strong>
                ${escapeHTML(medicine)}
            </p>

            <p>
                <strong>Pharmacy:</strong>
                ${escapeHTML(selectedPharmacy.name)}
            </p>

            <p>
                <strong>Delivery:</strong>
                ${deliveryType}
            </p>

            <p>
                <strong>Estimated arrival:</strong>
                ${eta}
            </p>

            <p style="margin-top:10px;">
                Use the tracking ID above to track your delivery.
            </p>

        </div>

    `;

}


/* =========================================
   TRACKING ID
========================================= */

function generateTrackingID() {

    const number =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `PF-${number}`;

}


/* =========================================
   ETA
========================================= */

function calculateETA(deliveryType) {

    if (deliveryType === "Drone") {

        return "15–25 minutes";

    }

    return "30–45 minutes";

}


/* =========================================
   TRACK DELIVERY
========================================= */

function trackDelivery() {

    const input =
        document.getElementById(
            "trackingInput"
        );

    const result =
        document.getElementById(
            "trackingResult"
        );

    const trackingID =
        input.value.trim().toUpperCase();


    if (!trackingID) {

        result.innerHTML = `
            <div class="tracking-error">
                ❌ Please enter a tracking ID.
            </div>
        `;

        return;
    }


    const stored =
        localStorage.getItem(
            `pharmfly_${trackingID}`
        );


    if (!stored) {

        result.innerHTML = `
            <div class="tracking-error">

                ❌ Tracking ID not found.

                <br><br>

                Please enter the exact tracking ID
                you received after submitting your request.

            </div>
        `;

        return;
    }


    const request =
        JSON.parse(stored);


    result.innerHTML = `

        <div class="tracking-card">

            <h3>
                🚁 Delivery Tracking
            </h3>

            <div class="tracking-status">
                ● ${request.status}
            </div>

            <div class="tracking-details">

                <p>
                    <strong>Tracking ID:</strong>
                    ${escapeHTML(request.trackingID)}
                </p>

                <p>
                    <strong>Medicine:</strong>
                    ${escapeHTML(request.medicine)}
                </p>

                <p>
                    <strong>Pharmacy:</strong>
                    ${escapeHTML(request.pharmacy)}
                </p>

                <p>
                    <strong>Pharmacy Address:</strong>
                    ${escapeHTML(request.pharmacyAddress)}
                </p>

                <p>
                    <strong>Delivery Method:</strong>
                    ${escapeHTML(request.deliveryType)}
                </p>

                <p>
                    <strong>Destination:</strong>
                    ${escapeHTML(request.destination)}
                </p>

                <p>
                    <strong>Estimated Arrival:</strong>
                    ${escapeHTML(request.eta)}
                </p>

            </div>

        </div>

    `;

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

window.addEventListener(
    "click",
    function(event) {

        if (event.target === requestModal) {

            closeRequest();

        }

    }
);


/* =========================================
   ESC KEY CLOSES MODAL
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeRequest();

        }

    }
);


/* =========================================
   NAVIGATION
========================================= */

document.querySelectorAll(
    ".nav-links a"
).forEach(link => {

    link.addEventListener(
        "click",
        function() {

            document
                .querySelectorAll(".nav-links a")
                .forEach(item =>
                    item.classList.remove("active")
                );

            this.classList.add("active");

        }
    );

});