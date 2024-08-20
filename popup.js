document.addEventListener('DOMContentLoaded', function() {
    const helloButton = document.getElementById('helloButton');
    const manageTeamsButton = document.getElementById('manageTeamsButton');
    const message = document.getElementById('message');

    helloButton.addEventListener('click', function() {
        message.textContent = 'Hello!';
        message.classList.remove('hidden');
        setTimeout(() => {
            message.classList.add('hidden');
        }, 2000);
    });

    manageTeamsButton.addEventListener('click', function() {
        window.location.href = 'teams.html';
    });
});
