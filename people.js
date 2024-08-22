document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const peopleList = document.getElementById('peopleList');
    const addPersonButton = document.getElementById('addPersonButton');
    const showAddPersonFormButton = document.getElementById('showAddPersonFormButton');
    const addPersonForm = document.getElementById('addPersonForm');
    const editPersonTemplate = document.getElementById('edit-person-template');

    let people = JSON.parse(localStorage.getItem('people')) || [];
    let teams = JSON.parse(localStorage.getItem('teams')) || [];

    showAddPersonFormButton.addEventListener('click', function() {
        addPersonForm.classList.remove('hidden');
        showAddPersonFormButton.classList.add('hidden');
    });

    const hideAddPersonFormButton = document.getElementById('hideAddPersonFormButton');
    hideAddPersonFormButton.addEventListener('click', function() {
        addPersonForm.classList.add('hidden');
        showAddPersonFormButton.classList.remove('hidden');
    });

    function renderPeople() {
        peopleList.innerHTML = '';
        people.forEach((person, index) => {
            const personElement = document.createElement('div');
            personElement.className = 'flex items-center justify-between bg-white p-2 mb-2 rounded';
            personElement.innerHTML = `
                <span>${person.name} (${person.team})</span>
                <div>
                    <button class="set-person-date btn btn-small btn-primary mr-2" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button class="edit-person btn btn-small btn-secondary mr-2" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button class="delete-person btn btn-small btn-danger" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
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

    function populateTeamSelect(selectElement) {
        selectElement.innerHTML = '<option value="">Select a team</option>';
        teams.forEach((team) => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            selectElement.appendChild(option);
        });
    }

    function addPerson() {
        const name = personNameInput.value.trim();
        const selectedTeam = teamSelect.value;

        if (!name || !selectedTeam) {
            alert('Please enter a name and select a team');
            return;
        }

        const newPerson = { 
            id: Date.now().toString(), 
            name, 
            team: selectedTeam 
        };
        people.push(newPerson);

        savePeople();
        renderPeople();
        personNameInput.value = '';
        teamSelect.value = '';
    }

    function showEditPersonPage(index) {
        const person = people[index];
        const editPage = editPersonTemplate.content.cloneNode(true);
        
        const nameInput = editPage.querySelector('#editPersonName');
        const teamSelect = editPage.querySelector('#editPersonTeam');
        const form = editPage.querySelector('#editPersonForm');
        
        nameInput.value = person.name;
        populateTeamSelect(teamSelect);
        teamSelect.value = person.team;
        
        form.dataset.personIndex = index;
        
        document.body.innerHTML = '';
        document.body.appendChild(editPage);
    }

    function saveEditedPerson(event) {
        event.preventDefault();
        const form = event.target;
        const index = parseInt(form.dataset.personIndex);
        const nameInput = form.querySelector('#editPersonName');
        const teamSelect = form.querySelector('#editPersonTeam');
        
        const name = nameInput.value.trim();
        const selectedTeam = teamSelect.value;

        if (!name || !selectedTeam) {
            alert('Please enter a name and select a team');
            return;
        }

        people[index].name = name;
        people[index].team = selectedTeam;

        savePeople();
        window.location.reload();
    }

    backButton.addEventListener('click', function() {
        window.location.href = 'popup.html';
    });

    addPersonButton.addEventListener('click', addPerson);

    populateTeamSelect(teamSelect);

    peopleList.addEventListener('click', function(e) {
        if (e.target.classList.contains('set-person-date')) {
            const index = e.target.dataset.index;
            window.location.href = `set_date.html?index=${index}`;
        } else if (e.target.classList.contains('edit-person')) {
            const index = e.target.dataset.index;
            showEditPersonPage(index);
        } else if (e.target.classList.contains('delete-person')) {
            const index = e.target.dataset.index;
            if (confirm('Are you sure you want to delete this person?')) {
                people.splice(index, 1);
                savePeople();
                renderPeople();
            }
        }
    });

    document.addEventListener('submit', function(e) {
        if (e.target.id === 'editPersonForm') {
            saveEditedPerson(e);
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.id === 'cancelEditPerson') {
            window.location.reload();
        }
    });

    renderPeople();
});
