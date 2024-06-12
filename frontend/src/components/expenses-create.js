import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class ExpensesCreate {
    constructor() {
        this.newExpenseName = document.getElementById('new-expense-name');
        this.newExpenseButton = document.getElementById('new-expense-button');
        const that = this;

        this.newExpenseName.onchange = function () {
            if (!that.newExpenseName.value) {
                that.newExpenseName.classList.add("is-invalid");
            } else {
                that.newExpenseName.classList.remove("is-invalid");
            }
        }

        this.newExpenseButton.addEventListener("click", this.createExpense.bind(this));
    }

    async createExpense() {
        try {
            if (!this.newExpenseName.value) {
                return;
            }
            const result = await CustomHttp.request(config.host + '/categories/expense', 'POST',
                {"title": this.newExpenseName.value});
            if (!result || result.error) {
                throw new Error(result.message);
            }
            window.location.href = '#/expenses-view';
        } catch (error) {
            return console.log(error);
        }
    }

}