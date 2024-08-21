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

    function createActivityGrids() {
        const people = JSON.parse(localStorage.getItem('people')) || [];
        const activityYears = new Set();
        const activityGridContainer = document.getElementById('activityGridContainer');
        activityGridContainer.innerHTML = '';

        const currentYear = new Date().getFullYear();
        const relevantYears = [currentYear - 1, currentYear, currentYear + 1];

        // Collect relevant years with activities
        people.forEach(person => {
            (person.activities || []).forEach(activity => {
                if (activity.startDate) {
                    const startDate = new Date(activity.startDate);
                    const year = startDate.getFullYear();
                    if (relevantYears.includes(year)) {
                        activityYears.add(year);
                    }
                }
            });
        });

        // Sort years in ascending order
        const sortedYears = Array.from(activityYears).sort((a, b) => a - b);

        sortedYears.forEach(year => {
            const monthlyActivity = new Array(12).fill(0);

            people.forEach(person => {
                (person.activities || []).forEach(activity => {
                    if (activity.startDate) {
                        const startDate = new Date(activity.startDate);
                        if (startDate.getFullYear() === year) {
                            monthlyActivity[startDate.getMonth()]++;
                        }
                    }
                });
            });

            const maxActivity = Math.max(...monthlyActivity);

            const gridContainer = document.createElement('div');
            gridContainer.className = 'mb-4 flex items-center';
            const yearLabel = document.createElement('div');
            yearLabel.className = 'text-sm text-gray-600 mr-2';
            yearLabel.textContent = year;
            gridContainer.appendChild(yearLabel);

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-12 gap-0 flex-grow';

            for (let i = 0; i < 12; i++) {
                const cell = document.createElement('div');
                cell.className = 'h-8 w-8 rounded cursor-pointer';
                const intensity = monthlyActivity[i] / maxActivity;
                const color = getColorForIntensity(intensity);
                cell.style.backgroundColor = color;
                cell.title = `${monthlyActivity[i]} activities in ${new Date(year, i).toLocaleString('default', { month: 'long' })} ${year}`;
                cell.dataset.month = i;
                cell.dataset.year = year;
                cell.addEventListener('click', () => {
                    window.location.href = `activity_details.html?month=${i}&year=${year}`;
                });
                grid.appendChild(cell);
            }

            gridContainer.appendChild(grid);
            activityGridContainer.appendChild(gridContainer);
        });
    }

    function getColorForIntensity(intensity) {
        const r = Math.round(144 + (39 - 144) * intensity);
        const g = Math.round(198 + (111 - 198) * intensity);
        const b = Math.round(144 + (255 - 144) * intensity);
        return `rgb(${r}, ${g}, ${b})`;
    }

    createActivityGrids();
});
