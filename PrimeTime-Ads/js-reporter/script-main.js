// THEME CLAIR/FONCE
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Charger le thème depuis le stockage local
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('Thème chargé depuis le stockage local :', savedTheme);

    // Appliquer le thème sauvegardé
    body.setAttribute('data-theme', savedTheme);
    console.log('Attribut data-theme défini sur :', savedTheme);

    // Appliquer la classe active si le thème est sombre
    const isDark = savedTheme === 'dark';
    themeToggle.classList.toggle('active', isDark);
    console.log('Classe "active" appliquée au basculeur :', isDark);
});

// Bascule entre les thèmes
themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    console.log('Thème actuel :', isDark ? 'dark' : 'light');
    console.log('Nouveau thème à appliquer :', newTheme);

    // Appliquer le nouveau thème
    body.setAttribute('data-theme', newTheme);
    console.log('Attribut data-theme mis à jour sur :', newTheme);

    // Mettre à jour la classe active
    themeToggle.classList.toggle('active', newTheme === 'dark');
    console.log('Classe "active" mise à jour sur le basculeur :', newTheme === 'dark');

    // Sauvegarder le thème dans le stockage local
    localStorage.setItem('theme', newTheme);
    console.log('Thème sauvegardé dans le stockage local :', newTheme);
});


// Initialisation des blocs par défaut
let blocks = {
  'Bloc 1': [
    { media: 'UBS', duree: 10 },
    { media: 'Procare Systems', duree: 20 },
    { media: 'Moutinho', duree: 10 },
    { media: 'CosyUp', duree: 10 },
    { media: 'Harmony', duree: 30 },
    { media: 'L\'astuce', duree: 10 },
    { media: 'Raiffeissen', duree: 34 },
  ],
  'Bloc 2': [
    { media: 'UBS', duree: 10 },
    { media: 'Procare Systems', duree: 20 },
    { media: 'Moutinho', duree: 10 },
    { media: 'CosyUp', duree: 10 },
    { media: 'Harmony', duree: 30 },
    { media: 'L\'astuce', duree: 10 },
    { media: 'Raiffeissen', duree: 34 },
  ],
  'Bloc 3': [
    { media: 'UBS', duree: 10 },
    { media: 'Procare Systems', duree: 20 },
    { media: 'Moutinho', duree: 10 },
    { media: 'CosyUp', duree: 10 },
    { media: 'Harmony', duree: 30 },
    { media: 'L\'astuce', duree: 10 },
    { media: 'Raiffeissen', duree: 34 },
  ],
  'Bloc 4': [
    { media: 'UBS', duree: 10 },
    { media: 'Procare Systems', duree: 20 },
    { media: 'Moutinho', duree: 10 },
    { media: 'CosyUp', duree: 10 },
    { media: 'Harmony', duree: 30 },
    { media: 'L\'astuce', duree: 10 },
    { media: 'Raiffeissen', duree: 34 },
  ],
};

// Sélection des éléments DOM
const tabContainer = document.getElementById('tab-container'); // Conteneur des onglets
const tabContentContainer = document.getElementById('tab-content-container'); // Conteneur des contenus
const addBlockButton = document.getElementById('add-block');
const modalMedia = document.getElementById('modal-media');

// Champs pour les modales
const mediaNameInput = document.getElementById('media-name');
const mediaDurationInput = document.getElementById('media-duration');

// Boutons pour les modales
const saveMediaButton = document.getElementById('save-media');
const cancelMediaButton = document.getElementById('cancel-media');

// Variables globales pour suivre l'édition
let currentBlockEditing = null;
let currentMediaEditingIndex = null;


// Fonction pour afficher les onglets
function renderTabs() {
  // Réinitialisation des conteneurs
  tabContainer.innerHTML = '';
  tabContentContainer.innerHTML = '';

  Object.keys(blocks).forEach((blockKey, blockIndex) => {
    // Créer un onglet
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.textContent = blockKey;

    // Ajouter une classe active au premier onglet par défaut
    if (blockIndex === 0) {
      tab.classList.add('active');
    }

    // Ajout d'un écouteur d'événement pour activer l'onglet au clic
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));

      tab.classList.add('active');
      document.querySelector(`[data-block-key="${blockKey}"]`).classList.add('active');
    });

    // Ajouter l'onglet au conteneur des onglets
    tabContainer.appendChild(tab);

    // Créer le contenu de l'onglet
    const content = document.createElement('div');
    content.className = 'tab-content';
    content.dataset.blockKey = blockKey;

    if (blockIndex === 0) {
      content.classList.add('active');
    }

    // Ajout du nom du bloc et des horaires
    const blockTitle = document.createElement('div');
    blockTitle.className = 'block-title';
    blockTitle.textContent = `Vous modifiez : ${blockKey}`;

    // Ajout du champ pour définir l'heure de début
    const timeContainer = document.createElement('div');
    timeContainer.className = 'time-container';

    const startTimeLabel = document.createElement('label');
    startTimeLabel.textContent = 'Heure de début :';
    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'time';
    startTimeInput.value = '09:00'; // Valeur par défaut
    startTimeInput.addEventListener('input', () => {
      const mediaDurations = blocks[blockKey].map((media) => media.duree);
      const endTime = calculateEndTime(startTimeInput.value, mediaDurations);
      endTimeDisplay.textContent = `Heure de fin calculée : ${endTime}`;
    });

    const endTimeDisplay = document.createElement('div');
    endTimeDisplay.className = 'end-time';
    const mediaDurations = blocks[blockKey].map((media) => media.duree);
    endTimeDisplay.textContent = `Heure de fin calculée : ${calculateEndTime(startTimeInput.value, mediaDurations)}`;

    timeContainer.appendChild(startTimeLabel);
    timeContainer.appendChild(startTimeInput);
    timeContainer.appendChild(endTimeDisplay);

    // Création du tableau pour ce bloc
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Média</th>
          <th>Durée (s)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    blocks[blockKey].forEach((media, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${media.media}</td>
       <td>${formatDuration(media.duree)}</td>
        <td>
          <button onclick="editMedia('${blockKey}', ${index})" class="btn-edit">Modifier</button>
          <button onclick="deleteMedia('${blockKey}', ${index})" class="btn-delete">Supprimer</button>
          <button onclick="moveMediaUp('${blockKey}', ${index})" class="btn-up" ${index === 0 ? 'disabled' : ''}>⬆️</button>
          <button onclick="moveMediaDown('${blockKey}', ${index})" class="btn-down" ${
        index === blocks[blockKey].length - 1 ? 'disabled' : ''
      }>⬇️</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Ajout des éléments au contenu
    content.appendChild(blockTitle); // Ajouter le titre du bloc
    content.appendChild(timeContainer); // Ajouter le champ d'heure de début et l'affichage de fin
    content.appendChild(table); // Ajouter le tableau

    // Ajouter le contenu au conteneur principal
    tabContentContainer.appendChild(content);

    // Ajout des éléments au contenu
    content.appendChild(blockTitle); // Ajouter le titre du bloc
    content.appendChild(table); // Ajouter le tableau

    // Bouton pour ajouter un média
    const addMediaButton = document.createElement('button');
    addMediaButton.textContent = 'Ajouter un média';
    addMediaButton.className = 'btn-add'; // Ajoute la classe ici
    addMediaButton.addEventListener('click', () => addMedia(blockKey));


    // Assembler le contenu
    content.appendChild(table);
    content.appendChild(addMediaButton);

    // Ajouter l'onglet et le contenu aux conteneurs
    tabContainer.appendChild(tab);
    tabContentContainer.appendChild(content);
  });
}

// Fonction pour afficher le contenu d'un onglet
function showTabContent(blockKey) {
  // Désactiver tous les onglets et cacher tous les contenus
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));

  // Activer l'onglet sélectionné et afficher son contenu
  const selectedTab = [...tabContainer.children].find((tab) => tab.textContent === blockKey);
  const selectedContent = [...tabContentContainer.children].find(
    (content) => content.dataset.blockKey === blockKey
  );

  if (selectedTab && selectedContent) {
    selectedTab.classList.add('active');
    selectedContent.classList.add('active');
  }
}

// Fonction pour ajouter un nouveau bloc publicitaire
function addNewBlock() {
  const newBlockName = prompt('Nom du nouveau bloc publicitaire :');
  if (!newBlockName) return; // Annuler si aucune saisie

  const blockKey = `Bloc ${Object.keys(blocks).length + 1}`;
  if (blocks[blockKey]) {
    alert('Un bloc avec ce nom existe déjà.');
    return;
  }

  // Créer un bloc vide
  blocks[blockKey] = [];
  renderTabs(); // Rafraîchir les onglets
}


// Fonction pour ajouter un média
function addMedia(blockKey) {
  currentBlockEditing = blockKey;
  currentMediaEditingIndex = null;
  mediaNameInput.value = '';
  mediaDurationInput.value = '';
  modalMedia.classList.remove('hidden');
}

// Fonction pour modifier un média
function editMedia(blockKey, index) {
  // Définir les indices en cours d'édition
  currentBlockEditing = blockKey;
  currentMediaEditingIndex = index;

  // Récupérer les détails du média à éditer
  const media = blocks[blockKey][index];
  mediaNameInput.value = media.media; // Pré-remplir le champ nom
  mediaDurationInput.value = media.duree; // Pré-remplir la durée

  // Afficher la modale
  modalMedia.classList.remove('hidden');
  modalMedia.style.display = 'flex'; // Si tu veux être sûr qu'elle apparaisse bien

  // Gérer la fermeture de la modale sur le bouton Annuler
  document.getElementById('cancel-media').addEventListener('click', () => {
      modalMedia.classList.add('hidden');
      modalMedia.style.display = 'none';
  });
}

// Fonction pour enregistrer un média
saveMediaButton.addEventListener('click', () => {
  const mediaName = mediaNameInput.value.trim();
  const mediaDuration = parseInt(mediaDurationInput.value, 10);

  if (!mediaName || isNaN(mediaDuration) || mediaDuration <= 0) {
    alert('Veuillez remplir correctement les champs.');
    return;
  }

  if (currentMediaEditingIndex !== null) {
    blocks[currentBlockEditing][currentMediaEditingIndex] = {
      media: mediaName,
      duree: mediaDuration,
    };
  } else {
    blocks[currentBlockEditing].push({
      media: mediaName,
      duree: mediaDuration,
    });
  }

  modalMedia.classList.add('hidden');
  renderTabs();
});

cancelMediaButton.addEventListener('click', () => {
  modalMedia.classList.add('hidden');
});

// Fonction pour supprimer un média
function deleteMedia(blockKey, index) {
  if (confirm('Voulez-vous vraiment supprimer ce média ?')) {
    blocks[blockKey].splice(index, 1);
    renderTabs();
  }
}

// Fonction pour déplacer un média vers le haut
function moveMediaUp(blockKey, index) {
  if (index > 0) {
    const blockData = blocks[blockKey];
    [blockData[index - 1], blockData[index]] = [blockData[index], blockData[index - 1]];
    renderTabs();
  }
}

// Fonction pour déplacer un média vers le bas
function moveMediaDown(blockKey, index) {
  const blockData = blocks[blockKey];
  if (index < blockData.length - 1) {
    [blockData[index], blockData[index + 1]] = [blockData[index + 1], blockData[index]];
    renderTabs();
  }
}

// Initialisation
renderTabs();

//data-link
document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne tous les éléments avec "data-link"
  const links = document.querySelectorAll("[data-link]");

  // Ajoute un gestionnaire d'événements pour chaque élément
  links.forEach(link => {
      link.addEventListener("click", event => {
          event.preventDefault(); // Empêche l'action par défaut
          const target = link.getAttribute("data-link"); // Récupère l'URL cible
          console.log("Redirection vers :", target); // Pour vérifier dans la console
          window.location.href = target; // Redirige vers l'URL cible
      });
  });
});




