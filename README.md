CineVerse is a modern movie web application built with React, Redux, and Tailwind CSS. It allows users to explore trending movies, search for their favorite titles, view detailed information, and more — all in a responsive and visually appealing interface.

Features:

-> Browse trending and popular movies

-> Search for movies by title

-> View detailed information about each movie

-> Responsive UI using Tailwind CSS

-> State management with Redux

-> Clean and intuitive design

Demo:

-> Live Demo (https://ncs-movie-app.netlify.app/)

Tech Stack:

-> Frontend: React, Redux, React Router, Tailwind CSS

-> State Management: Redux Toolkit

-> API: The Movie Database (TMDB) API

-> Deployment: (Netlify, GitHub Pages)


Getting Started:

Prerequisites-

--> Node.js and npm installed

Installation:

-> git clone https://github.com/yourusername/cineverse.git
-> cd cineverse
-> npm install

Run Locally:

-> npm start

Folder Structure:

MOVIE APP
├──movie-app/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── BannerHome.js
    │   │   ├── Card.js
    │   │   ├── Divider.js
    │   │   ├── Footer.js
    │   │   ├── Header.js
    │   │   ├── HorizontalScrollCard.js
    │   │   ├── MobileNavigation.js
    │   │   └── VideoPlay.js
    │   ├── constants/
    │   │   └── navigation.js
    │   ├── hooks/
    │   │   ├── useFetch.js
    │   │   └── useFetchDetails.js
    │   ├── pages/
    │   │   ├── DetailsPage.js
    │   │   ├── ExplorePage.js
    │   │   ├── Home.js
    │   │   └── SearchPage.js
    │   ├── routes/
    │   │   └── index.js
    │   ├── store/
    │   │   ├── movieSlice.js
    │   │   └── store.js
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── index.css
    │   ├── index.js
    │   ├── reportWebVitals.js
    │   └── setupTests.js
    ├── tailwind.config.js
    ├── package.json
    ├── package-lock.json
    ├── README.md

