document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    const personInfo = document.getElementById('personInfo');
    const dateForm = document.getElementById('dateForm');

    const urlParams = new URLSearchParams(window.location.search);
    const personIndex = urlParams.get('index');

    let people = JSON.parse(localStorage.getItem('people')) || [];
    let reasons = JSON.parse(localStorage.getItem('reasons')) || [];
    const person = people[personIndex];

    if (!person) {
        alert('Person not found');
        window.location.href = 'people.html';
        return;
    }

    personInfo.textContent = `Setting date for: ${person.name} (${person.team})`;

    backButton.addEventListener('click', function() {
        window.location.href = 'people.html';
    });

    dateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const reason = document.getElementById('reason').value.trim();

        if (!reason) {
            alert('Please enter a reason');
            return;
        }

        person.startDate = startDate;
        person.endDate = endDate || null;
        person.reason = reason;

        if (!reasons.includes(reason)) {
            reasons.push(reason);
            localStorage.setItem('reasons', JSON.stringify(reasons));
        }

        localStorage.setItem('people', JSON.stringify(people));

        alert('Date and reason saved successfully');
        window.location.href = 'people.html';
    });

    // Pre-fill form if dates are already set
    if (person.startDate) {
        document.getElementById('startDate').value = person.startDate;
    }
    if (person.endDate) {
        document.getElementById('endDate').value = person.endDate;
    }
    if (person.reason) {
        document.getElementById('reason').value = person.reason;
    }

    // Set end date to same month and year as start date
    document.getElementById('startDate').addEventListener('change', function() {
        const startDate = new Date(this.value);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    });

    // Autocomplete for reasons
    const reasonInput = document.getElementById('reason');
    reasonInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const matchingReasons = reasons.filter(r => r.toLowerCase().startsWith(value));
        
        // Create and show datalist
        let datalist = document.getElementById('reasonSuggestions');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'reasonSuggestions';
            this.parentNode.appendChild(datalist);
        }
        datalist.innerHTML = matchingReasons.map(r => `<option value="${r}">`).join('');
        this.setAttribute('list', 'reasonSuggestions');
    });
});
