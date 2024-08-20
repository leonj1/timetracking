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
                    <button class="edit-team btn btn-small btn-secondary mr-2" data-index="${index}">Edit</button>
                    <button class="delete-team btn btn-small btn-danger" data-index="${index}">Delete</button>
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
