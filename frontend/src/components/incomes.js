import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";

export class Incomes {
    constructor() {
        this.getIncomes().then();
    };

    async getIncomes() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (!result || result.error) {
                throw new Error(result.message);
            }
            console.log(result);
            this.processIncomes(result);
        } catch (error) {
            return console.log(error);
        }
    };

    processIncomes(incomes) {
        const incomesViewGroup = document.getElementById('incomes-view-group');
        if (incomes && incomes.length > 0) {
            incomes.forEach(income => {
                const incomesViewItem = document.createElement('div');
                incomesViewItem.className = 'card-css card rounded-3 shadow-sm';
                incomesViewItem.setAttribute('id', 'income-' + income.id);
                incomesViewGroup.appendChild(incomesViewItem);

                const incomesViewCard = document.createElement('div');
                incomesViewCard.className = 'card-body';
                incomesViewItem.appendChild(incomesViewCard);

                const incomesViewCardTitle = document.createElement('h2');
                incomesViewCardTitle.className = 'card-title';
                incomesViewCardTitle.innerText = income.title;
                incomesViewCard.appendChild(incomesViewCardTitle);

                const incomesViewCardEdit = document.createElement('a');
                incomesViewCardEdit.setAttribute('href', 'javascript:void(0)');
                incomesViewCardEdit.className = 'card-button btn btn-primary';
                incomesViewCardEdit.innerText = 'Редактировать';
                incomesViewCard.appendChild(incomesViewCardEdit);

                const incomesViewCardDelete = document.createElement('a');
                incomesViewCardDelete.setAttribute('href', 'javascript:void(0)');
                incomesViewCardDelete.className = 'card-button btn btn-danger';
                incomesViewCardDelete.innerText = 'Удалить';
                incomesViewCard.appendChild(incomesViewCardDelete);

                incomesViewCardEdit.addEventListener("click", () => {
                    UtilsCategoriesInfo.setCategoryId(income.id);
                    location.href = '#/incomes-edit';
                });

                incomesViewCardDelete.addEventListener("click", () => {
                    const incomesPopup = document.getElementById('incomes-popup');
                    incomesPopup.style.display = 'flex';

                    const incomesPopupNo = document.getElementById('incomes-popup-no');
                    incomesPopupNo.addEventListener("click", () => {
                        // incomesPopup.style.display = 'none';
                        location.href = '#/incomes-view';
                    });

                    const incomesPopupYes = document.getElementById('incomes-popup-yes');
                    incomesPopupYes.addEventListener("click", () => {
                        // incomesPopup.style.display = 'none';
                        try {
                            const result = CustomHttp.request(config.host + '/categories/income/' + income.id, 'DELETE');
                            if (!result || result.error) {
                                throw new Error(result.message);
                            }
                            window.location.href = '#/incomes-view';
                        } catch (error) {
                            return console.log(error);
                        }
                    });
                });
            });
        }

        const incomesViewCreate = document.createElement('div');
        incomesViewCreate.className = 'card-css card rounded-3 shadow-sm';
        incomesViewGroup.appendChild(incomesViewCreate);

        const incomesViewCreateButton = document.createElement('a');
        incomesViewCreateButton.setAttribute('href', '#/incomes-create');
        incomesViewCreateButton.className = 'card-body card-body-view align-content-center text-center w-100';
        incomesViewCreate.appendChild(incomesViewCreateButton);

        const incomesViewCreateIcon = document.createElement('i');
        incomesViewCreateIcon.className = 'fa-solid fa-plus text-secondary';
        incomesViewCreateButton.appendChild(incomesViewCreateIcon);
    };

}