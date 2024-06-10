import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";

export class OperationsEdit {
    constructor() {
        this.operationEditType = document.getElementById('operation-edit-type');
        this.operationEditCategory = document.getElementById('operation-edit-category');
        this.operationEditAmount = document.getElementById('operation-edit-amount');
        this.operationEditDate = document.getElementById('operation-edit-date');
        this.operationEditComment = document.getElementById('operation-edit-comment');
        this.operationEditRequestButton = document.getElementById('operation-edit-request-button');

        this.getOperationViaId().then();
    }

    async getOperationViaId() {
        try {
            const categoryId = UtilsCategoriesInfo.getCategoryId();
            if (!categoryId) {
                location.href = '#/incomes&expenses-view';
            }
            const resultCatId = await CustomHttp.request(config.host + '/operations/' + categoryId);
            if (!resultCatId || resultCatId.error) {
                throw new Error(resultCatId.message);
            }
            if (resultCatId.id === categoryId) {

                this.operationEditType.value = resultCatId.type;
                this.operationEditAmount.value = resultCatId.amount;
                this.operationEditDate.value = resultCatId.date;
                this.operationEditComment.value = resultCatId.comment;

                UtilsCategoriesInfo.createSelectCategories(this.operationEditType, this.operationEditCategory, resultCatId.category).then();
                UtilsCategoriesInfo.inputsListeners(this.operationEditType, this.operationEditCategory, this.operationEditAmount, this.operationEditDate);

                this.operationEditRequestButton.addEventListener("click", () => {
                    CustomHttp.createUpdateRequest(config.host + '/operations/' + resultCatId.id,'PUT', this.operationEditType, this.operationEditCategory, this.operationEditAmount, this.operationEditDate, this.operationEditComment);
                });
                UtilsCategoriesInfo.removeCategoryId();
            }
        } catch (error) {
            return console.log(error);
        }
    };

}