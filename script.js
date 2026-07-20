const provinceHospitals = {
  "Kwa-Zulu-Natal": ["Inkosi Albert Luthuli Hospital", "Addington Hospital", "Greys Hospital"],
  "Eastern Cape": ["Livingstone Hospital", "Cecilia Makiwane Hospital", "Frere Hospital"],
  "Free State": ["Pelonomi Tertiary Hospital", "Universitas Hospital", "Bloemcare Hospital"],
  "Gauteng": ["Charlotte Maxeke Hospital", "Chris Hani Baragwanath Hospital", "Netcare Milpark Hospital"],
  "Limpopo": ["Polokwane Hospital", "Letaba Hospital", "Tzaneen Hospital"],
  "Mpumalanga": ["Rob Ferreira Hospital", "Ermelo Hospital", "Nelspruit Medi-Clinic"],
  "North West": ["Tlokwe Hospital", "Klerksdorp Hospital", "Potchefstroom Hospital"],
  "Northern Cape": ["Tobias Hani District Hospital", "Kimberley Hospital", "Sol Plaatje Hospital"],
  "Western Cape": ["Groote Schuur Hospital", "Tygerberg Hospital", "Stellenbosch Hospital"]
};

window.provinceHospitals = window.provinceHospitals || provinceHospitals;

const API_URL = "http://localhost:3000/PublicHospitals";

// Dropdown Dynamic Population
const createHospitalSuggestions = (province) => {
  const hospitalSelect = document.getElementById("hospital");
  if (!hospitalSelect) return;

  // Always start fresh
  hospitalSelect.innerHTML = "<option value=''>Select a hospital</option>";

  const hospitals = window.provinceHospitals[province] || [];

  if (!province || hospitals.length === 0) {
    hospitalSelect.disabled = true;
    return;
  }

  hospitalSelect.disabled = false;

  hospitals.forEach((hospital) => {
    const option = document.createElement("option");
    option.value = hospital;
    option.textContent = hospital;
    hospitalSelect.appendChild(option);
  });
};

// Messaging UI Utilities
const showMessage = (text, type = "info") => {
  const messageBox = document.getElementById("message");
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
};

// Load Saved Hospital Submissions from API
async function LoadPublicHospitals() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch public hospitals");
    
    // Parsed response once (returns an array of records)
    const records = await response.json(); 
    
    const tbody = document.getElementById("hospital-table-body");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    records.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.id || record.ID || ""}</td>
        <td>${record.province || ""}</td>
        <td>${record.hospital || ""}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading hospitals:", error);
  }
}

// Event Listeners setup on load
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const provinceSelect = document.getElementById("province");
  const hospitalSelect = document.getElementById("hospital");

  if (form && form.id !== "login-form") {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const province = document.getElementById("province")?.value;
      const hospital = document.getElementById("hospital")?.value;

      if (!province || !hospital) return;

      try {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ province, hospital })
        });

        form.reset();
        LoadPublicHospitals();
      } catch (err) {
        console.error("Error submitting entry:", err);
      }
    });
  }

  if (provinceSelect) {
    provinceSelect.addEventListener("change", (event) => {
      showMessage("", "info");
      createHospitalSuggestions(event.target.value);
    });
  }

  if (hospitalSelect) {
    hospitalSelect.disabled = true;
  }

  // Load backend records on load
  LoadPublicHospitals();
});