let currentAudio = null;
let currentPlayBtn = null;

// load data for each html page
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const songPage = urlParams.get('songPage');
    fetch('songs.json')
        .then(response => response.json())
        .then(songs => {
            const song = songs.find(s => s.pagename === songPage);
            if (song) {
                document.getElementById('song-name').textContent = song.name;
                const songImg = document.getElementById('song-img').src = song.imgSrc;
                songImg.src = song.imgSrc;
                songImg.alt = `${song.name} song download for free`
                document.getElementById('song-audio').src = song.downloadLink;
                document.getElementById('download-link').href = song.downloadLink;
                document.getElementById('download-link').setAttribute('download', song.name);

            }
        })
        .catch(error => console.error('Error fetching song details:', error));
});

function Daynamicheader() {
    // create header
    if (window.location.pathname !== '/index.html') {
        const songpage = document.getElementById('songpage');
        // Create brand
        const brandDiv = document.createElement('div');
        brandDiv.className = 'brand';
        const brandH1 = document.createElement('h1');
        brandH1.textContent = 'मराठीगान'
        brandDiv.appendChild(brandH1);
        songpage.appendChild(brandDiv);
        // Create search bar
        const searchBarDiv = document.createElement('div');
        searchBarDiv.id = 'searchbar';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'searchsongs';
        searchInput.placeholder = 'Search Marathi Songs';

        const searchButton = document.createElement('input');
        searchButton.type = 'button';
        searchButton.value = 'Search';

        searchBarDiv.appendChild(searchInput);
        searchBarDiv.appendChild(searchButton);
        songpage.appendChild(searchBarDiv);

        // Create search results
        const searchResultsUl = document.createElement('ul');
        searchResultsUl.id = 'search-results';
        songpage.appendChild(searchResultsUl);
        // Create home content
        const homeContentDiv = document.createElement('div');
        homeContentDiv.id = 'homeContent';
        const daynamicallycontainer = document.createElement("div");
        daynamicallycontainer.classList = 'container';
        daynamicallycontainer.appendChild(homeContentDiv)
        songpage.appendChild(daynamicallycontainer);
        // breadcrumbs
        const homeLink = document.createElement('a');
        homeLink.href = 'index.html';
        homeLink.classList = 'homeLink';
        homeLink.textContent = 'HOME'
        const breadimg = document.createElement('img');
        breadimg.src = 'icon/fast-forward.png'
        homeLink.appendChild(breadimg)
        breadimg.style.width = '20px'
        songpage.appendChild(homeLink)

        // search songs
        const resultsContainer = document.getElementById('search-results');
        fetch('songs.json')
            .then(response => response.json())
            .then(data => {
                // Function to perform search
                function searchsongs(query) {
                    if (query === '') {
                        return [];
                    } else {
                        const results = data.filter(song =>
                            song.name.toLowerCase().includes(query.toLowerCase())
                        );
                        return results.slice(0, 15);
                    }
                }
                // Function to display search results
                function displayResults(results) {
                    resultsContainer.innerHTML = '';
                    if (results.length === 0) {
                        resultsContainer.style.height = '0px';
                    } else {
                        resultsContainer.style.height = '20%';
                    }
                    results.forEach(song => {
                        const listItem = document.createElement('li');
                        listItem.classList = 'resultitems'
                        listItem.innerHTML = `<img src="${song.imgSrc}" alt="${song.name} song download mp3 image">
                                  <span>${song.name}</span>`;
                        listItem.style.cursor = 'pointer';
                        listItem.style.margin = '10px 15px'
                        resultsContainer.appendChild(listItem);
                        listItem.addEventListener('click', function () {
                            const songPage = song.pagename;
                            window.location.href = `${songPage}.html?songPage=${songPage}`;
                        });

                    });
                }

                // Event listener for input changes
                document.getElementById('searchsongs').addEventListener('input', function () {
                    const query = this.value;
                    const searchResults = searchsongs(query);
                    displayResults(searchResults);
                });
            })
            .catch(error => console.log('Error fetching for Search Allsongs JSON file:', error))
    }
}
// Function to fetch and display songs
async function loadSongs() {

    try {
        // Fetch the JSON data
        const response = await fetch('songs.json');
        const songs = await response.json();

        // Get the container element
        const topSongs = document.getElementById('topSongs');

        // Clear existing content
        topSongs.innerHTML = '';
        let count = 0; // Initialize a counter

        // Loop through the songs and create HTML elements
        songs.forEach((song, index) => {
            const songDiv = document.createElement('div');
            songDiv.className = 'song';
            songDiv.id = 'song'

            const img = document.createElement('img');
            img.className = 'songimg';
            img.src = song.imgSrc;
            img.id = 'songimg'
            img.alt = `${song.name} song download free`
            songDiv.appendChild(img)
            const textCenterDiv = document.createElement('div');
            textCenterDiv.style.width = '220px'
            const nameSpan = document.createElement('span');
            nameSpan.style.fontSize = 'large';
            nameSpan.id = 'name';
            nameSpan.style.fontWeight = 'bold'
            nameSpan.innerHTML = `${song.name}`;
            textCenterDiv.appendChild(nameSpan);
            textCenterDiv.appendChild(document.createElement('br'));

            songDiv.appendChild(textCenterDiv);

            // Create audio element
            const audio = document.createElement('audio');
            audio.src = song.downloadLink;
            audio.id = `audio-${song.name}`;
            songDiv.appendChild(audio);

            // Create play/pause button
            const playBtn = document.createElement('button');
            playBtn.className = 'button';
            playBtn.innerHTML = '<img src="icon/play.png" alt="play song" />';
            playBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                if (audio.paused) {
                    // Pause the current audio if there is one
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentPlayBtn.innerHTML = '<img src="icon/play.png" alt="play song" />';
                    }
                    // Play the new audio and set it as current
                    audio.play();
                    playBtn.innerHTML = '<img src="icon/pause.png" alt="Pause song" />';
                    currentAudio = audio;
                    currentPlayBtn = playBtn;
                } else {
                    audio.pause();
                    playBtn.innerHTML = '<img src="icon/play.png" alt="Play song" />';
                    currentAudio = null;
                    currentPlayBtn = null;
                }
            });

            // When audio ends, play the next song
            audio.addEventListener('ended', () => {
                playBtn.innerHTML = '<img src="icon/play.png" alt="Play song" />';
                currentAudio = null;
                currentPlayBtn = null;

                // Play the next song if available
                const nextSongDiv = topSongs.children[index + 1];
                if (nextSongDiv) {
                    const nextAudio = nextSongDiv.querySelector('audio');
                    const nextPlayBtn = nextSongDiv.querySelector('.button');
                    if (nextAudio && nextPlayBtn) {
                        // Update currentAudio and currentPlayBtn before playing the next song
                        currentAudio = nextAudio;
                        currentPlayBtn = nextPlayBtn;

                        nextAudio.play();
                        nextPlayBtn.innerHTML = '<img src="icon/pause.png" alt="Pause song" />';

                        // Add ended event listener to the next audio element
                        nextAudio.addEventListener('ended', () => {
                            nextPlayBtn.innerHTML = '<img src="icon/play.png" alt="Play song" />';
                            currentAudio = null;
                            currentPlayBtn = null;

                            // Play the next song if available
                            const nextNextSongDiv = topSongs.children[index + 2];
                            if (nextNextSongDiv) {
                                const nextNextAudio = nextNextSongDiv.querySelector('audio');
                                const nextNextPlayBtn = nextNextSongDiv.querySelector('.button');
                                if (nextNextAudio && nextNextPlayBtn) {
                                    currentAudio = nextNextAudio;
                                    currentPlayBtn = nextNextPlayBtn;

                                    nextNextAudio.play();
                                    nextNextPlayBtn.innerHTML = '<img src="icon/pause.png" alt="Pause song" />';
                                }
                            }
                        });
                    }
                }
            });

            document.querySelectorAll('.button').forEach(link => {
                link.addEventListener('click', function (event) {
                    event.stopPropagation();
                });
            });
            const buttons = document.createElement('button');
            buttons.id = 'homebuttons'
            buttons.appendChild(playBtn)
            const playsound = document.createElement('input');
            playsound.type = 'range';
            playsound.style.width = '80%';
            playsound.min = 0;
            playsound.max = 100;
            playsound.value = 0;

            // Update range input as audio plays
            audio.addEventListener('timeupdate', () => {
                playsound.value = (audio.currentTime / audio.duration) * 100;
            });

            // Seek audio when range input changes
            playsound.addEventListener('input', () => {
                audio.currentTime = (playsound.value / 100) * audio.duration;
            });
            playsound.addEventListener('click', (event) => {
                event.stopPropagation(); // Stop propagation
            });
             // Event listener for when audio starts playing
  audio.addEventListener('play', function() {
    playsound.style.background = '#4CAF50'; // Change track background color to green when playing
  });

  // Event listener for when audio is paused or ended
  audio.addEventListener('pause', function() {
    playsound.style.background = '#000'; // Revert track background color to black when paused
  });

  audio.addEventListener('ended', function() {
    playsound.style.background = '#000'; // Revert track background color to black when ended
  });
            buttons.appendChild(playsound);
            songDiv.appendChild(buttons)

            // Make the song element clickable
            songDiv.addEventListener('click', () => {
                const songPage = song.pagename;
                window.location.href = `${songPage}.html?songPage=${songPage}`;
            });
            topSongs.appendChild(songDiv);
            count++; // Increment the counter

            // Check if we've processed 22 items
            if (count === 42) {
                const heading = document.createElement('h1');
                heading.textContent = `Song of Shivaji Maharaj`;
                heading.style.backgroundColor = 'white'
                heading.style.padding = '15px 10px'
                heading.id = 'songsOfShivaji'
                topSongs.appendChild(heading);
            }
            if (count === 52) {
                const heading = document.createElement('h1');
                heading.textContent = `God's song`;
                heading.style.backgroundColor = 'white'
                heading.style.padding = '15px 10px'
                heading.id = 'songsofGods'
                topSongs.appendChild(heading);
            }

        });
    } catch (error) {
        console.error('Error fetching the songs:', error);
    }

    // search songs
    const resultsContainer = document.getElementById('search-results');
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            // Function to perform search
            function searchsongs(query) {
                if (query === '') {
                    return [];
                } else {
                    const results = data.filter(song =>
                        song.name.toLowerCase().includes(query.toLowerCase())
                    );
                    return results.slice(0, 15);
                }
            }
            // Function to display search results
            function displayResults(results) {
                resultsContainer.innerHTML = '';
                if (results.length === 0) {
                    resultsContainer.style.height = '0px';
                } else {
                    resultsContainer.style.height = '20%';
                }
                results.forEach(song => {
                    const listItem = document.createElement('li');
                    listItem.style.listStyle = 'none'
                    listItem.innerHTML = `<img src="${song.imgSrc}" alt="${song.name} song download mp3 image">
                         <span>${song.name}</span>`;
                    listItem.style.cursor = 'pointer';
                    listItem.style.margin = '10px 15px'
                    resultsContainer.appendChild(listItem);
                    listItem.addEventListener('click', function () {
                        const songPage = song.pagename;
                        window.location.href = `${songPage}.html?songPage=${songPage}`;
                    });

                });
            }

            // Event listener for input changes
            document.getElementById('searchsongs').addEventListener('input', function () {
                const query = this.value;
                const searchResults = searchsongs(query);
                displayResults(searchResults);
            });
        })
        .catch(error => console.log('Error fetching for Search Allsongs JSON file:', error))

}


function loadSongPageDetails() {
    // footer
    const footer = document.createElement('footer');
    footer.style.margin = '30px 0 0 0 '
    const footerContent = document.createElement('div');
    footerContent.classList.add('footer-content');

    const footerText = document.createElement('p');
    footerText.textContent = '© 2024 marathigaan.in';

    const nav1 = document.createElement('nav');
    const nav2 = document.createElement('nav');

    const links1 = [
        { href: 'index.html', text: 'Home' },
        { href: 'about.html', text: 'About' },
        { href: 'contact.html', text: 'Contact' }
    ];

    const links2 = [
        { href: 'Privacy-policy.html', text: 'Privacy' },
        { href: 'disclaimer.html', text: 'Disclaimer' },
        { href: 'Terms-condition.html', text: 'Terms' }
    ];

    links1.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        nav1.appendChild(a);
        if (link !== links1[links1.length - 1]) {
            nav1.appendChild(document.createTextNode(' | '));
        }
    });

    links2.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        nav2.appendChild(a);
        if (link !== links2[links2.length - 1]) {
            nav2.appendChild(document.createTextNode(' | '));
        }
    });

    footerContent.appendChild(footerText);
    footerContent.appendChild(nav1);
    footerContent.appendChild(nav2);
    footer.appendChild(footerContent);
    const songcontainer = document.getElementById('song-details')
    songcontainer.appendChild(footer)

}


// Main function to initialize everything
function main() {
    if (document.getElementById('topSongs')) {
        loadSongs();
    }

    if (document.getElementById('song-details')) {
        Daynamicheader();
    }

    if (document.getElementById('song-details')) {
        loadSongPageDetails();
    }
}
// Initialize everything when the DOM content is loaded
document.addEventListener('DOMContentLoaded', main);
