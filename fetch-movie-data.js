/**
 * fetch-movie-data.js
 * 
 * A simple module to fetch movie data from The Movie Database (TMDB) API.
 * Demonstrates best practices for image handling (w500 size) and error handling.
 * 
 * Usage:
 *   1. Get an API key from https://www.themoviedb.org/documentation/api
 *   2. Set the environment variable TMDB_API_KEY
 *   3. Run: node fetch-movie-data.js "Movie Title"
 */

// Node 18+ has built-in fetch, so we don't need 'node-fetch'
// const fetch = require('node-fetch'); 

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Best practice: Use specific sizes appropriate for the display context
// 'w500' is good for detail pages. Use 'w200' or 'w300' for list thumbnails to save bandwidth.
const POSTER_SIZE = 'w500';

async function searchMovie(query) {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        console.error('Error: TMDB_API_KEY environment variable is not set.');
        console.error('Please get a key from https://www.themoviedb.org/ and set it.');
        process.exit(1);
    }

    if (!query) {
        console.error('Error: Please provide a movie title to search for.');
        return;
    }

    try {
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const topResult = data.results[0];

            console.log('--- Movie Found ---');
            console.log(`Title: ${topResult.title}`);
            console.log(`Release Date: ${topResult.release_date}`);
            console.log(`Overview: ${topResult.overview}`);
            console.log(`Rating: ${topResult.vote_average}`);

            if (topResult.poster_path) {
                // Construct the full image URL
                const imageUrl = `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${topResult.poster_path}`;
                console.log(`Poster URL (${POSTER_SIZE}): ${imageUrl}`);

                // Best practice note:
                // You would typically save this URL or use it directly in an <img src="..." loading="lazy" />
            } else {
                console.log('Poster: No poster available.');
            }

        } else {
            console.log(`No movies found matching "${query}".`);
        }

    } catch (error) {
        console.error('Failed to fetch movie data:', error.message);
    }
}

// Allow running directly from command line
if (require.main === module) {
    const args = process.argv.slice(2);
    const movieTitle = args.join(' ');
    searchMovie(movieTitle);
}

module.exports = { searchMovie };
