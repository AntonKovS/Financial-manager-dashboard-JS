import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";

export class OperationsView {
    constructor() {
        const createIncome = document.getElementById('create-income');
        const createExpense = document.getElementById('create-expense');
        const inputDateFrom = document.getElementById('input-date-from');
        const inputDateTo = document.getElementById('input-date-to');
        inputDateFrom.setAttribute('disabled', 'disabled');
        inputDateTo.setAttribute('disabled', 'disabled');

        createIncome.addEventListener("click", () => {
            UtilsCategoriesInfo.setCategoryType('income');
            location.href = '#/incomes&expenses-create';
        });
        createExpense.addEventListener("click", () => {
            UtilsCategoriesInfo.setCategoryType('expense');
            location.href = '#/incomes&expenses-create';
        });

        this.buttonFilter = document.querySelectorAll('.filter-date .btn');
        this.init().then();
        this.buttonsListener(this.buttonFilter);
    }


    async init() {
        const operationsDefault = await UtilsCategoriesInfo.requestOperationByDate().then();
        this.showTable(operationsDefault);
    };

    buttonsListener(buttonFilter) {
        const that = this;
        Array.from(buttonFilter).forEach(button => {
            button.addEventListener("click", () => {
                UtilsCategoriesInfo.processFilter(buttonFilter, button).then(function (resolve) {
                    that.showTable(resolve);
                });
            })
        });
    };

    showTable(operations) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        let i = 0;
        operations.forEach(operation => {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerHTML = operation.type;
            const tdCategory = trElement.childNodes[1];
            tdCategory.textContent === 'income' ? tdCategory.style.color = '#00c054' : tdCategory.style.color = 'red';
            trElement.insertCell().innerHTML = operation.category;
            trElement.insertCell().innerHTML = operation.amount + ' ' + '$';
            trElement.insertCell().innerHTML = new Date(operation.date).toLocaleDateString("ru-RU");
            trElement.insertCell().innerHTML = operation.comment;

            const deleteElement = document.createElement('a');
            deleteElement.setAttribute('href', 'javascript:void(0)');
            deleteElement.className = 'table-icon-delete me-2';
            const deleteElementIcon = document.createElement('i');
            deleteElementIcon.className = 'fa-solid fa-trash-can';
            deleteElement.appendChild(deleteElementIcon);
            const editElement = document.createElement('a');
            editElement.setAttribute('href', 'javascript:void(0)');
            editElement.className = 'table-icon-edit';
            const editElementIcon = document.createElement('i');
            editElementIcon.className = 'fa-solid fa-pencil';
            editElement.appendChild(editElementIcon);

            tableBody.appendChild(trElement);

            trElement.insertCell().id = 'icons-' + operation.id;
            const iconsElement = document.getElementById('icons-' + operation.id);
            iconsElement.className = 'text-nowrap';
            iconsElement.appendChild(deleteElement);
            iconsElement.appendChild(editElement);

            editElement.addEventListener('click', () => {
                UtilsCategoriesInfo.setCategoryId(operation.id);
                location.href = '#/incomes&expenses-edit';
            });

            deleteElement.addEventListener("click", () => {
                const operationPopup = document.getElementById('operation-popup');
                operationPopup.style.display = 'flex';

                const operationPopupNo = document.getElementById('operation-popup-no');
                operationPopupNo.addEventListener("click", () => {
                    location.href = '#/incomes&expenses-view';
                });

                const operationPopupYes = document.getElementById('operation-popup-yes');
                operationPopupYes.addEventListener("click", () => {
                    try {
                        const result = CustomHttp.request(config.host + '/operations/' + operation.id, 'DELETE');
                        if (!result || result.error) {
                            throw new Error(result.message);
                        }
                        window.location.href = '#/incomes&expenses-view';
                    } catch (error) {
                        return console.log(error);
                    }
                });
            });
            i++;
        });
    }
}