document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('helloButton');
    const message = document.getElementById('message');

    button.addEventListener('click', function() {
        message.textContent = 'Hello!';
        message.classList.remove('hidden');
        setTimeout(() => {
            message.classList.add('hidden');
        }, 2000);
    });
});
