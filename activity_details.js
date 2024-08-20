document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const activityTitle = document.getElementById('activityTitle');
    const activityTable = document.getElementById('activityTable').getElementsByTagName('tbody')[0];

    const urlParams = new URLSearchParams(window.location.search);
    const month = parseInt(urlParams.get('month'));
    const year = parseInt(urlParams.get('year'));

    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    activityTitle.textContent = `Activity Details for ${monthName} ${year}`;

    backButton.addEventListener('click', function() {
        window.location.href = 'popup.html';
    });

    function renderActivityDetails() {
        const people = JSON.parse(localStorage.getItem('people')) || [];
        const activityData = people
            .filter(person => {
                const startDate = new Date(person.startDate);
                return startDate.getMonth() === month && startDate.getFullYear() === year;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        activityData.forEach(person => {
            const row = activityTable.insertRow();
            row.insertCell(0).textContent = person.team;
            row.insertCell(1).textContent = person.name;
            
            // Calculate and display the number of days
            const startDate = new Date(person.startDate);
            const endDate = person.endDate ? new Date(person.endDate) : new Date();
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            row.insertCell(2).textContent = days;
            
            row.insertCell(3).textContent = new Date(person.startDate).toLocaleDateString();
            row.insertCell(4).textContent = person.endDate ? new Date(person.endDate).toLocaleDateString() : 'N/A';
        });
    }

    renderActivityDetails();
});
