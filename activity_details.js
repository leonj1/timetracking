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
            .filter(person => {
                const startDate = new Date(person.startDate);
                return startDate.getMonth() === month && startDate.getFullYear() === year;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        activityData.forEach((person, index) => {
            const row = activityTable.insertRow();
            const cells = [
                person.team,
                person.name,
                calculateDays(person),
                formatDate(new Date(person.startDate)),
                person.endDate ? formatDate(new Date(person.endDate)) : 'N/A',
                person.reason || 'N/A'
            ];

            cells.forEach((cellContent, cellIndex) => {
                const cell = row.insertCell(cellIndex);
                cell.textContent = cellContent;
                cell.classList.add('text-center');
                if (cellIndex === 3 || cellIndex === 4) {
                    cell.setAttribute('data-index', index);
                    cell.classList.add('editable', cellIndex === 3 ? 'start-date' : 'end-date');
                }
            });

            function calculateDays(person) {
                const startDate = new Date(person.startDate);
                const endDate = person.endDate ? new Date(person.endDate) : null;
                return endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 1;
            }

    function formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }

            const actionsCell = row.insertCell(6);
            actionsCell.className = 'text-center';
            const editButton = document.createElement('button');
            editButton.innerHTML = '✏️'; // Pencil emoji
            editButton.className = 'edit-dates btn btn-small btn-secondary';
            editButton.setAttribute('data-index', index);
            editButton.setAttribute('title', 'Edit dates'); // Add tooltip
            actionsCell.appendChild(editButton);

        });
    }

    activityTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-dates')) {
            const index = e.target.getAttribute('data-index');
            const row = e.target.closest('tr');
            const startCell = row.querySelector('.start-date');
            const endCell = row.querySelector('.end-date');

            const startDate = prompt('Enter new start date (YYYY-MM-DD):', startCell.textContent);
            if (startDate) {
                const people = JSON.parse(localStorage.getItem('people')) || [];
                people[index].startDate = startDate;
                startCell.textContent = new Date(startDate).toLocaleDateString();
            }

            const endDate = prompt('Enter new end date (YYYY-MM-DD), or leave blank for no end date:', endCell.textContent === 'N/A' ? '' : endCell.textContent);
            if (endDate !== null) {
                const people = JSON.parse(localStorage.getItem('people')) || [];
                people[index].endDate = endDate || null;
                endCell.textContent = endDate ? new Date(endDate).toLocaleDateString() : 'N/A';
                localStorage.setItem('people', JSON.stringify(people));
                renderActivityDetails(); // Re-render to update days calculation
            }
        }
    });

    renderActivityDetails();
});
