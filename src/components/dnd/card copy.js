export default class CardManager {
    constructor() {
        this.allCards = [];
        this.removeCard = (e) => {
            if (e.target.classList.contains('card-close-block')) {
                e.preventDefault()
                e.stopPropagation();
                this.allCards = this.allCards.filter((item) => item.id != e.target.getAttribute('closeId'));
                this.rebuildDom();
            }
        };

        this.hoverCard = (e) => {
            if (e.target.classList.contains('list-item')) {
                const id = e.target.getAttribute('cardId');
                const card = this.allCards.find((card) => card.id == id);
                card.close.removeEventListener(card.tag, this.hoverCardOff);
                card.close.classList.remove('hidden');
            }
        }
        this.hoverCardOff = (e) => {
            if (e.target.classList.contains('list-item')) {
                const id = e.target.getAttribute('cardId');
                const card = this.allCards.find((card) => card.id == id);
                card.close.removeEventListener(card.tag, this.hoverCard);
                card.close.classList.add('hidden');
            } 
        }

    }

    createCard(contentValue, clickedTarget) {
        const id = performance.now().toFixed();
        const li = document.createElement('li');
        const p = document.createElement('p');
        const btnClose = document.createElement('div');
        const form = this.createForm(id);

        p.textContent = contentValue;
        li.classList.add('list-item');
        li.setAttribute('draggable', true);
        li.setAttribute('cardId', id);
        btnClose.setAttribute('closeId', id);
        btnClose.classList.add('card-close-block');
        btnClose.addEventListener('click', this.removeCard);
        btnClose.classList.add('hidden')
        li.appendChild(btnClose);
        li.appendChild(p);
        li.addEventListener('mouseover', this.hoverCard);
        li.addEventListener('mouseleave', this.hoverCardOff);
        const cardObj = {
            id: id,
            text: contentValue,
            tag: li,
            close: btnClose,
            column: clickedTarget.getAttribute('data-column'),
            form: form
        }
        this.allCards.push(cardObj);
        const formPlace = clickedTarget.closest('.list-container');
        this.showForm(formPlace, cardObj.form)
        return cardObj
    }

    rebuildDom() {
        document.querySelectorAll('.list-item').forEach((item) => {
            if (!item.classList.contains('unmovable')) {
                item.removeEventListener('click', this.removeCard)
                item.remove();
            }
            
        });

        this.allCards.forEach((cardItem) => {
            const column = document.querySelector(`.${cardItem.column}-list`);
            cardItem.tag.textContent = cardItem.text;
            cardItem.tag.appendChild(cardItem.close);
            column.appendChild(cardItem.tag);
        })
        this.toLocalStorage();

    }

    toLocalStorage() {
        const toLocalStorageArr = [];
        this.allCards.forEach((item) => {
            toLocalStorageArr.push({
                id: item.id,
                tagClass: item.tag.getAttribute('class'),
                column: item.column,
                text: item.text,
                closeTag: item.close.getAttribute('closeid'),
            });
        });
        localStorage.setItem('cards', JSON.stringify(toLocalStorageArr));
    }

    restoreCardsStorage(storageData)  {
        storageData.forEach((item) => {
            let id = item.id;
            let li = document.createElement('li');
            let p = document.createElement('p');
            let btnClose = document.createElement('div');
            let targetColumn = document.querySelector(`.${item.column}-list`);
            li.classList.add(item.tagClass);
            li.setAttribute('draggable', true);
            li.setAttribute('cardId', id);
            btnClose.setAttribute('closeId', id);
            btnClose.classList.add('card-close-block');
            btnClose.addEventListener('click', this.removeCard);
            btnClose.classList.add('hidden')
            p.textContent = item.text;
            li.appendChild(btnClose);
            li.appendChild(p);
            li.addEventListener('mouseover', this.hoverCard);
            li.addEventListener('mouseleave', this.hoverCardOff);
            const cardObj = {
                id: id,
                text: item.text,
                tag: li,
                close: btnClose,
                column: item.column,
            }
            this.allCards.push(cardObj);
            targetColumn.appendChild(cardObj.tag);

        });
    }



    createForm(id) {
        const form = document.createElement('form');
        form.setAttribute('formId', id);
        form.classList.add('add-card');
        form.innerHTML = ` <textarea name="card-title" class="card-title-field" rows = "5" placeholder="Enter a title for this card..."></textarea>
                  <div class="input-container">
                      <div class="input-block">
                          <input type="submit" value="Add Card" class="input-add-card" data-cardId=${id}>
                          <div class="close-btn">
                              <i class="fas fa-lg fa-times"></i>
                          </div>
                      </div>
                      <div class="menu-block">
                          <i class="fas fa-lg fa-ellipsis-h"></i>
                      </div>
                  </div>`;
    
        return form;
      }

    showForm(formPlace, form) {
      const addBtn = form.querySelector('.input-add-card');
      const textarea = form.querySelector('textarea');
      formPlace.appendChild(form);
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!textarea.value) {
            return this.showForm(formPlace, form);
        }
        else if (textarea.value) {
            const id = form.getAttribute('formId');
            this.allCards.forEach((item) => {
                if (item.id == id) {
                    item.text = textarea.value;
                    form.remove();
                    this.rebuildDom();
                }
            });
        }
      });
    }
}