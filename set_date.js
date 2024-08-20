document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const personInfo = document.getElementById('personInfo');
    const dateForm = document.getElementById('dateForm');

    const urlParams = new URLSearchParams(window.location.search);
    const personIndex = urlParams.get('index');

    let people = JSON.parse(localStorage.getItem('people')) || [];
    const person = people[personIndex];

    if (!person) {
        alert('Person not found');
        window.location.href = 'people.html';
        return;
    }

    personInfo.textContent = `Setting date for: ${person.name} (${person.team})`;

    backButton.addEventListener('click', function() {
        window.location.href = 'people.html';
    });

    dateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        person.startDate = startDate;
        person.endDate = endDate || null;

        localStorage.setItem('people', JSON.stringify(people));

        alert('Date saved successfully');
        window.location.href = 'people.html';
    });

    // Pre-fill form if dates are already set
    if (person.startDate) {
        document.getElementById('startDate').value = person.startDate;
    }
    if (person.endDate) {
        document.getElementById('endDate').value = person.endDate;
    }
});
