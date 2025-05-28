function setupTabNavigation() {
    const contentPanels = document.querySelectorAll('.tab-panel');
    const tabs = document.querySelectorAll('.tab-button');
    const tabIndicator = document.querySelector('.tab-indicator');

    // Inicializar la posición del indicador si el primer tab está activo al cargar
    // Puedes obtener el primer tab activo y mover el indicador a su posición inicial
    const initialActiveTab = document.querySelector('.tab-button.active');
    if (initialActiveTab) {
        tabIndicator.style.width = initialActiveTab.offsetWidth + 'px';
        tabIndicator.style.left = initialActiveTab.offsetLeft + 'px';
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
            // Remover 'active' de todos los tabs y paneles
            tabs.forEach(t => t.classList.remove('active'));
            contentPanels.forEach(panel => panel.classList.remove('active'));

            // Añadir 'active' al tab clickeado y al panel correspondiente
            tab.classList.add('active');
            contentPanels[index].classList.add('active');

            // Mover el indicador
            tabIndicator.style.width = e.target.offsetWidth + 'px';
            tabIndicator.style.left = e.target.offsetLeft + 'px';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
})