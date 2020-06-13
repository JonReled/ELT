export function setUpDatabase() {
    const defaultExerciseDatabase = [
        {key:'Bench', value: 'Bench', text: 'Bench'}, 
        {key:'Bench', value: 'Deadlift', text: 'Deadlift'}, 
        {key:'Bench', value: 'Squat', text: 'Squat'}
    ];
    const defaultLogDatabase = {
        
    };
    const defaultUserSettings = {
    weightUnit: 'kg',
    heightUnit: 'cm'
    }
    const defaultUserPRs = {
    Bench: {tested1RM: 0, estimated1RM: 0},
    Deadlift: {tested1RM: 0, estimated1RM: 0},
    Squat: {tested1RM: 0, estimated1RM: 0},
    Total: {tested1RM: 0, estimated1RM: 0}
    }

    if (localStorage.length === 0) {
        localStorage.setItem('exerciseDatabase', JSON.stringify(defaultExerciseDatabase));
        localStorage.setItem('logDatabase', JSON.stringify(defaultLogDatabase));
        localStorage.setItem('userSettings', JSON.stringify(defaultUserSettings));
        localStorage.setItem('userPRs', JSON.stringify(defaultUserPRs));
      }
}

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