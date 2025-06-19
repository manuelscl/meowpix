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