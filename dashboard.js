const getQueryParams = () => new URLSearchParams(window.location.search);

const renderConfirmation = () => {
  const params = getQueryParams();
  const username = params.get('username') || 'Guest';
  const province = params.get('province') || 'Not selected';
  const hospital = params.get('hospital') || 'Not selected';
  const container = document.getElementById('confirmation-details');

  if (!container) return;

  container.innerHTML = `
    <h2>Login successful</h2>
    <p><strong>Username:</strong> ${username}</p>
    <p><strong>Province:</strong> ${province}</p>
    <p><strong>Hospital:</strong> ${hospital}</p>
  `;
};

window.addEventListener('DOMContentLoaded', () => {
  renderConfirmation();
});
