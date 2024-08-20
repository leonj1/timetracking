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
        activityTable.innerHTML = ''; // Clear existing rows
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
                return startDate.getMonth() === month && startDate.getFullYear() === year;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        activityData.forEach((activity, index) => {
            const row = activityTable.insertRow();
            const cells = [
                activity.team,
                activity.name,
                calculateDays(activity),
                formatDate(new Date(activity.startDate)),
                activity.endDate ? formatDate(new Date(activity.endDate)) : 'N/A',
                activity.reason || 'N/A'
            ];

            cells.forEach((cellContent, cellIndex) => {
                const cell = row.insertCell(cellIndex);
                cell.textContent = cellContent;
                cell.classList.add('text-center');
            });

            function calculateDays(activity) {
                const startDate = new Date(activity.startDate);
                const endDate = activity.endDate ? new Date(activity.endDate) : null;
                return endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 1;
            }

            function formatDate(date) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${months[date.getMonth()]} ${date.getDate()}`;
            }
        });
    }

    renderActivityDetails();
});
