document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const reasonsList = document.getElementById('reasonsList');
    const addReasonButton = document.getElementById('addReasonButton');
    const reasonInput = document.getElementById('reasonInput');

    let reasons = JSON.parse(localStorage.getItem('reasons')) || [];

    function renderReasons() {
        reasonsList.innerHTML = '';
        reasons.forEach((reason, index) => {
            const reasonElement = document.createElement('div');
            reasonElement.className = 'flex items-center justify-between bg-white p-2 mb-2 rounded';
            reasonElement.innerHTML = `
                <span>${reason}</span>
                <button class="delete-reason btn btn-small btn-danger" data-index="${index}">Delete</button>
            `;
            reasonsList.appendChild(reasonElement);
        });
    }

    function saveReasons() {
        localStorage.setItem('reasons', JSON.stringify(reasons));
    }

    function formatReason(reason) {
        return reason.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    backButton.addEventListener('click', function() {
        window.location.href = 'popup.html';
    });

    addReasonButton.addEventListener('click', function() {
        const newReason = formatReason(reasonInput.value.trim());
        if (newReason && !reasons.includes(newReason)) {
            reasons.push(newReason);
            saveReasons();
            renderReasons();
            reasonInput.value = '';
        } else if (reasons.includes(newReason)) {
            alert('This reason already exists.');
        } else {
            alert('Please enter a valid reason.');
        }
    });

    reasonsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-reason')) {
            const index = e.target.dataset.index;
            if (confirm('Are you sure you want to delete this reason?')) {
                reasons.splice(index, 1);
                saveReasons();
                renderReasons();
            }
        }
    });

    renderReasons();
});
