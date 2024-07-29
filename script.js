document.getElementById('downloadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const downloadUrl = 'https://youtomp4.onrender.com/formats';
    const loading = document.getElementById('loading');
    const formatsContainer = document.getElementById('formatsContainer');
    const formatsList = document.getElementById('formatsList');
    const errorMessage = document.getElementById('errorMessage');

    loading.classList.remove('hidden');
    formatsContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    formatsList.innerHTML = '';

    fetch(downloadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    })
    .then(response => response.json())
    .then(data => {
        loading.classList.add('hidden');
        if (data.error) {
            errorMessage.textContent = data.error;
            errorMessage.classList.remove('hidden');
            return;
        }

        if (data.formats && data.formats.length > 0) {
            data.formats.forEach(format => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = format.url;
                link.innerText = format.quality;
                link.target = '_blank';
                listItem.appendChild(link);
                formatsList.appendChild(listItem);
            });

            formatsContainer.classList.remove('hidden');
        } else {
            errorMessage.textContent = 'No formats found';
            errorMessage.classList.remove('hidden');
        }
    })
    .catch(error => {
        loading.classList.add('hidden');
        console.error('Error:', error);
        errorMessage.textContent = 'Error fetching formats';
        errorMessage.classList.remove('hidden');
    });
});
