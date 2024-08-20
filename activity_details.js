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
            row.insertCell(0).textContent = person.team;
            row.insertCell(1).textContent = person.name;
            
            // Calculate and display the number of days
            const startDate = new Date(person.startDate);
            const endDate = person.endDate ? new Date(person.endDate) : null;
            const days = endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 1; // If no end date, set days to 1
            row.insertCell(2).textContent = days;
            
            const startCell = row.insertCell(3);
            startCell.textContent = new Date(person.startDate).toLocaleDateString();
            startCell.setAttribute('data-index', index);
            startCell.classList.add('editable', 'start-date');

            const endCell = row.insertCell(4);
            endCell.textContent = person.endDate ? new Date(person.endDate).toLocaleDateString() : 'N/A';
            endCell.setAttribute('data-index', index);
            endCell.classList.add('editable', 'end-date');

            const actionsCell = row.insertCell(5);
            const editButton = document.createElement('button');
            editButton.innerHTML = '✏️'; // Pencil emoji
            editButton.className = 'edit-dates btn btn-small btn-secondary mr-2';
            editButton.setAttribute('data-index', index);
            editButton.setAttribute('title', 'Edit dates'); // Add tooltip
            actionsCell.appendChild(editButton);

            const deleteCell = row.insertCell(6);
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️'; // Trash can emoji
            deleteButton.className = 'delete-person btn btn-small btn-danger';
            deleteButton.setAttribute('data-index', index);
            deleteButton.setAttribute('title', 'Delete person'); // Add tooltip
            deleteCell.appendChild(deleteButton);
        });
    }

    activityTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-person')) {
            const index = e.target.getAttribute('data-index');
            if (confirm('Are you sure you want to delete this activity record?')) {
                const people = JSON.parse(localStorage.getItem('people')) || [];
                const person = people[index];
                if (person) {
                    // Remove the start and end dates for this specific activity
                    delete person.startDate;
                    delete person.endDate;
                    localStorage.setItem('people', JSON.stringify(people));
                    renderActivityDetails(); // Re-render the table
                }
            }
        }
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
