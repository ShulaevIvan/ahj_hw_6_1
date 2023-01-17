import CardManager from '../components/dnd/card';
import   Cursor from '../components/dnd/dnd';

window.addEventListener('DOMContentLoaded', () => {
    const cardManager = new CardManager('.container');
    const allBtn = document.querySelectorAll('.add-card-container');
    const storage  = JSON.parse(localStorage.getItem('cards'));
    if (storage) {
        cardManager.restoreCardsStorage(storage)
    }

    allBtn.forEach((item) => {
        item.addEventListener('click' ,(e) => {
            const card = cardManager.createCard('test', e.target);
            e.preventDefault();
        })
    });
   
    // allBtn.forEach((item) => {
    //     item.addEventListener('click' ,(e) => {
    //         cardManager.removeCard()
    //         e.preventDefault();
    //     })
    // })

})