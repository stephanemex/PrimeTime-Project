// Fonction pour calculer l'heure de fin
function calculateEndTime(startTime, mediaDurations) {
  if (!startTime) return '';

  const [hours, minutes] = startTime.split(':').map(Number);
  const totalDuration = mediaDurations.reduce((sum, duration) => sum + duration, 0);

  const endTime = new Date();
  endTime.setHours(hours);
  endTime.setMinutes(minutes);
  endTime.setSeconds(totalDuration);

  return endTime.toTimeString().split(' ')[0];
}

// Fonction pour convertir une durée en secondes au format MM:SS
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
