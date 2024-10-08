document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const personInfo = document.getElementById('personInfo');
    const activitiesList = document.getElementById('activitiesList');
    const activityForm = document.getElementById('activityForm');
    const summaryYearSelect = document.getElementById('summaryYear');

    const urlParams = new URLSearchParams(window.location.search);
    const personIndex = urlParams.get('index');

    let people = JSON.parse(localStorage.getItem('people')) || [];
    let reasons = JSON.parse(localStorage.getItem('reasons')) || [];
    const person = people[personIndex];

    if (!person) {
        alert('Person not found');
        window.location.href = 'people.html';
        return;
    }

    personInfo.textContent = `Managing activities for: ${person.name} (${person.team})`;

    const viewActivitiesButton = document.getElementById('viewActivitiesButton');
    viewActivitiesButton.addEventListener('click', function() {
        window.location.href = `activity_list.html?index=${personIndex}`;
    });

    backButton.addEventListener('click', function() {
        window.location.href = 'people.html';
    });

    const addActivityButton = document.getElementById('addActivityButton');
    addActivityButton.addEventListener('click', function() {
        window.location.href = `add_activity.html?index=${personIndex}`;
    });

    // Populate summary year dropdown
    function populateSummaryYearSelect() {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 2; year <= currentYear + 2; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            summaryYearSelect.appendChild(option);
        }
        summaryYearSelect.value = currentYear;
    }
    populateSummaryYearSelect();

    // Add event listener for summary year change
    summaryYearSelect.addEventListener('change', renderActivitySummary);

    renderActivities();
    renderActivitySummary();
});

function renderActivitySummary() {
    const summaryYearSelect = document.getElementById('summaryYear');
    const selectedYear = parseInt(summaryYearSelect.value);
    
    const activitySummary = {};

    if (person && person.activities) {
        person.activities.forEach(activity => {
            const startDate = new Date(activity.startDate);
            const endDate = activity.endDate ? new Date(activity.endDate) : startDate;
            if (startDate.getFullYear() === selectedYear || endDate.getFullYear() === selectedYear) {
                if (!activitySummary[activity.reason]) {
                    activitySummary[activity.reason] = 0;
                }
                activitySummary[activity.reason] += calculateDaysInYear(activity, selectedYear);
            }
        });
    }

    const sortedSummary = Object.entries(activitySummary)
        .sort((a, b) => b[1] - a[1]);

    const activitySummaryTable = document.getElementById('activitySummaryTable').getElementsByTagName('tbody')[0];
    activitySummaryTable.innerHTML = '';

    let totalDays = 0;
    sortedSummary.forEach(([reason, days]) => {
        const row = activitySummaryTable.insertRow();
        const daysCell = row.insertCell(0);
        const reasonCell = row.insertCell(1);
        daysCell.textContent = days;
        reasonCell.textContent = reason;
        totalDays += days;
    });

    // Add total row
    const totalRow = activitySummaryTable.insertRow();
    const totalDaysCell = totalRow.insertCell(0);
    const totalLabelCell = totalRow.insertCell(1);
    totalDaysCell.textContent = totalDays;
    totalLabelCell.textContent = 'Total';
    totalRow.classList.add('font-bold');
}

function calculateDaysInYear(activity, year) {
    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : startDate;
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    const effectiveStart = new Date(Math.max(startDate, yearStart));
    const effectiveEnd = new Date(Math.min(endDate, yearEnd));

    return Math.ceil((effectiveEnd - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
}

document.addEventListener('DOMContentLoaded', function() {
    // ... (existing code)

    const summaryYearSelect = document.getElementById('summaryYear');
    summaryYearSelect.addEventListener('change', renderActivitySummary);

    // ... (existing code)
});

function calculateDays(activity) {
    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : startDate;
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
}
