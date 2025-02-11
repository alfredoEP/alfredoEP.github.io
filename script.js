function createSierpinskiTriangle(container, depth) {
    if (depth === 0) return;

    const triangle = document.createElement('div');
    container.appendChild(triangle);

    for (let i = 0; i < 3; i++) {
        const subTriangle = document.createElement('div');
        triangle.appendChild(subTriangle);
        createSierpinskiTriangle(subTriangle, depth - 1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sierpinskiContainer = document.querySelector('.sierpinski');
    createSierpinskiTriangle(sierpinskiContainer, 4);
});
