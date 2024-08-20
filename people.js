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

    const personNameInput = document.getElementById('personName');
    const teamSelect = document.getElementById('teamSelect');

    function populateTeamSelect() {
        teamSelect.innerHTML = '<option value="">Select a team</option>';
        teams.forEach((team, index) => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamSelect.appendChild(option);
        });
    }

    function addOrEditPerson(personToEdit = null) {
        const name = personNameInput.value.trim();
        const selectedTeam = teamSelect.value;

        if (!name || !selectedTeam) {
            alert('Please enter a name and select a team');
            return;
        }

        if (personToEdit) {
            personToEdit.name = name;
            personToEdit.team = selectedTeam;
        } else {
            people.push({ name, team: selectedTeam });
        }

        savePeople();
        renderPeople();
        personNameInput.value = '';
        teamSelect.value = '';
    }

    backButton.addEventListener('click', function() {
        window.location.href = 'popup.html';
    });

    addPersonButton.addEventListener('click', function() {
        addOrEditPerson();
    });

    populateTeamSelect();

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
