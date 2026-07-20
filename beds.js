const getQueryParams = () => new URLSearchParams(window.location.search);

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

  const availableBeds = window.hospitalBeds?.[hospital] ?? 0;
  const nearest = window.getNearestHospital?.(province, hospital);

  if (availableBeds > 0) {
    container.innerHTML = `
      <p><strong>${hospital}</strong> has <strong class="bed-count">${availableBeds}</strong> available bed(s).</p>
      <p>Please proceed to the hospital or continue with your booking.</p>
    `;
  } else if (nearest) {
    container.innerHTML = `
      <p><strong>${hospital}</strong> currently has no available beds.</p>
      <p>The nearest hospital with available beds is <strong>${nearest.hospital}</strong> with <strong class="bed-count">${nearest.beds}</strong> bed(s).</p>
      <p>Please check with that hospital or return to choose a different option.</p>
    `;
  } else {
    container.innerHTML = `
      <p><strong>${hospital}</strong> currently has no available beds.</p>
      <p>There are no nearby hospitals with available beds at this time.</p>
    `;
  }
};

window.addEventListener("DOMContentLoaded", () => {
  renderBedStatus();

  const backButton = document.getElementById("back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "INDEX.HTML";
    });
  }
});
