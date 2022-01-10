class Player {
    constructor({ player, name, hp, img, weapon, action }) {
        this.player = player;
        this.name = name;
        this.hp = hp;
        this.img = img;
        this.weapon = weapon;
        this.action = action;
    }

    attack = () => {
        console.log(`${this.name} Fight...`);
    }

    changeHP = (delta) => {
        const { player, hp } = this;
        console.log(`player${player}.hp -= ${delta} ===> ${hp - delta}`);
        this.hp = (hp - delta) < 0 ? 0 : hp - delta;
    }

    elHP = () => {
        return document.querySelector(`.player${this.player} .life`);
    }

    renderHP = ($elementHP) => {
        $elementHP.style.width = `${this.hp}%`;
    }

    elHPPercent = () => { // для отображения процента HP цифрами
        return document.querySelector(`.player${this.player} .percent`);
    }

    renderHPPercent = ($elementHPPercent) => { // для отображения процента HP цифрами
        $elementHPPercent.textContent = `${this.hp}%`;
    }
}

export { Player };