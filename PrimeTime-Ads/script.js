//Ajout d'un bloc publicitaire
function addAdBlock() {
    const adBlocksDiv = document.getElementById('adBlocks');
    const newRow = document.createElement('div'); // Nouvelle ligne pour chaque bloc
    newRow.className = 'adBlockRow';

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'adBlock';
    input.placeholder = "Ex: 47";
    input.min = 1;

    newRow.appendChild(input);
    adBlocksDiv.appendChild(newRow);
}

//Calcule de la durée de chaque partie
function calculateSegments() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const partDuration = parseInt(document.getElementById('partDuration').value);

    if (!startTime || !endTime || isNaN(partDuration)) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);
    const totalDuration = end - start;

    if (totalDuration <= 0) {
        alert("L'heure de fin doit être après l'heure de début.");
        return;
    }

    const adDurations = Array.from(document.getElementsByClassName('adBlock'))
                             .map(input => parseInt(input.value))
                             .filter(value => !isNaN(value))
                             .map(value => value / 60);

    if (adDurations.length === 0) {
        alert("Veuillez entrer au moins une durée pour un bloc publicitaire.");
        return;
    }

    let currentTime = start;
    let resultHTML = `<table><thead><tr><th>Élément</th><th>Durée</th><th>Début</th><th>Fin</th></tr></thead><tbody>`;
    let segmentCount = 0;
    let adCount = 0;
    const segments = [];
    let lastPartStart = currentTime;

    // Première passe : créer tous les segments
    while (currentTime < end) {
        const remainingTime = end - currentTime;
        const nextAdDuration = adDurations[adCount % adDurations.length];
        
        // S'il reste moins de temps que la durée standard + pub, c'est notre dernière partie
        if (remainingTime <= partDuration + nextAdDuration) {
            const timeForLastPart = remainingTime - nextAdDuration;
            
            // Si la dernière partie serait trop courte, on fusionne avec la partie précédente
            if (timeForLastPart < partDuration && segments.length > 0) {
                // Retirer le dernier bloc publicitaire
                const lastAd = segments.pop();
                // Retirer la dernière partie
                const lastPart = segments.pop();
                
                // Calculer la nouvelle durée totale de la partie fusionnée
                const totalPartDuration = lastPart.duration/60 + timeForLastPart;
                
                // Ajouter la partie fusionnée
                segments.push({
                    type: "Partie",
                    label: `Partie ${segmentCount}`,
                    duration: totalPartDuration * 60,
                    start: lastPart.start,
                    end: convertMinutesToTime(end - nextAdDuration)
                });
                
                // Ajouter le dernier bloc publicitaire
                segments.push({
                    type: "Bloc",
                    label: `Bloc publicitaire ${adCount + 1}`,
                    duration: nextAdDuration * 60,
                    start: convertMinutesToTime(end - nextAdDuration),
                    end: convertMinutesToTime(end)
                });
            } else {
                // Ajouter la dernière partie normalement
                segments.push({
                    type: "Partie",
                    label: `Partie ${++segmentCount}`,
                    duration: timeForLastPart * 60,
                    start: convertMinutesToTime(currentTime),
                    end: convertMinutesToTime(end - nextAdDuration)
                });
                
                // Ajouter le dernier bloc publicitaire
                segments.push({
                    type: "Bloc",
                    label: `Bloc publicitaire ${++adCount}`,
                    duration: nextAdDuration * 60,
                    start: convertMinutesToTime(end - nextAdDuration),
                    end: convertMinutesToTime(end)
                });
            }
            break;
        }

        // Ajouter une partie normale
        segments.push({
            type: "Partie",
            label: `Partie ${++segmentCount}`,
            duration: partDuration * 60,
            start: convertMinutesToTime(currentTime),
            end: convertMinutesToTime(currentTime + partDuration)
        });
        currentTime += partDuration;

        // Ajouter le bloc publicitaire
        segments.push({
            type: "Bloc",
            label: `Bloc publicitaire ${++adCount}`,
            duration: nextAdDuration * 60,
            start: convertMinutesToTime(currentTime),
            end: convertMinutesToTime(currentTime + nextAdDuration)
        });
        currentTime += nextAdDuration;
    }

    // Générer le HTML
    segments.forEach(segment => {
        resultHTML += `<tr${segment.type === "Bloc" ? ' class="ad-block"' : ''}><td>${segment.label}</td><td>${formatDuration(segment.duration)}</td><td>${segment.start}</td><td>${segment.end}</td></tr>`;
    });

    resultHTML += `</tbody></table>`;
    document.getElementById('result').innerHTML = resultHTML;

    // Rendre le bouton "Télécharger en Excel" visible
    document.querySelector('.excel-btn').style.display = 'block';
}

// Fonction pour convertir les minutes en format MM:SS
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Fonction pour générer le fichier Excel avec en-têtes et tableau des résultats
async function generateExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Résultats");

    // Récupérer le titre de l'émission depuis le champ d'entrée
    const showTitle = document.getElementById('showTitle').value || "Émission sans titre";

    // En-tête personnalisée avec le titre de l'émission
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = `Résultats de l'émission : "${showTitle}"`;
    worksheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDA89AA' }  // Rose tendre
    };
    worksheet.getRow(1).height = 30;

    // Ajouter la date de génération du rapport
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = `Date de Génération : ${new Date().toLocaleDateString()}`;
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDA89AA' }  // Rose tendre
    };
    worksheet.getCell('A2').font = { color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(2).height = 20;

    // Ajouter un espace entre l'en-tête et les données
    worksheet.addRow([]);
    worksheet.addRow([]);

    // En-têtes des colonnes avec mise en forme en rose tendre
    const headerRow = worksheet.addRow(['Élément', 'Durée', 'Début', 'Fin']);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDA89AA' }  // Rose tendre
        };
    });

    // Ajuster la largeur des colonnes
    worksheet.getColumn(1).width = 15; // Élément
    worksheet.getColumn(2).width = 12; // Durée
    worksheet.getColumn(3).width = 12; // Début
    worksheet.getColumn(4).width = 12; // Fin

    // Ajouter les données du tableau HTML au fichier Excel
    const rows = document.querySelectorAll("#result tbody tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        const newRow = worksheet.addRow(rowData);
        newRow.height = 20;

        // Identifier et styliser les blocs publicitaires en rose clair
        const isAdBlock = row.classList.contains("ad-block");
        if (isAdBlock) {
            newRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF2C4D2' }  // Rose clair pour blocs publicitaires
                };
            });
        }

        newRow.getCell(1).font = { bold: true };
        newRow.eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
    });

    // Enregistrer le fichier Excel avec le titre de l'émission dans le nom du fichier
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultats_${showTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
}

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
