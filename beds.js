const getQueryParams = () => new URLSearchParams(window.location.search);

const resolveAvailableBeds = (params, bedMap = window?.hospitalBeds || {}) => {
  const getValue = (key) => {
    if (params && typeof params.get === "function") {
      return params.get(key);
    }

    return params?.[key] ?? "";
  };

  const passedBeds = getValue("beds");
  if (passedBeds !== null && passedBeds !== "") {
    return Number(passedBeds);
  }

  const hospital = getValue("hospital") || "";
  return Number(bedMap[hospital] ?? 0);
};

const getNearestHospitals = (province, currentHospital) => {
  const list = window.provinceHospitals?.[province] || [];
  const provinceAvailable = list
    .filter((item) => item !== currentHospital && (window.hospitalBeds?.[item] ?? 0) > 0)
    .map((item) => ({ hospital: item, beds: window.hospitalBeds[item] }))
    .sort((a, b) => b.beds - a.beds);

  if (provinceAvailable.length > 0) {
    return provinceAvailable;
  }

  return Object.keys(window.hospitalBeds || {})
    .filter((item) => item !== currentHospital && (window.hospitalBeds?.[item] ?? 0) > 0)
    .map((item) => ({ hospital: item, beds: window.hospitalBeds[item] }))
    .sort((a, b) => b.beds - a.beds);
};

const renderBedStatus = () => {
  const params = getQueryParams();
  const hospital = params.get("hospital") || "";
  const province = params.get("province") || "";
  const container = document.getElementById("bed-status");

  if (!container) return;
  if (!hospital || !province) {
    container.innerHTML = `<p class="error-message">Missing hospital or province details. Please return to the login page and try again.</p>`;
    return;
  }

  const availableBeds = resolveAvailableBeds(params);
  const nearestHospitals = getNearestHospitals(province, hospital);

  if (availableBeds > 0) {
    container.innerHTML = `
      <p><strong>${hospital}</strong> has <strong class="bed-count">${availableBeds}</strong> available bed(s).</p>
      <p>Please proceed to the hospital or continue with your booking.</p>
    `;
  } else if (nearestHospitals.length > 0) {
    const listItems = nearestHospitals
      .map((item) => `<li><strong>${item.hospital}</strong> — <span class="bed-count">${item.beds}</span> bed(s) available</li>`)
      .join("");

    container.innerHTML = `
      <p><strong>${hospital}</strong> currently has no available beds.</p>
      <p>The nearest hospitals with available beds are:</p>
      <ul>${listItems}</ul>
      <p>Please choose one of these hospitals or return to select a different option.</p>
    `;
  } else {
    container.innerHTML = `
      <p><strong>${hospital}</strong> currently has no available beds.</p>
      <p>There are no nearby hospitals with available beds at this time.</p>
    `;
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    renderBedStatus();

    const backButton = document.getElementById("back-button");
    if (backButton) {
      backButton.addEventListener("click", () => {
        window.location.href = "hospital-selection.html";
      });
    }
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    resolveAvailableBeds
  };
}
