document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const teamsList = document.getElementById('teamsList');
    const addTeamButton = document.getElementById('addTeamButton');

    let teams = JSON.parse(localStorage.getItem('teams')) || [];

    function renderTeams() {
        teamsList.innerHTML = '';
        teams.forEach((team, index) => {
            const teamElement = document.createElement('div');
            teamElement.className = 'flex items-center justify-between bg-white p-2 mb-2 rounded';
            teamElement.innerHTML = `
                <span>${team}</span>
                <div>
                    <button class="edit-team btn btn-small btn-secondary mr-2" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button class="delete-team btn btn-small btn-danger" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            `;
            teamsList.appendChild(teamElement);
        });
    }

    function saveTeams() {
        localStorage.setItem('teams', JSON.stringify(teams));
    }

    backButton.addEventListener('click', function() {
        window.location.href = 'popup.html';
    });

    addTeamButton.addEventListener('click', function() {
        const teamName = prompt('Enter new team name:');
        if (teamName) {
            teams.push(teamName);
            saveTeams();
            renderTeams();
        }
    });

    teamsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-team')) {
            const index = e.target.dataset.index;
            const newName = prompt('Enter new team name:', teams[index]);
            if (newName) {
                teams[index] = newName;
                saveTeams();
                renderTeams();
            }
        } else if (e.target.classList.contains('delete-team')) {
            const index = e.target.dataset.index;
            if (confirm('Are you sure you want to delete this team?')) {
                teams.splice(index, 1);
                saveTeams();
                renderTeams();
            }
        }
    });

    renderTeams();
});
