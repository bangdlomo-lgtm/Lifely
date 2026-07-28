const API_URL = "http://localhost:3000/PublicHospitals";

const getQueryParams = () => new URLSearchParams(window.location.search);

// Global state to hold fetched data
let dbHospitals = [];

async function fetchHospitalData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch database data");

    const payload = await response.json();
    dbHospitals = window.HospitalSelectionData
      ? window.HospitalSelectionData.normalizeHospitalData(payload)
      : Array.isArray(payload) ? payload : [];

    return dbHospitals;
  } catch (error) {
    console.error("Error retrieving data from API:", error);
    dbHospitals = window.HospitalSelectionData
      ? window.HospitalSelectionData.fallbackHospitalData
      : [];
    return dbHospitals;
  }
}

function populateProvinceDropdown(data, provinceSelect) {
  if (!provinceSelect) return;

  const provinces = window.HospitalSelectionData
    ? window.HospitalSelectionData.getUniqueProvinces(data)
    : [...new Set(data.map((item) => item.province).filter(Boolean))].sort();

  provinceSelect.innerHTML = "<option value=''>Select a province</option>";
  provinces.forEach((province) => {
    const option = document.createElement('option');
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });
}

function populateHospitalDropdown(province, hospitalSelect) {
  if (!hospitalSelect) return;

  hospitalSelect.innerHTML = "<option value=''>Select a hospital</option>";

  const filtered = window.HospitalSelectionData
    ? window.HospitalSelectionData.getHospitalsForProvince(dbHospitals, province)
    : dbHospitals.filter((item) => item.province === province);

  if (filtered.length === 0) {
    hospitalSelect.disabled = true;
    return;
  }

  hospitalSelect.disabled = false;
  filtered.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.hospital;
    option.textContent = item.hospital;
    option.dataset.beds = item.availableBeds ?? 0;
    hospitalSelect.appendChild(option);
  });
}

// Main execution function
async function initHospitalSelection() {
  const params = getQueryParams();
  const username = params.get('username') || 'Guest';
  const userBanner = document.getElementById('user-banner');
  const provinceSelect = document.getElementById('province');
  const hospitalSelect = document.getElementById('hospital');
  const continueButton = document.getElementById('continue-button');

  if (userBanner) userBanner.textContent = `Signed in as: ${username}`;

  await fetchHospitalData();
  populateProvinceDropdown(dbHospitals, provinceSelect);

  if (provinceSelect) {
    provinceSelect.addEventListener('change', (e) => {
      populateHospitalDropdown(e.target.value, hospitalSelect);
    });
  }

  if (hospitalSelect) {
    hospitalSelect.disabled = true;
  }

  if (continueButton) {
    continueButton.onclick = null;

    continueButton.addEventListener('click', (e) => {
      e.preventDefault();

      const province = provinceSelect?.value || '';
      const hospital = hospitalSelect?.value || '';

      if (!province || !hospital || hospitalSelect.selectedIndex === -1) {
        alert('Please select both a province and a hospital');
        return;
      }

      const selectedOption = hospitalSelect.options[hospitalSelect.selectedIndex];
      const beds = selectedOption ? (selectedOption.dataset.beds || '0') : '0';
      const bedCount = Number(beds);

      const targetPage = bedCount === 0 ? 'beds.html' : 'dashboard.html';
      const url = new URL(targetPage, window.location.href);
      url.searchParams.set('province', province);
      url.searchParams.set('hospital', hospital);
      url.searchParams.set('username', username);
      url.searchParams.set('beds', beds);

      window.location.href = url.href;
    });
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initHospitalSelection);
} else {
  initHospitalSelection();
}