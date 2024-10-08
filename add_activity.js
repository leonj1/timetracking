document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const personInfo = document.getElementById('personInfo');
    const activityForm = document.getElementById('activityForm');

    const urlParams = new URLSearchParams(window.location.search);
    const personIndex = urlParams.get('index');

    let people = JSON.parse(localStorage.getItem('people')) || [];
    let reasons = JSON.parse(localStorage.getItem('reasons')) || [];
    const person = people[personIndex];

    if (!person) {
        alert('Person not found');
        window.location.href = 'set_date.html';
        return;
    }

    personInfo.textContent = `Adding activity for: ${person.name} (${person.team})`;

    backButton.addEventListener('click', function() {
        window.location.href = `set_date.html?index=${personIndex}`;
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

        alert('Activity added successfully');
        window.location.href = `set_date.html?index=${personIndex}`;
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
});
