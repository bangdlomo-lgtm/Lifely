const API_URL = "http://localhost:3000/PublicHospitals";

const getQueryParams = () => new URLSearchParams(window.location.search);

// Global state to hold fetched data
let dbHospitals = [];

async function fetchHospitalData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch database data");
    dbHospitals = await response.json();
    return dbHospitals;
  } catch (error) {
    console.error("Error retrieving data from API:", error);
    return [];
  }
}

function populateProvinceDropdown(data, provinceSelect) {
  if (!provinceSelect) return;
  
  // Get all unique provinces
  const provinces = [...new Set(data.map(item => item.province))].sort();
  
  provinceSelect.innerHTML = "<option value=''>Select a province</option>";
  provinces.forEach(province => {
    const option = document.createElement('option');
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });
}

function populateHospitalDropdown(province, hospitalSelect) {
  if (!hospitalSelect) return;

  hospitalSelect.innerHTML = "<option value=''>Select a hospital</option>";

  const filtered = dbHospitals.filter(item => item.province === province);

  if (filtered.length === 0) {
    hospitalSelect.disabled = true;
    return;
  }

  hospitalSelect.disabled = false;
  filtered.forEach(item => {
    const option = document.createElement('option');
    option.value = item.hospital;
    
    const bedCountText = item.availableBeds !== undefined ? ` (${item.availableBeds} beds available)` : '';
    option.textContent = `${item.hospital}${bedCountText}`;
    
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

  // 1. Fetch live data from your db.json
  await fetchHospitalData();

  // 2. Populate Province Dropdown list on start
  populateProvinceDropdown(dbHospitals, provinceSelect);

  // 3. Handle province change to populate corresponding hospitals
  if (provinceSelect) {
    provinceSelect.addEventListener('change', (e) => {
      populateHospitalDropdown(e.target.value, hospitalSelect);
    });
  }

  if (hospitalSelect && !hospitalSelect.value) {
    hospitalSelect.disabled = true;
  }

  // 4. Handle click submission cleanly
  if (continueButton) {
    // Remove any previous accidental bindings by replacing the node or clearing
    continueButton.onclick = null; 
    
    continueButton.addEventListener('click', (e) => {
      e.preventDefault(); // Stop any form side-effects

      const province = provinceSelect?.value || '';
      const hospital = hospitalSelect?.value || '';
      
      if (!province || !hospital || hospitalSelect.selectedIndex === -1) {
        alert('Please select both a province and a hospital');
        return;
      }
      
      // Safe extraction of the dataset beds count attribute
      const selectedOption = hospitalSelect.options[hospitalSelect.selectedIndex];
      const beds = selectedOption ? (selectedOption.dataset.beds || '0') : '0';

      // Build out target location pointing directly to dashboard.html
      const url = new URL('dashboard.html', window.location.href);
      url.searchParams.set('province', province);
      url.searchParams.set('hospital', hospital);
      url.searchParams.set('username', username);
      url.searchParams.set('beds', beds); 

      window.location.href = url.href;
    });
  }
}

// Run immediately if DOM is ready, otherwise wait for event
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initHospitalSelection);
} else {
  initHospitalSelection();
}