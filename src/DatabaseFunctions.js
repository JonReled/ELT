export function addExerciseToDatabase(exerciseName) {
    let currentDatabase = JSON.parse(localStorage.getItem('exerciseDatabase'));
    currentDatabase.push({value: exerciseName, text: exerciseName});
    localStorage.setItem('exerciseDatabase', JSON.stringify(currentDatabase));
}

export function retrieveExerciseDatabase() {
   return (JSON.parse(localStorage.getItem('exerciseDatabase')));
}

export function addLogToDatabase(exerciseLog, day) {
    let currentLog = JSON.parse(localStorage.getItem('logDatabase'));
    currentLog[day] = exerciseLog;
    localStorage.setItem('logDatabase', JSON.stringify(currentLog))
}

export function removeLogFromDatabase(day) {
    let currentLog = JSON.parse(localStorage.getItem('logDatabase'));
    delete currentLog[day];
    localStorage.setItem('logDatabase', JSON.stringify(currentLog));
}

export function retrieveLogDatabase() {
    return (JSON.parse(localStorage.getItem('logDatabase')));
    
 }

 export function updateUserSettingsDatabase(settingName, value) {
    let currentSettings = JSON.parse(localStorage.getItem('userSettings'));
    currentSettings[settingName] = value;
    localStorage.setItem('userSettings', JSON.stringify(currentSettings));
 }

 export function retrieveUserSettingsDatabase(settingName) {
     return JSON.parse(localStorage.getItem('userSettings'))[settingName];
 }

 export function retrieveUserPR() {
     return JSON.parse(localStorage.getItem('userPRs'));
 }

 export function updateUserPR(exerciseName, value, type) {
     let currentPRs = JSON.parse(localStorage.getItem('userPRs'));
     currentPRs[exerciseName][type] = value;
     localStorage.setItem('userPRs', JSON.stringify(currentPRs));
 }