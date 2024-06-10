import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class IncomesCreate {
    constructor() {
        this.newIncomeName = document.getElementById('new-income-name');
        this.newIncomeButton = document.getElementById('new-income-button');
        const that = this;

        this.newIncomeName.onchange = function () {
            if (!that.newIncomeName.value) {
                that.newIncomeName.classList.add("is-invalid");
            } else {
                that.newIncomeName.classList.remove("is-invalid");
            }
        }

        this.newIncomeButton.addEventListener("click", this.createIncome.bind(this));
    }

    async createIncome() {
        try {
            if (!this.newIncomeName.value) {
                return;
            }
            const result = await CustomHttp.request(config.host + '/categories/income', 'POST',
                {"title": this.newIncomeName.value});
            if (!result || result.error) {
                throw new Error(result.message);
            }
            window.location.href = '#/incomes-view';
        } catch (error) {
            return console.log(error);
        }
    }

}