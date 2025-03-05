let timerRunning = true;
let totalSeconds = localStorage.getItem('totalTime') ? parseInt(localStorage.getItem('totalTime')) : 0;
let subjectTimer = null;
let currentSubject = null;
let studyData = JSON.parse(localStorage.getItem('studyData')) || {};
let monthlyData = JSON.parse(localStorage.getItem('monthlyData')) || {};

console.log("Script Loaded Successfully");

function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTime() {
    if (timerRunning) {
        totalSeconds++;
        localStorage.setItem('totalTime', totalSeconds);
        let timerElement = document.getElementById('timer');
        if (timerElement) timerElement.textContent = formatTime(totalSeconds);
    }
}

function startSubjectTimer() {
    let subject = document.getElementById('subject');
    if (subject && subject.value) {
        if (subjectTimer) {
            clearInterval(subjectTimer);
        }
        currentSubject = subject.value;
        console.log("Starting timer for:", currentSubject);
        subjectTimer = setInterval(() => {
            studyData[currentSubject] = (studyData[currentSubject] || 0) + 1;
            localStorage.setItem('studyData', JSON.stringify(studyData));
            updateSubjectReport();
        }, 1000);
    }
}


function stopSubjectTimer() {
    if (subjectTimer) {
        clearInterval(subjectTimer);
        subjectTimer = null;
        console.log("Stopped timer for:", currentSubject);
    }
    localStorage.setItem('studyData', JSON.stringify(studyData));
    updateSubjectReport();
    saveMonthlyReport();
}
function saveMonthlyReport() {
    let currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!monthlyData[currentMonth]) {
        monthlyData[currentMonth] = {};
    }
    for (let subject in studyData) {
        monthlyData[currentMonth][subject] = (monthlyData[currentMonth][subject] || 0) + studyData[subject];
    }
    localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
    console.log("Saved Monthly Report:", monthlyData);
}

function loadMonthlyReport() {
    let monthSelect = document.getElementById('month-select');
    let tableBody = document.getElementById('monthly-times');
    if (!monthSelect || !tableBody) return;
    
    let selectedMonth = monthSelect.value;
    let reportData = monthlyData[selectedMonth] || {};
    
    tableBody.innerHTML = '';
    for (let subject in reportData) {
        let row = `<tr><td>${subject}</td><td>${formatTime(reportData[subject])}</td></tr>`;
        tableBody.innerHTML += row;
    }
    console.log("Loaded Monthly Report for:", selectedMonth, reportData);
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM Loaded, Attaching Event Listeners");
    loadMonths();
    
    let startBtn = document.getElementById('start-btn');
    let stopBtn = document.getElementById('stop-btn');
    let logoutBtn = document.getElementById('logout-btn');
    let resetTodayBtn = document.getElementById('reset-today');
    let resetReportBtn = document.getElementById('reset-report');
    let monthSelect = document.getElementById('month-select');

    if (startBtn) startBtn.addEventListener('click', startSubjectTimer);
    if (stopBtn) stopBtn.addEventListener('click', stopSubjectTimer);
    if (logoutBtn) logoutBtn.addEventListener('click', function() {
        if (confirm("Do you want to save today's report before logging out?")) {
            saveMonthlyReport();
        }
        console.log("Logging out...");
        localStorage.clear();
        window.location.href = 'login.html';
    });
    if (resetTodayBtn) resetTodayBtn.addEventListener('click', resetTodayReport);
    if (resetReportBtn) resetReportBtn.addEventListener('click', resetMonthlyReport);
    if (monthSelect) monthSelect.addEventListener('change', loadMonthlyReport);

    updateSubjectReport();
    setInterval(updateTime, 1000);
});


function saveMonthlyReport() {
    let currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!monthlyData[currentMonth]) {
        monthlyData[currentMonth] = {};
    }
    for (let subject in studyData) {
        monthlyData[currentMonth][subject] = (monthlyData[currentMonth][subject] || 0) + studyData[subject];
    }
    localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
    console.log("Saved Monthly Report:", monthlyData);
}

function updateSubjectReport() {
    let tableBody = document.getElementById('subject-times');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    for (let subject in studyData) {
        let row = `<tr><td>${subject}</td><td>${formatTime(studyData[subject])}</td></tr>`;
        tableBody.innerHTML += row;
    }
    console.log("Updated Today's Report:", studyData);
}

function loadTodayReportOnMonthlyPage() {
    let tableBody = document.getElementById('today-times');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    for (let subject in studyData) {
        let row = `<tr><td>${subject}</td><td>${formatTime(studyData[subject])}</td></tr>`;
        tableBody.innerHTML += row;
    }
    console.log("Loaded Today's Report on Monthly Report Page:", studyData);
}

function loadMonths() {
    let monthSelect = document.getElementById('month-select');
    if (!monthSelect) return;
    
    const allMonths = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    let currentYear = new Date().getFullYear();
    
    monthSelect.innerHTML = '';
    
    allMonths.forEach(month => {
        let monthYear = `${month} ${currentYear}`;
        let option = document.createElement('option');
        option.value = monthYear;
        option.textContent = monthYear;
        monthSelect.appendChild(option);
    });
    
    console.log("Loaded Current Year's Months in Dropdown");
}

function resetTodayReport() {
    if (confirm("Are you sure you want to reset today's report?")) {
        localStorage.removeItem('studyData');
        studyData = {};
        updateSubjectReport();
        loadTodayReportOnMonthlyPage();
        console.log("Today's report reset successfully");
    }
}

function resetMonthlyReport() {
    if (confirm("Are you sure you want to reset the monthly report?")) {
        localStorage.removeItem('monthlyData');
        monthlyData = {};
        loadMonthlyReport();
        console.log("Monthly report reset successfully");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM Loaded, Attaching Event Listeners");
    loadTodayReportOnMonthlyPage();
    
    let startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startSubjectTimer);
        console.log("Start button attached");
    }
    
    let stopBtn = document.getElementById('stop-btn');
    if (stopBtn) {
        stopBtn.addEventListener('click', stopSubjectTimer);
        console.log("Stop button attached");
    }
    let logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm("Do you want to save today's report before logging out?")) {
                saveMonthlyReport();
            }
            console.log("Logging out...");
            localStorage.clear();
            window.location.href = 'login.html';
        });
        
    }
    
    let resetTodayBtn = document.getElementById('reset-today');
    if (resetTodayBtn) {
        resetTodayBtn.addEventListener('click', resetTodayReport);
    }
    
    let resetReportBtn = document.getElementById('reset-report');
    if (resetReportBtn) {
        resetReportBtn.addEventListener('click', resetMonthlyReport);
    }
    
    updateSubjectReport();
    setInterval(updateTime, 1000);
    
});
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM Loaded, Attaching Event Listeners");
    loadMonths(); // Move this to the end if needed
});
