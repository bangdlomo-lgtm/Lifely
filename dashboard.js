const getQueryParams = () => new URLSearchParams(window.location.search);

const renderConfirmation = () => {
  const params = getQueryParams();
  const hospital = params.get('hospital') || 'Not selected';
  const beds = params.get('beds') || 'Unknown';
  const container = document.getElementById('confirmation-details');

  if (!container) return;

  container.innerHTML = `
    <h2>Bed availability</h2>
    <p><strong>Hospital:</strong> ${hospital}</p>
    <p><strong>Available beds:</strong> <span class="bed-count">${beds}</span></p>
  `;
};

window.addEventListener('DOMContentLoaded', () => {
  renderConfirmation();
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = 'hospital-selection.html';
    });
  }
});
