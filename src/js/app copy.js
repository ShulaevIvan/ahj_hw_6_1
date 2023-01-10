class Popup {
    constructor(popupTag) {
        this.popup = document.querySelector(popupTag);
        this.closeBtn = this.popup.querySelector('.close-btn');
        this.addBtn = this.popup.querySelector('.card-btn');
        this.taskContentTag = this.popup.querySelector('.task-content');
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.card = undefined;
        this.allCards = [];

        this.closeBtn.addEventListener('click', (e) => {
            console.log(this.allCards);
            e.preventDefault();
            this.hide();
        });

        this.addBtn.addEventListener('click', (e) => {
           this.taskContent = this.taskContentTag.value
           this.card = new Card(this.taskContent);
           const card = this.card.create();
           this.allCards.push(card);
           this.hide();
        });
    }

    show() {
        this.taskContentTag.value = '';
        this.popup.classList.remove('popup_hidden');
    }

    hide() {
        this.popup.classList.add('popup_hidden');
    }
}

class Card {
    constructor(content) {
        this.content = content;
    }

    create() {
        const cardWrap = document.createElement('div');
        const cardContent = document.createElement('span');
        const closeBtn = document.createElement('span');
        const column = document.querySelector('.column-todo');

        cardWrap.classList.add('card');
        cardContent.classList.add('card-content');
        closeBtn.classList.add('rm-card');

        cardContent.textContent = this.content;
        cardWrap.appendChild(cardContent);
        cardWrap.appendChild(closeBtn);
        column.appendChild(cardWrap);

        const retObj = {
            id: performance.now(),
            tag: cardWrap
        }

        return retObj
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.app-container');
    const toDoColumn = mainContainer.querySelector('.column-todo');
    const progressColumn = mainContainer.querySelector('.column-progress');
    const doneColumn = mainContainer.querySelector('.column-done');
    const addCardBtn = document.querySelector('.add-card');

    addCardBtn.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-card')) {
            const popup = new Popup('#popup');
            popup.show();
        }
    });


})