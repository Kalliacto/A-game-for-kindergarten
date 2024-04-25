const seedsList = document.body.querySelector('.seeds__list');
const garden_bed = document.body.querySelector('.garden_bed');

// Вешаем слушатель для отслеживания события перемещения семечки
seedsList.addEventListener('drag', drag);

// Проверяем семечку, что это картинка и берем ее имя из data-name
function drag(e) {
    e.preventDefault();
    let elem = e.target;
    if (elem.tagName === 'IMG') {
        let name = elem.dataset.name;
        e.dataTransfer.setData('text/plain', name);
    }
}

garden_bed.addEventListener('dragover', (e) => e.preventDefault());
// Слушаем событие посдки семечки в грядку
garden_bed.addEventListener('drop', drop);

function drop(e) {
    e.preventDefault();
    if (e.target.classList.contains('hole')) {
        let img = document.createElement('img');
        let flower_name = e.dataTransfer.getData('text/plain');
        img.src = './images/sprout.svg';
        e.target.appendChild(img);
        flower_growth(img, flower_name);
    }
}

function flower_growth(img, flower_name) {
    setTimeout(() => {
        img.src = flower_name;
    }, 5000);
}

// Срезаем цветочки
const pruningShears = document.body.querySelector('.pruning_shears');
pruningShears.addEventListener('click', () => {
    let flowers = document.querySelectorAll('.hole');
    flowers.forEach((el) => (el.innerHTML = ''));
});
