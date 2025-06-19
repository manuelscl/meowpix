const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';

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
})