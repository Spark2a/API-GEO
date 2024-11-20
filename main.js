const regionSelection = document.getElementById("region");
const departementSelection = document.getElementById("departement");
const afficherCommunesbtn = document.getElementById("afficherCommunes");
const communesDiv = document.getElementById("communes");

// Afficher les régions
async function fetchRegions() {
  try {
    const response = await fetch("https://geo.api.gouv.fr/regions");
    const regions = await response.json();

    regions.forEach(region => {
      const option = document.createElement("option");
      option.value = region.code;
      option.textContent = region.nom;
      regionSelection.appendChild(option);
    });

    regionSelection.disabled = false;
  } catch (error) {
    console.error("Erreur région");
  }
}

// Afficher les départements
async function fetchDepartements(regionCode) {
  try {
    const response = await fetch(`https://geo.api.gouv.fr/regions/${regionCode}/departements`);
    const departements = await response.json();

    departementSelection.innerHTML = `<option value="">Choisissez un département</option>`;
    departements.forEach(departement => {
      const option = document.createElement("option");
      option.value = departement.code;
      option.textContent = departement.nom;
      departementSelection.appendChild(option);
    });

    departementSelection.disabled = false;
    departementSelection.style.display = "block";
  } catch (error) {
    console.error("Erreur départements");
  }
}

// Afficher les communes
async function fetchCommunes(departementCode) {
  try {
    const response = await fetch(`https://geo.api.gouv.fr/departements/${departementCode}/communes?fields=nom,population`);
    const communes = await response.json();

    // Trie nombre habitants
    communes.sort((a, b) => b.population - a.population);

    
    communesDiv.innerHTML = `
      <h2>Communes</h2>
      <ul class="list-group">
        ${communes.map(commune => `
          <li class="list-group-item align-items-center d-flex justify-content-between ">
            ${commune.nom}
            <span class="badge bg-primary">${commune.population.toLocaleString()}</span>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (error) {
    console.error("Erreur communes");
  }
}

// Affichage département 
regionSelection.addEventListener("change", () => {
  const selectedRegion = regionSelection.value;

  if (!selectedRegion) {
    departementSelection.style.display = "none";
    departementSelection.disabled = true;
    afficherCommunesbtn.style.display = "none";
    return;
  }

  fetchDepartements(selectedRegion);
  afficherCommunesbtn.style.display = "none"; 
});

// Affichages communes
departementSelection.addEventListener("change", () => {
  const selectedDepartement = departementSelection.value;

  if (!selectedDepartement) {
    afficherCommunesbtn.style.display = "none";
    return;
  }

  afficherCommunesbtn.style.display = "block"; 
});

// Event Click Afficher commmunes
afficherCommunesbtn.addEventListener("click", () => {
  const selectedDepartement = departementSelection.value;

  if (selectedDepartement) {
    fetchCommunes(selectedDepartement);
  }
});

// Charger région
document.addEventListener("DOMContentLoaded", fetchRegions);
