const form = document.getElementById('search-form');
const input = document.getElementById('word-input');
const resultsContainer = document.getElementById('results-container');

const API_URL_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = input.value.trim();

    if (!word) {
        resultsContainer.innerHTML = '<p class ="error">Please enter a word to search.</p>'; 
        return;
    }

    resultsContainer.innerHTML = '<p class="loading-message">Searching...</p>';

    try {
        const response = await fetch('${API_URL_BASE}${word}');

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.title || 'Word not found. Check your spelling and try again.';
            resultsContainer.innerHTML = '<p class="error">${errorMessage}</p>';
            return;
        }

        const data = await response.json();
        const wordData = data[0];

    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = '<p class="error">A network error occurred. Please try again later.</p>';
    }
});

function renderResults(data){
    let html = '<h2 class="word-title">${data.word}</h2>';

    const phonetics = data.phonetics.find(p => p.text) || data.phonetics[0] || {};
    if (phonetics) {
        html += '<p class="phonetics">Phonetics: ${phonetics.text}</p>';
    }

    data.meanings.forEach(meaning => {
        html += '<div class="meaning-section">'
        html += '<h3 class="part-of-speech">${meaning.partOfSpeech}</h3>';
        html += '<ol class="definitions-list">';

        meaning.definitions.forEach((def, index) => {
            if (index > 3) {
                html += '<li>${def.definition}</li>';
            }
        });

        html += '</ol></div>';
    });

    resultsContainer.innerHTML = html;
}
