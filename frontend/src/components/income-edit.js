import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";

export class IncomeEdit {
    constructor() {
        this.getIncomeViaId().then();
    }

    async getIncomeViaId() {
        try {
            const categoryId = UtilsCategoriesInfo.getCategoryId();
            const getResult = await CustomHttp.request(config.host + '/categories/income/' + categoryId);
            if (!getResult || getResult.error) {
                throw new Error(getResult.message);
            }
            if (getResult.id === categoryId) {
                const incomeEditInput = document.getElementById('income-edit-input');
                incomeEditInput.value = getResult.title;

                const incomeUpdate = document.getElementById('income-update');
                incomeUpdate.addEventListener("click", () => {
                    const updateResult = CustomHttp.request(config.host + '/categories/income/' + categoryId, 'PUT', {
                        "title": incomeEditInput.value
                    });
                    if (!updateResult || updateResult.error) {
                        throw new Error(updateResult.message);
                    }
                    UtilsCategoriesInfo.removeCategoryId();
                    location.href = '#/incomes-view';
                });
            }
        } catch (error) {
            return console.log(error);
        }
    };

}