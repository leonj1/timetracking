document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const peopleList = document.getElementById('peopleList');
    const addPersonButton = document.getElementById('addPersonButton');

    let people = JSON.parse(localStorage.getItem('people')) || [];
    let teams = JSON.parse(localStorage.getItem('teams')) || [];

    function renderPeople() {
        peopleList.innerHTML = '';
        people.forEach((person, index) => {
            const personElement = document.createElement('div');
            personElement.className = 'flex items-center justify-between bg-white p-2 mb-2 rounded';
            personElement.innerHTML = `
                <span>${person.name} (${person.team})</span>
                <div>
                    <button class="edit-person btn btn-small btn-secondary mr-2" data-index="${index}">Edit</button>
                    <button class="delete-person btn btn-small btn-danger" data-index="${index}">Delete</button>
                </div>
            `;
            peopleList.appendChild(personElement);
        });
    }

    function savePeople() {
        localStorage.setItem('people', JSON.stringify(people));
    }

    function addOrEditPerson(personToEdit = null) {
        const name = prompt('Enter person name:', personToEdit ? personToEdit.name : '');
        if (!name) return;

        const teamOptions = teams.map((team, index) => `${index + 1}. ${team}`).join('\n');
        const teamPrompt = `Select a team number for ${name}:\n${teamOptions}`;
        const teamSelection = prompt(teamPrompt);

        if (!teamSelection) return;

        const selectedTeamIndex = parseInt(teamSelection) - 1;
        if (isNaN(selectedTeamIndex) || selectedTeamIndex < 0 || selectedTeamIndex >= teams.length) {
            alert('Invalid team selection');
            return;
        }

        const selectedTeam = teams[selectedTeamIndex];

        if (personToEdit) {
            personToEdit.name = name;
            personToEdit.team = selectedTeam;
        } else {
            people.push({ name, team: selectedTeam });
        }

        savePeople();
        renderPeople();
    }

    backButton.addEventListener('click', function() {
        window.location.href = 'popup.html';
    });

    addPersonButton.addEventListener('click', function() {
        addOrEditPerson();
    });

    peopleList.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-person')) {
            const index = e.target.dataset.index;
            addOrEditPerson(people[index]);
        } else if (e.target.classList.contains('delete-person')) {
            const index = e.target.dataset.index;
            if (confirm('Are you sure you want to delete this person?')) {
                people.splice(index, 1);
                savePeople();
                renderPeople();
            }
        }
    });

    renderPeople();
});
