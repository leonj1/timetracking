document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const reasonsList = document.getElementById('reasonsList');
    const addReasonButton = document.getElementById('addReasonButton');
    const reasonInput = document.getElementById('reasonInput');

    let reasons = JSON.parse(localStorage.getItem('reasons')) || [];

    renderReasons();

    function renderReasons() {
        reasonsList.innerHTML = '';
        reasons.forEach((reason, index) => {
            const reasonElement = document.createElement('div');
            reasonElement.className = 'flex items-center justify-between bg-white p-2 mb-2 rounded';
            reasonElement.innerHTML = `
                <span>${reason}</span>
                <div>
                    <button class="edit-reason btn btn-small btn-secondary mr-2" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button class="delete-reason btn btn-small btn-danger" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
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
        if (e.target.closest('.delete-reason')) {
            const index = e.target.closest('.delete-reason').dataset.index;
            if (confirm('Are you sure you want to delete this reason?')) {
                reasons.splice(index, 1);
                saveReasons();
                renderReasons();
            }
        } else if (e.target.closest('.edit-reason')) {
            const index = e.target.closest('.edit-reason').dataset.index;
            const newReason = prompt('Edit reason:', reasons[index]);
            if (newReason !== null && newReason.trim() !== '') {
                reasons[index] = formatReason(newReason);
                saveReasons();
                renderReasons();
            }
        }
    });

    renderReasons();
});
