import { API_KEY } from './config.example.js';

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

function createImageGallery(catsArray, idContainer, galleryType) {
    const galleryContainer = document.getElementById(idContainer);

    catsArray.forEach(cat => {
        const imageCard = document.createElement('div');
        const catImg = document.createElement('img');

        imageCard.classList.add('image-card');
        catImg.classList.add('cat-img');
        catImg.src = cat.url;
        catImg.alt = cat.title;

        imageCard.appendChild(catImg);

        const likeBtn = document.createElement('button');
        const likeIcon = document.createElement('i');
        likeBtn.classList.add('like-button');
        likeBtn.setAttribute('aria-label', 'toggle-like');
        likeIcon.classList.add('bx', 'bx-heart');
        likeBtn.appendChild(likeIcon);
        imageCard.appendChild(likeBtn);
        galleryContainer.appendChild(imageCard);

        if (idContainer == 'favorites-gallery') {
            likeIcon.style.color = '#F93B3B';
            likeIcon.classList.remove('bx-heart');
            likeIcon.classList.add('bxs-heart');
        } else {
            likeIcon.classList.remove('bxs-heart');
            likeIcon.classList.add('bx-heart');
            likeIcon.style.color = '#4b4b4b';
        }

        likeBtn.addEventListener('click', async () => {
            if (likeIcon.classList.contains('bxs-heart')) {
                likeIcon.classList.remove('bxs-heart');
                likeIcon.classList.add('bx-heart');
                likeIcon.style.color = '#4b4b4b';
                if (galleryType !== 'random') {
                    await deleteFromFavorites(cat.favoriteId);
                }
            } else {
                likeIcon.style.color = '#F93B3B';
                likeIcon.classList.remove('bx-heart');
                likeIcon.classList.add('bxs-heart');
                await saveToFavorites(cat.id);
            }
        });

        if (galleryType === 'myuploads') {
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn-delete-image');
            deleteBtn.setAttribute('aria-label', 'delete-upload');
            deleteBtn.innerHTML = '&times;';
            imageCard.appendChild(deleteBtn);
        }
    });
}

function normalizeCatData(rawCatData, dataType) {
    const normalized = {
        id: null,
        url: null,
        favoriteId: null,
        title: 'cat'
    };

    if (dataType === 'random') {
        normalized.id = rawCatData.id;
        normalized.url = rawCatData.url;
    } else if (dataType === 'favorite') {
        normalized.id = rawCatData.image_id || rawCatData.image.id;
        normalized.url = rawCatData.image.url;
        normalized.favoriteId = rawCatData.id;
    } else if (dataType === 'upload') {
        normalized.id = rawCatData.id;
        normalized.url = rawCatData.url;
        normalized.title = rawCatData.original_filename || `My upload ${rawCatData.id}`;
    }

    if (!normalized.url) {
        console.warn(`Missing URL for data type: ${dataType}`, rawCatData);
        normalized.url = 'https://via.placeholder.com/150?text=No+Image';
    }

    return normalized;
}

function removeCards(container) {
    const existingImageCards = container.querySelectorAll('.image-card');
    existingImageCards.forEach(card => {
        card.remove();
    });
}

async function loadRandomCats() {
    const res = await fetch(API_URL_RANDOM);
    const randomCats = await res.json();
    const normalizedData = randomCats.map(cat => normalizeCatData(cat, 'random'));
    const catsToDisplay = normalizedData.slice(0, 2);
    const galleryGrid = document.getElementById('random-cats');

    if (res.status !== 200) {
        console.log('Oops, something went wrong:', res.status);
    } else {
        const uploadBox = document.querySelector('.upload-box');
        removeCards(galleryGrid);
        createImageGallery(catsToDisplay, 'random-cats', 'random');

        if (uploadBox) {
            galleryGrid.insertAdjacentElement('beforeend', uploadBox);
        }
    }
}

async function loadFavoriteCats() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY,
        },
    });
    const galleryContainer = document.getElementById('favorites-gallery');
    const favoriteCats = await res.json();
    const normalizedData = favoriteCats.map(cat => normalizeCatData(cat, 'favorite'));

    if (res.status !== 200) {
        console.log('There was an error');
    } else {
        removeCards(galleryContainer);
        createImageGallery(normalizedData, 'favorites-gallery', 'favorites');
    }
}

async function saveToFavorites(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
        body: JSON.stringify({
            image_id: id,
        }),
    });

    // const data = await res.json();

    if (res.status !== 200) {
        console.log('Oops! Something went wrong. Please try againr');
    } else {
        loadFavoriteCats();
    }
}

async function deleteFromFavorites(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_KEY,
        }
    });
    if (res.status !== 200) {
        console.log('There was an error');
    } else {
        loadFavoriteCats();
    }
}

function setupTabNavigation() {
    const contentPanels = document.querySelectorAll('.tab-panel');
    const tabs = document.querySelectorAll('.tab-button');
    const tabIndicator = document.querySelector('.tab-indicator');
    const initialActiveTab = document.querySelector('.tab-button.active');
    if (initialActiveTab) {
        tabIndicator.style.width = initialActiveTab.offsetWidth + 'px';
        tabIndicator.style.left = initialActiveTab.offsetLeft + 'px';
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            contentPanels.forEach(panel => panel.classList.remove('active'));

            tab.classList.add('active');
            contentPanels[index].classList.add('active');

            tabIndicator.style.width = e.target.offsetWidth + 'px';
            tabIndicator.style.left = e.target.offsetLeft + 'px';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    loadRandomCats();
    loadFavoriteCats();
})