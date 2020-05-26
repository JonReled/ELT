export function addExerciseToDatabase(exerciseName) {
    let currentDatabase = JSON.parse(localStorage.getItem('exerciseDatabase'));
    currentDatabase.push({value: exerciseName, text: exerciseName});
    localStorage.setItem('exerciseDatabase', JSON.stringify(currentDatabase));
}

export function retrieveExerciseDatabase() {
   return (JSON.parse(localStorage.getItem('exerciseDatabase')));
}

export function addLogToDatabase(exerciseLog) {
    let currentLog = JSON.parse(localStorage.getItem('logDatabase'));
    currentLog.push(exerciseLog);
    localStorage.setItem('logDatabase', JSON.stringify(currentLog))
    console.log(localStorage)
} 