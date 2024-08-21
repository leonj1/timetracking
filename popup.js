document.addEventListener('DOMContentLoaded', async function() {
    const manageTeamsButton = document.getElementById('manageTeamsButton');
    const managePeopleButton = document.getElementById('managePeopleButton');
    const exportButton = document.getElementById('exportButton');
    const importButton = document.getElementById('importButton');
    const activityGrid = document.getElementById('activityGrid');

    manageTeamsButton.addEventListener('click', function() {
        window.location.href = 'teams.html';
    });

    managePeopleButton.addEventListener('click', function() {
        window.location.href = 'people.html';
    });

    const manageReasonsButton = document.getElementById('manageReasonsButton');
    manageReasonsButton.addEventListener('click', function() {
        window.location.href = 'reasons.html';
    });

    exportButton.addEventListener('click', exportData);
    importButton.addEventListener('click', importData);

    await fetchHolidays();
    renderUpcomingHolidays();

    function exportData() {
        const data = {
            people: JSON.parse(localStorage.getItem('people') || '[]'),
            teams: JSON.parse(localStorage.getItem('teams') || '[]'),
            holidays: JSON.parse(localStorage.getItem('holidays') || '[]')
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'team_manager_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    localStorage.setItem('people', JSON.stringify(data.people || []));
                    localStorage.setItem('teams', JSON.stringify(data.teams || []));
                    localStorage.setItem('holidays', JSON.stringify(data.holidays || []));
                    alert('Data imported successfully!');
                    location.reload();
                } catch (error) {
                    alert('Error importing data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

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

            const monthlyActivityPeople = new Array(12).fill().map(() => new Set());

            people.forEach(person => {
                (person.activities || []).forEach(activity => {
                    if (activity.startDate) {
                        const startDate = new Date(activity.startDate);
                        if (startDate.getFullYear() === year) {
                            monthlyActivityPeople[startDate.getMonth()].add(person.name);
                        }
                    }
                });
            });

            const maxActivity = Math.max(...monthlyActivityPeople.map(set => set.size));

            const gridContainer = document.createElement('div');
            gridContainer.className = 'mb-4 flex items-center';
            const yearLink = document.createElement('a');
            yearLink.className = 'text-sm text-blue-600 mr-2 hover:underline';
            yearLink.textContent = year;
            yearLink.href = `yearly_activities.html?year=${year}`;
            gridContainer.appendChild(yearLink);

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-12 gap-0 flex-grow';

            for (let i = 0; i < 12; i++) {
                const cell = document.createElement('div');
                cell.className = 'h-8 w-8 rounded cursor-pointer';
                const intensity = monthlyActivityPeople[i].size / maxActivity;
                const color = getColorForIntensity(intensity);
                cell.style.backgroundColor = color;
                const peopleNames = Array.from(monthlyActivityPeople[i]).sort().join(', ');
                cell.title = `${peopleNames} in ${new Date(year, i).toLocaleString('default', { month: 'long' })} ${year}`;
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
    renderUpcomingHolidays();
});

async function fetchHolidays() {
    const countries = ['US', 'GB', 'IN', 'CR'];
    const year = new Date().getFullYear();
    const holidays = [];

    for (const country of countries) {
        try {
            const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error(`Error parsing JSON for ${country}:`, parseError);
                console.log('Response text:', text);
                continue;
            }
            holidays.push(...data.map(holiday => ({
                date: holiday.date,
                name: holiday.name,
                country: country
            })));
        } catch (error) {
            console.error(`Error fetching holidays for ${country}:`, error);
        }
    }

    localStorage.setItem('holidays', JSON.stringify(holidays));
}

function getCountryFlag(country) {
    const flags = {
        'US': '🇺🇸',
        'GB': '🇬🇧',
        'IN': '🇮🇳',
        'CR': '🇨🇷'
    };
    return flags[country] || '';
}

function renderUpcomingHolidays() {
    const upcomingHolidaysContainer = document.getElementById('upcomingHolidays');
    const today = new Date();
    const sixMonthsLater = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());

    const holidays = JSON.parse(localStorage.getItem('holidays')) || [];

    const upcomingHolidays = holidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate >= today && holidayDate <= sixMonthsLater;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const holidayTable = upcomingHolidays.map(holiday => {
        const date = new Date(holiday.date);
        const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
        const flag = getCountryFlag(holiday.country);
        return `<tr>
            <td class="text-center w-8">${flag}</td>
            <td class="text-left w-24">${formattedDate}</td>
            <td class="text-left">${holiday.name} (${holiday.country})</td>
        </tr>`;
    }).join('');

    upcomingHolidaysContainer.innerHTML = `
        <table class="w-full">
            <thead>
                <tr>
                    <th class="w-8"></th>
                    <th class="w-24 text-left">Date</th>
                    <th class="text-center">Holiday</th>
                </tr>
            </thead>
            <tbody>${holidayTable}</tbody>
        </table>`;
}
