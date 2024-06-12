import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";

export class Expenses {
    constructor() {
        this.getExpenses().then();
    };

    async getExpenses() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/expense');
            if (!result || result.error) {
                throw new Error(result.message);
            }
            this.processExpenses(result);
        } catch (error) {
            return console.log(error);
        }
    };

    processExpenses(expenses) {
        const expensesViewGroup = document.getElementById('expenses-view-group');
        if (expenses && expenses.length > 0) {
            expenses.forEach(expense => {
                const expensesViewItem = document.createElement('div');
                expensesViewItem.className = 'card-css card rounded-3 shadow-sm';
                expensesViewItem.setAttribute('id', 'expense-' + expense.id);
                expensesViewGroup.appendChild(expensesViewItem);

                const expensesViewCard = document.createElement('div');
                expensesViewCard.className = 'card-body';
                expensesViewItem.appendChild(expensesViewCard);

                const expensesViewCardTitle = document.createElement('h2');
                expensesViewCardTitle.className = 'card-title';
                expensesViewCardTitle.innerText = expense.title;
                expensesViewCard.appendChild(expensesViewCardTitle);

                const expensesViewCardEdit = document.createElement('a');
                expensesViewCardEdit.setAttribute('href', 'javascript:void(0)');
                expensesViewCardEdit.className = 'card-button btn btn-primary';
                expensesViewCardEdit.innerText = 'Редактировать';
                expensesViewCard.appendChild(expensesViewCardEdit);

                const expensesViewCardDelete = document.createElement('a');
                expensesViewCardDelete.setAttribute('href', 'javascript:void(0)');
                expensesViewCardDelete.className = 'card-button btn btn-danger';
                expensesViewCardDelete.innerText = 'Удалить';
                expensesViewCard.appendChild(expensesViewCardDelete);

                expensesViewCardEdit.addEventListener("click", () => {
                    UtilsCategoriesInfo.setCategoryId(expense.id);
                    location.href = '#/expenses-edit';
                });

                expensesViewCardDelete.addEventListener("click", () => {
                    const expensesPopup = document.getElementById('expenses-popup');
                    expensesPopup.style.display = 'flex';

                    const expensesPopupNo = document.getElementById('expenses-popup-no');
                    expensesPopupNo.addEventListener("click", () => {
                        // expensesPopup.style.display = 'none';
                        location.href = '#/expenses-view';
                    });

                    const expensesPopupYes = document.getElementById('expenses-popup-yes');
                    expensesPopupYes.addEventListener("click", () => {
                        // expensesPopup.style.display = 'none';
                        try {
                            const result = CustomHttp.request(config.host + '/categories/expense/' + expense.id, 'DELETE');
                            if (!result || result.error) {
                                throw new Error(result.message);
                            }
                            window.location.href = '#/expenses-view';
                        } catch (error) {
                            return console.log(error);
                        }
                    });
                });





            });
        }

            const expensesViewCreate = document.createElement('div');
            expensesViewCreate.className = 'card-css card rounded-3 shadow-sm';
            expensesViewGroup.appendChild(expensesViewCreate);

            const expensesViewCreateButton = document.createElement('a');
            expensesViewCreateButton.setAttribute('href', '#/expenses-create');
            expensesViewCreateButton.className = 'card-body card-body-view align-content-center text-center w-100';
            expensesViewCreate.appendChild(expensesViewCreateButton);

            const expensesViewCreateIcon = document.createElement('i');
            expensesViewCreateIcon.className = 'fa-solid fa-plus text-secondary';
            expensesViewCreateButton.appendChild(expensesViewCreateIcon);
    };

}