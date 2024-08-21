document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const yearTitle = document.getElementById('yearTitle');
    const activitiesTable = document.getElementById('activitiesTable').getElementsByTagName('tbody')[0];

    const urlParams = new URLSearchParams(window.location.search);
    const year = parseInt(urlParams.get('year'));

    yearTitle.textContent = `Activities for ${year}`;

    backButton.addEventListener('click', function() {
        window.location.href = 'popup.html';
    });

    function renderActivities() {
        const people = JSON.parse(localStorage.getItem('people')) || [];
        activitiesTable.innerHTML = ''; // Clear existing rows

        const activityData = people
            .flatMap(person => 
                (person.activities || []).map(activity => ({
                    ...activity,
                    team: person.team,
                    name: person.name
                }))
            )
            .filter(activity => {
                const startDate = new Date(activity.startDate);
                return startDate.getFullYear() === year;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        activityData.forEach((activity) => {
            const row = activitiesTable.insertRow();
            const cells = [
                activity.team,
                activity.name,
                calculateDays(activity),
                formatDate(new Date(activity.startDate)),
                activity.endDate ? formatDate(new Date(activity.endDate)) : 'N/A',
                activity.reason || 'N/A'
            ];

            cells.forEach((cellContent) => {
                const cell = row.insertCell();
                cell.textContent = cellContent;
                cell.classList.add('text-center', 'py-2', 'px-4');
            });
        });
    }

    function calculateDays(activity) {
        const startDate = new Date(activity.startDate);
        const endDate = activity.endDate ? new Date(activity.endDate) : null;
        return endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 1;
    }

    function formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }

    renderActivities();
});
