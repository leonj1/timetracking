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

    function renderActivities() {
        activitiesList.innerHTML = '';
        if (!person.activities || person.activities.length === 0) {
            activitiesList.innerHTML = '<p>No activities yet.</p>';
            return;
        }
        person.activities.forEach((activity, index) => {
            const activityElement = document.createElement('div');
            activityElement.className = 'bg-white p-2 mb-2 rounded flex justify-between items-center';
            activityElement.innerHTML = `
                <span>${activity.startDate} to ${activity.endDate || 'N/A'}: ${activity.reason}</span>
                <button class="delete-activity btn btn-small btn-danger" data-index="${index}">Delete</button>
            `;
            activitiesList.appendChild(activityElement);
        });

        // Add event listener for delete buttons
        activitiesList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-activity')) {
                const index = e.target.dataset.index;
                if (confirm('Are you sure you want to delete this activity?')) {
                    person.activities.splice(index, 1);
                    localStorage.setItem('people', JSON.stringify(people));
                    renderActivities();
                }
            }
        });
    }

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
});
