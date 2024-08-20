document.addEventListener('DOMContentLoaded', function() {
    const manageTeamsButton = document.getElementById('manageTeamsButton');
    const managePeopleButton = document.getElementById('managePeopleButton');
    const activityGrid = document.getElementById('activityGrid');

    manageTeamsButton.addEventListener('click', function() {
        window.location.href = 'teams.html';
    });

    managePeopleButton.addEventListener('click', function() {
        window.location.href = 'people.html';
    });

    function createActivityGrid() {
        const currentYear = new Date().getFullYear();
        const people = JSON.parse(localStorage.getItem('people')) || [];
        const monthlyActivity = new Array(12).fill(0);

        people.forEach(person => {
            (person.activities || []).forEach(activity => {
                if (activity.startDate) {
                    const startDate = new Date(activity.startDate);
                    if (startDate.getFullYear() === currentYear) {
                        monthlyActivity[startDate.getMonth()]++;
                    }
                }
            });
        });

        const maxActivity = Math.max(...monthlyActivity);

        for (let i = 0; i < 12; i++) {
            const cell = document.createElement('div');
            cell.className = 'h-8 rounded cursor-pointer';
            const intensity = monthlyActivity[i] / maxActivity;
            const color = getColorForIntensity(intensity);
            cell.style.backgroundColor = color;
            cell.title = `${monthlyActivity[i]} activities in ${new Date(currentYear, i).toLocaleString('default', { month: 'long' })}`;
            cell.dataset.month = i;
            cell.addEventListener('click', () => {
                window.location.href = `activity_details.html?month=${i}&year=${currentYear}`;
            });
            activityGrid.appendChild(cell);
        }
    }

    function getColorForIntensity(intensity) {
        const r = Math.round(144 + (39 - 144) * intensity);
        const g = Math.round(198 + (111 - 198) * intensity);
        const b = Math.round(144 + (255 - 144) * intensity);
        return `rgb(${r}, ${g}, ${b})`;
    }

    createActivityGrid();
});
