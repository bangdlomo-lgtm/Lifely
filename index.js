window.provinceHospitals = {
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

window.hospitalBeds = {
  "Inkosi Albert Luthuli Hospital": 7,
  "Addington Hospital": 68,
  "Greys Hospital": 1,
  "Livingstone Hospital": 0,
  "Cecilia Makiwane Hospital": 2,
  "Frere Hospital": 3,
  "Pelonomi Tertiary Hospital": 5,
  "Universitas Hospital": 0,
  "Bloemcare Hospital": 2,
  "Charlotte Maxeke Hospital": 0,
  "Chris Hani Baragwanath Hospital": 6,
  "Netcare Milpark Hospital": 3,
  "Polokwane Hospital": 0,
  "Letaba Hospital": 2,
  "Tzaneen Hospital": 1,
  "Rob Ferreira Hospital": 0,
  "Ermelo Hospital": 4,
  "Nelspruit Medi-Clinic": 2,
  "Tlokwe Hospital": 0,
  "Klerksdorp Hospital": 1,
  "Potchefstroom Hospital": 2,
  "Tobias Hani District Hospital": 0,
  "Kimberley Hospital": 0,
  "Sol Plaatje Hospital": 1,
  "Groote Schuur Hospital": 0,
  "Tygerberg Hospital": 3,
  "Stellenbosch Hospital": 2
};

window.getNearestHospital = (province, currentHospital) => {
  const list = window.provinceHospitals[province] || [];
  const provinceNearest = list.find((item) => item !== currentHospital && window.hospitalBeds[item] > 0);
  if (provinceNearest) {
    return { hospital: provinceNearest, beds: window.hospitalBeds[provinceNearest] };
  }

  const globalNearest = Object.keys(window.hospitalBeds)
    .filter((item) => item !== currentHospital && window.hospitalBeds[item] > 0)
    .sort((a, b) => window.hospitalBeds[b] - window.hospitalBeds[a])[0];

  return globalNearest ? { hospital: globalNearest, beds: window.hospitalBeds[globalNearest] } : null;
};

window.openBedStatusPage = (hospital, province) => {
  const url = new URL("beds.html", window.location.href);
  url.searchParams.set("hospital", hospital);
  url.searchParams.set("province", province);
  window.open(url.href, "bedStatus", "noopener");
};

window.goToSelectionPage = (values) => {
  const url = new URL("hospital-selection.html", window.location.href);
  url.searchParams.set("username", values.username || "");
  window.location.href = url.href;
};

window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    setTimeout(() => overlay.classList.add("hidden"), 5000);
    setTimeout(() => overlay.remove(), 7000);

  }

  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Login Attempted!");
    console.log(`User: ${username}`);

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    window.goToSelectionPage({ username });
  });
});
