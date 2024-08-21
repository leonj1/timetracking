document.addEventListener('DOMContentLoaded', async function() {
    const manageTeamsButton = document.getElementById('manageTeamsButton');
    const managePeopleButton = document.getElementById('managePeopleButton');
    const activityGrid = document.getElementById('activityGrid');

    manageTeamsButton.addEventListener('click', function() {
        window.location.href = 'teams.html';
    });

    managePeopleButton.addEventListener('click', function() {
        window.location.href = 'people.html';
    });

    await fetchHolidays();
    renderUpcomingHolidays();

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
            const data = await response.json();
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

    const holidayList = upcomingHolidays.map(holiday => {
        const date = new Date(holiday.date);
        const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
        const flag = getCountryFlag(holiday.country);
        return `<li class="mb-2">
            ${flag} <span class="font-semibold">${formattedDate}</span> - ${holiday.name} (${holiday.country})
        </li>`;
    }).join('');

    upcomingHolidaysContainer.innerHTML = `<ul class="list-disc pl-5">${holidayList}</ul>`;
}
