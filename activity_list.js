document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const personInfo = document.getElementById('personInfo');
    const activitiesList = document.getElementById('activitiesList');

    const urlParams = new URLSearchParams(window.location.search);
    const personIndex = urlParams.get('index');

    let people = JSON.parse(localStorage.getItem('people')) || [];
    const person = people[personIndex];

    if (!person) {
        alert('Person not found');
        window.location.href = 'set_date.html';
        return;
    }

    personInfo.textContent = `Activities for: ${person.name} (${person.team})`;

    function renderActivities() {
        activitiesList.innerHTML = '';
        if (!person.activities || person.activities.length === 0) {
            activitiesList.innerHTML = '<p>No activities yet.</p>';
            return;
        }
        person.activities.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        person.activities.forEach((activity, index) => {
            const activityElement = document.createElement('div');
            activityElement.className = 'bg-white p-2 mb-2 rounded flex justify-between items-center';
            activityElement.innerHTML = `
                <span>${activity.startDate} to ${activity.endDate || 'N/A'}: ${activity.reason}</span>
                <button class="delete-activity btn btn-small btn-danger" data-index="${index}" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;
            activitiesList.appendChild(activityElement);
        });
    }

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

    backButton.addEventListener('click', function() {
        window.location.href = `set_date.html?index=${personIndex}`;
    });

    renderActivities();
});