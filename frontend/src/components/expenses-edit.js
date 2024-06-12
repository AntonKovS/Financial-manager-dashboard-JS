import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";

export class ExpensesEdit {
    constructor() {
        this.getExpenseViaId().then();
    }

    async getExpenseViaId() {
        try {
            const categoryId = UtilsCategoriesInfo.getCategoryId();
            const getResult = await CustomHttp.request(config.host + '/categories/expense/' + categoryId);
            if (!getResult || getResult.error) {
                throw new Error(getResult.message);
            }
            if (getResult.id === categoryId) {
                const expenseEditInput = document.getElementById('expense-edit-input');
                expenseEditInput.value = getResult.title;

                const expenseUpdate = document.getElementById('expense-update');
                expenseUpdate.addEventListener("click", () => {
                    const updateResult = CustomHttp.request(config.host + '/categories/expense/' + categoryId, 'PUT', {
                        "title": expenseEditInput.value
                    });
                    if (!updateResult || updateResult.error) {
                        throw new Error(updateResult.message);
                    }
                    UtilsCategoriesInfo.removeCategoryId();
                    location.href = '#/expenses-view';
                });
            }
        } catch (error) {
            return console.log(error);
        }
    }
}