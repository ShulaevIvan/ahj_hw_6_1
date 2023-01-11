class Popup {
    constructor(popupTag) {
        this.popup = document.querySelector(popupTag);
        this.closeBtn = this.popup.querySelector('.close-btn');
        this.addBtn = this.popup.querySelector('.card-btn');
        this.taskContentTag = this.popup.querySelector('.task-content');
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.allCards = [];
        this.targetColumn = undefined;
        this.draggedElement = undefined;
        this.draggedElementId = undefined;

        this.createCardEvent = (e) => {
            e.preventDefault();
            this.createCard(this.taskContentTag.value, this.targetColumn);
            this.hide();
        }

        this.removeCardEvent = (e) => {
            e.preventDefault();
            this.removeCard(e.target);
        }

        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.hide();
        });

        this.draggedEvent = (e) => {
            if (e.target.classList.contains('card')) {
                document.body.style.cursor = 'grabbing';
                this.draggedElement = e.target;
                this.draggedElement.style.top = e.y / this.draggedElement.style.height + "px";
                this.draggedElement.style.left = e.x / this.draggedElement.style.width + "px";
                this.draggedElementId = this.draggedElement.getAttribute('cardId');
                this.draggedElement.classList.add('dragged');
                document.documentElement.addEventListener('mousemove', this.onMouseOver);
            }
           
        }

        this.onMouseOver = (e) => {
            if (this.draggedElement != undefined) {
                this.draggedElement.style.top = e.y + "px";
                this.draggedElement.style.left = e.x + "px";
            }
        }

        this.onMouseUp = (e) => {
            if (this.draggedElement != undefined && !e.target.classList.contains('rm-card')) {
                this.allCards.forEach((card) => {
                    if (card.id == this.draggedElement.getAttribute('cardId')) card.column = e.target;
                });
                console.log(e.target)
                e.target.appendChild(this.draggedElement);
                this.draggedElement.style.removeProperty('top');
                this.draggedElement.style.removeProperty('left');
                this.draggedElement.classList.remove('dragged');
                this.allCards.forEach((item) => item.id );
                this.draggedElement = undefined;
                document.documentElement.removeEventListener('mousemove', this.onMouseOver);
                document.body.style.cursor = 'default';
            }
        }
    }

    show(targetColumn) {
        this.targetColumn = targetColumn
        this.taskContentTag.value = '';
        this.addBtn.addEventListener('click', this.createCardEvent);
        this.popup.classList.remove('popup_hidden');
    }

    hide() {
        this.taskContentTag.value = '';
        this.addBtn.removeEventListener('click', this.createCardEvent);
        this.popup.classList.add('popup_hidden');
    }

    createCard(content) {
        const cardId = performance.now().toFixed();
        const cardWrap = document.createElement('div');
        const cardContent = document.createElement('span');
        const closeBtn = document.createElement('span');
        const column = this.targetColumn

        cardWrap.classList.add('card');
        cardContent.classList.add('card-content');
        closeBtn.classList.add('rm-card');
        cardContent.textContent = content;
        cardWrap.appendChild(cardContent);
        cardWrap.appendChild(closeBtn);

        cardWrap.addEventListener('mousedown', this.draggedEvent);
        document.documentElement.addEventListener('mouseup', this.onMouseUp);

        const retObj = {
            id: cardId,
            tag: cardWrap,
            column: column
        };
        this.allCards.push(retObj);

        cardWrap.setAttribute('cardId', cardId);
        closeBtn.addEventListener('click', this.removeCardEvent);
        column.appendChild(cardWrap);
    }

    removeCard(target) {
        const column = target.parentNode.parentNode;
        const targetCardId = target.parentNode.getAttribute('cardId');
        column.querySelectorAll('.card').forEach((card) => card.remove());
        this.allCards = this.allCards.filter((item) => item.id != targetCardId);
        this.allCards.forEach((item) => {
            item.column.appendChild(item.tag);
        });
    }

}

window.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.app-container');
    const addCardBtn = document.querySelectorAll('.add-card');
    const popup = new Popup('#popup');

    addCardBtn.forEach((item) => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-card')) {
                popup.show(e.target.parentNode.parentNode);
            }
        });
    });
    
});