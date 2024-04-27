const inventory = document.body.querySelector('.inventory');
const garden_bed = document.body.querySelector('.garden_bed');
let timers = [];

// Открываем инвентарь
const btnTools = document.body.querySelector('.btn__tools');
btnTools.addEventListener('click', (e) => {
    e.target.nextElementSibling.classList.toggle('active');
});

// Вешаем слушатель для отслеживания события перемещения семечки
inventory.addEventListener('dragstart', drag);

// Проверяем семечку, что это картинка и берем ее имя из data-name
function drag(e) {
    let elem = e.target;
    if (elem.tagName === 'IMG') {
        let name = elem.dataset.name;
        if (elem.closest('.seeds__item')) {
            let time = elem.dataset.time;
            e.dataTransfer.setData('name', name);
            e.dataTransfer.setData('time', time);
        }
        if (elem.closest('.tools__item')) {
            e.dataTransfer.setData('name', name);
        }
    }
}

garden_bed.addEventListener('dragover', (e) => e.preventDefault());
// Слушаем событие посдки семечки в грядку
garden_bed.addEventListener('drop', drop);

// Проверяем событие что перетаскиваем и куда
function drop(e) {
    let name = e.dataTransfer.getData('name');
    // Что происходит если лунка пустая
    if (e.target.classList.contains('hole')) {
        if (name !== 'wateringСan' && name !== 'pruningShears') {
            let img = document.createElement('img');
            let time = Number(e.dataTransfer.getData('time'));
            let timer = e.target.parentElement;
            img.src = './images/sprout.svg';
            img.alt = 'sprout';
            e.target.appendChild(img);
            start_timer(time, timer, img, name);
        }
        // Что происходит если поливаем росток в лунке
    } else if (e.target.alt === 'sprout' && name === 'wateringСan') {
        let { timerID, flower_name } = timers.find((el) => el.img === e.target);
        let timer = e.target.closest('.timer');
        timer.style = `background: conic-gradient( #684a13cb 360deg, yellowgreen 0deg)`;
        e.target.src = `./images/${flower_name}.svg`;
        e.target.alt = flower_name;
        e.target.ondragstart = function () {
            return false;
        };
        clearInterval(timerID);
        timers = timers.filter((el) => el.timerID !== timerID);
        // Что происходит если срезаем цветок в лунке
    } else if (e.target.tagName === 'IMG' && e.target.alt !== 'sprout' && name === 'pruningShears') {
        console.log(e.target);
        e.target.remove();
    }
}

// Сам таймер роста цветка
function start_timer(time, timer, img, flower_name) {
    let deg_per_second = time_to_deg(time);
    let deg = 0;

    let timerID = setInterval(() => {
        if (deg + deg_per_second < 360) {
            deg += deg_per_second;
            timer.style = `background: conic-gradient( #684a13cb ${deg}deg, yellowgreen 0deg)`;
        } else {
            timer.style = `background: conic-gradient( #684a13cb 360deg, yellowgreen 0deg)`;
            img.src = `./images/${flower_name}.svg`;
            img.alt = flower_name;
            img.ondragstart = function () {
                return false;
            };
            clearInterval(timerID);
            timers = timers.filter((el) => el.timerID !== timerID);
        }
    }, 100);
    timers.push({ timerID, img, flower_name });
}

function time_to_deg(time) {
    let time_percent = 100 / time;
    let deg_per_second = (360 * time_percent) / 100;
    return deg_per_second;
}

// Срезаем цветочки
const pruningShears = document.body.querySelector('.pruning_shears');
pruningShears.addEventListener('click', () => {
    let flowers = document.querySelectorAll('.hole');
    flowers.forEach((el) => {
        if (el.firstElementChild?.alt !== 'sprout') el.innerHTML = '';
    });
});
