document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const personInfo = document.getElementById('personInfo');
    const activitiesList = document.getElementById('activitiesList');
    const activityForm = document.getElementById('activityForm');

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

    activityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const reason = document.getElementById('reason').value;

        if (!reason) {
            alert('Please enter a reason');
            return;
        }

        if (!person.activities) {
            person.activities = [];
        }

        person.activities.push({
            startDate: startDate,
            endDate: endDate || null,
            reason: reason
        });


        localStorage.setItem('people', JSON.stringify(people));

        renderActivities();
        activityForm.reset();
    });

    // Set end date to same month and year as start date
    document.getElementById('startDate').addEventListener('change', function() {
        const startDate = new Date(this.value);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    });

    // Populate reason dropdown
    const reasonSelect = document.getElementById('reason');
    function populateReasonSelect() {
        reasonSelect.innerHTML = '<option value="">Select a reason</option>';
        reasons.forEach((reason) => {
            const option = document.createElement('option');
            option.value = reason;
            option.textContent = reason;
            reasonSelect.appendChild(option);
        });
    }
    populateReasonSelect();

    renderActivities();
    renderActivitySummary();
});

function renderActivitySummary() {
    const currentYear = new Date().getFullYear();
    const activitySummary = {};

    person.activities.forEach(activity => {
        const activityYear = new Date(activity.startDate).getFullYear();
        if (activityYear === currentYear) {
            if (!activitySummary[activity.reason]) {
                activitySummary[activity.reason] = 0;
            }
            activitySummary[activity.reason] += calculateDays(activity);
        }
    });

    const sortedSummary = Object.entries(activitySummary)
        .sort((a, b) => b[1] - a[1]);

    const activitySummaryList = document.getElementById('activitySummaryList');
    activitySummaryList.innerHTML = '';

    sortedSummary.forEach(([reason, days]) => {
        const li = document.createElement('li');
        li.textContent = `${reason}: ${days} day${days !== 1 ? 's' : ''}`;
        activitySummaryList.appendChild(li);
    });
}

function calculateDays(activity) {
    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : startDate;
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
}
