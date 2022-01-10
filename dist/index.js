const $parent = document.querySelector('.parent');
const $player = document.querySelector('.player');

const createElement = (tag, className) => {
    const $tag = document.createElement(tag);

    if (className) {
        if (Array.isArray(className)) {
            className.forEach(item => {
                $tag.classList.add(item);
            })
        } else {
            $tag.classList.add(className);
        }
    }

    return $tag;
}

function createEmptyPlayerBlock() {
    const el = createElement('div', ['character', 'div11', 'disabled']);
    const img = createElement('img');
    img.src = 'http://reactmarathon-api.herokuapp.com/assets/mk/avatar/11.png';
    el.append(img);
    $parent.append(el);
}

async function init() {
    localStorage.removeItem('player1');

    const players = await fetch('https://reactmarathon-api.herokuapp.com/api/mk/players').then(res => res.json());

    let imgSrc = null;
    createEmptyPlayerBlock();

    players.forEach(item => {
        const el = createElement('div', ['character', `div${item.id}`]);
        const img = createElement('img');

        el.addEventListener('mousemove', () => {
            if (imgSrc === null) {
                imgSrc = item.img;

                const $name = createElement('div', 'name');
                $name.innerHTML = `${item.name}<br />`;
                const $img = createElement('img');
                $img.src = imgSrc;
                $player.append($name);
                $player.append($img);
            }
        });

        el.addEventListener('mouseout', () => {
            if (imgSrc) {
                imgSrc = null;
                $player.innerHTML = '';
            }
        });

        el.addEventListener('click', () => {
            imgSrc = undefined;
            localStorage.setItem('player1', JSON.stringify(item));
            el.classList.add('active');
            setTimeout(() => {
                window.location.pathname = 'arenas.html';
            }, 1000);
        });

        img.src = item.avatar;
        img.alt = item.name;

        el.append(img);
        $parent.append(el);
    });
}

init();