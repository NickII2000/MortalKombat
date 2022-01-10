import { Player } from './player.js';

class Game {

    $divArenas = document.querySelector(".arenas");
    $formFight = document.querySelector('.control');
    $chat = document.querySelector('.chat');

    HIT = {
        head: 30,
        body: 25,
        foot: 20,
    };

    ATTACK = ['head', 'body', 'foot'];

    start = async () => {

        const p1 = JSON.parse(localStorage.getItem('player1'));

        const p2 = await this.getPlayerFromComputer();

        const player1 = new Player({
            ...p1,
            player: 1,
            weapon: [],
            action: {},
        });

        const player2 = new Player({
            ...p2,
            player: 2,
            weapon: [],
            action: {},
        });

        this.$divArenas.append(this.createPlayer(player1));
        this.$divArenas.append(this.createPlayer(player2));

        this.zeroStepGame(player1, player2);

        this.$formFight.addEventListener('submit', (event) => {
            event.preventDefault();
            this.nextStepGame(player1, player2);
        });
    }

    getPlayers = async () => {
        return fetch('https://reactmarathon-api.herokuapp.com/api/mk/players', { method: 'GET' }).then(responce => responce.json());
    }

    getPlayerFromComputer = async () => {
        return fetch('https://reactmarathon-api.herokuapp.com/api/mk/player/choose', { method: 'GET' }).then(responce => responce.json());
    }

    zeroStepGame = (player1, player2) => {
        this.generateLogs('start', player1, player2);

        player1.attack();
        player2.attack();
    }

    nextStepGame = async (player1, player2) => {
        const actions = await this.getPlayersAction();

        player1.action = actions.player1;
        player2.action = actions.player2;

        console.log('####: player1.action ', player1.action);
        console.log('####: player2.action ', player2.action);

        this.HPAfterAction(player1, player2);
        this.HPAfterAction(player2, player1);

        this.showResult(player1, player2);
    }

    heroAttack = () => {
        let value, hit, defence;
        for (let item of this.$formFight) {
            if (item.checked && item.name === 'hit') {
                hit = item.value;
            }
            if (item.checked && item.name === 'defence') {
                defence = item.value;
            }
            item.checked = false;
        }

        return {
            hit,
            defence,
        }
    }

    getPlayersAction = async ({ hit, defence } = this.heroAttack()) => {
        return await fetch('http://reactmarathon-api.herokuapp.com/api/mk/player/fight', {
            method: 'POST',
            body: JSON.stringify({
                hit,
                defence,
            })
        }).then(responce => responce.json());
    }

    createPlayer = ({ player, name, hp, img }) => {
        const $player = this.createElement("div", `player${player}`);
        const $progressbar = this.createElement("div", "progressbar");
        const $life = this.createElement("div", "life");
        const $name = this.createElement("div", "name");
        const $character = this.createElement("div", "character");
        const $img = this.createElement("img");

        $name.textContent = name;
        $life.style.width = `${hp}%`;
        $name.insertAdjacentHTML('beforeend', `<div class = "${$name.className} percent" style="top: 48px; color: #efef00;">${hp}%</div>`); // для отображения процента HP цифрами
        $name.insertAdjacentHTML('beforeend', `<div class = "${$name.className}" style="top: -48px; color: #efef00;">${player === 1 ? 'hero' : 'enemy'}</div > `); // для отображения типа игрока (hero/ enemy)

        $img.src = img;

        $player.append($progressbar);
        $progressbar.append($life);
        $progressbar.append($name);
        $player.append($character);
        $character.append($img);

        return $player;
    }

    generateLogs = (type, { name: name1, action: { value: value1 = 0 } = {} } = {}, { name: name2, hp: hp2 } = {}) => {

        const logs = {
            start: 'Часы показывали [time], когда [player1] и [player2] бросили вызов друг другу.',
            end: [
                'Результат удара [playerWins]: [playerLose] - труп.',
                '[playerLose] погиб от удара бойца [playerWins].',
                'Результат боя: [playerLose] - жертва, [playerWins] - убийца.',
            ],
            hit: [
                '[playerDefence] пытался сконцентрироваться, но [playerKick] разбежавшись раздробил копчиком левое ухо врага.',
                '[playerDefence] расстроился, как вдруг, неожиданно [playerKick] случайно раздробил грудью грудину противника.',
                '[playerDefence] зажмурился, а в это время [playerKick], прослезившись, раздробил кулаком пах оппонента.',
                '[playerDefence] чесал <вырезано цензурой>, и внезапно неустрашимый [playerKick] отчаянно размозжил грудью левый бицепс оппонента.',
                '[playerDefence] задумался, но внезапно [playerKick] случайно влепил грубый удар копчиком в пояс оппонента.',
                '[playerDefence] ковырялся в зубах, но [playerKick] проснувшись влепил тяжелый удар пальцем в кадык врага.',
                '[playerDefence] вспомнил что-то важное, но внезапно [playerKick] зевнув, размозжил открытой ладонью челюсть противника.',
                '[playerDefence] осмотрелся, и в это время [playerKick] мимоходом раздробил стопой аппендикс соперника.',
                '[playerDefence] кашлянул, но внезапно [playerKick] показав палец, размозжил пальцем грудь соперника.',
                '[playerDefence] пытался что-то сказать, а жестокий [playerKick] проснувшись размозжил копчиком левую ногу противника.',
                '[playerDefence] забылся, как внезапно безумный [playerKick] со скуки, влепил удар коленом в левый бок соперника.',
                '[playerDefence] поперхнулся, а за это [playerKick] мимоходом раздробил коленом висок врага.',
                '[playerDefence] расстроился, а в это время наглый [playerKick] пошатнувшись размозжил копчиком губы оппонента.',
                '[playerDefence] осмотрелся, но внезапно [playerKick] робко размозжил коленом левый глаз противника.',
                '[playerDefence] осмотрелся, а [playerKick] вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента.',
                '[playerDefence] ковырялся в зубах, как вдруг, неожиданно [playerKick] отчаянно размозжил плечом мышцы пресса оппонента.',
                '[playerDefence] пришел в себя, и в это время [playerKick] провел разбивающий удар кистью руки, пробив блок, в голень противника.',
                '[playerDefence] пошатнулся, а в это время [playerKick] хихикая влепил грубый удар открытой ладонью по бедрам врага.',
            ],
            defence: [
                '[playerKick] потерял момент и храбрый [playerDefence] отпрыгнул от удара открытой ладонью в ключицу.',
                '[playerKick] не контролировал ситуацию, и потому [playerDefence] поставил блок на удар пяткой в правую грудь.',
                '[playerKick] потерял момент и [playerDefence] поставил блок на удар коленом по селезенке.',
                '[playerKick] поскользнулся и задумчивый [playerDefence] поставил блок на тычок головой в бровь.',
                '[playerKick] старался провести удар, но непобедимый [playerDefence] ушел в сторону от удара копчиком прямо в пятку.',
                '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.',
                '[playerKick] не думал о бое, потому расстроенный [playerDefence] отпрыгнул от удара кулаком куда обычно не бьют.',
                '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.'
            ],
            draw: 'Ничья - это тоже победа!'
        };
        const textsOfType = logs[type];
        let text;

        switch (type) {
            case 'start':
                text = textsOfType.replace('[time]', this.currentTime()).replace('[player1]', name1).replace('[player2]', name2);
                break;
            case 'end':
                text = textsOfType[this.getRandom(0, textsOfType.length - 1)].replace('[playerWins]', name1).replace('[playerLose]', name2);
                break;
            case 'hit':
                text = textsOfType[this.getRandom(0, textsOfType.length - 1)].replace('[playerKick]', name1).replace('[playerDefence]', name2);
                text = `${this.currentTime()} - ${text} -${value1} [${hp2} / 100]`;
                break;
            case 'defence':
                text = textsOfType[this.getRandom(0, textsOfType.length - 1)].replace('[playerDefence]', name1).replace('[playerKick]', name2);
                text = `${this.currentTime()} - ${text} `;
                break;
            case 'draw':
                text = textsOfType;
                break;
            default:
                text = 'Неизвестный тип события';
                break;
        }

        const element = `<p>${text}</p>`;
        this.$chat.insertAdjacentHTML('afterbegin', element);
    }

    HPAfterAction = (plr1, plr2) => {
        if (plr1.action.defence != plr2.action.hit) {
            plr1.changeHP(plr2.action.value);
            plr1.renderHP(plr1.elHP());
            plr1.renderHPPercent(plr1.elHPPercent()); // для отображения процента HP цифрами 
            this.generateLogs('hit', plr2, plr1);
        } else {
            this.generateLogs('defence', plr1, plr2);
        }
    }

    showResult = (player1, player2) => {

        const { name: name1, hp: hp1 } = player1;
        const { name: name2, hp: hp2 } = player2;

        if (hp1 === 0 || hp2 === 0) {

            this.hideBlock(this.$formFight);
            this.createReloadButton();

            if (hp1 === 0 && hp2 === 0) {
                this.$divArenas.append(this.showResultText());
                this.generateLogs('draw');
            } else if (hp1 === 0 && hp1 < hp2) {
                this.$divArenas.append(this.showResultText(name2));
                this.generateLogs('end', player2, player1);
            } else if (hp2 === 0 && hp2 < hp1) {
                this.$divArenas.append(this.showResultText(name1));
                this.generateLogs('end', player1, player2);
            }

        }
    }

    createReloadButton = () => {
        const $divReloadButton = this.createElement("div", "reloadWrap");
        const $reloadButton = this.createElement("button", "button");
        $reloadButton.textContent = "Restart";

        $reloadButton.addEventListener('click', function () {
            window.location.pathname = 'index.html';
        });

        $divReloadButton.append($reloadButton);
        this.$divArenas.append($divReloadButton);
    }

    showResultText = (name) => {
        const $winTitle = this.createElement('div', 'loseTitle');
        if (name) {
            $winTitle.textContent = `${name} wins`;
        } else {
            $winTitle.textContent = `Draw`;
        }

        return $winTitle;
    }

    createElement = (tag, className) => {
        const $tag = document.createElement(tag);
        if (className) {
            $tag.classList.add(className);
        }
        return $tag;
    }

    getRandom = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

    currentTime = () => {
        const date = new Date();
        const normalize = (num) => { return num.toString().length > 1 ? num : `0${num}`; };
        return `${normalize(date.getHours())}:${normalize(date.getMinutes())}:${normalize(date.getSeconds())}`;
    }

    hideBlock = ($block) => $block.style.display = 'none';
}

export { Game };