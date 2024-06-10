import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";

export class OperationsCreate {
    constructor() {
        this.createSelectType = document.getElementById('create-select-type');
        this.createSelectCategory = document.getElementById('create-select-category');
        this.createAmount = document.getElementById('create-amount');
        this.createDate = document.getElementById('create-date');
        this.createRequestButton = document.getElementById('create-request-button');
        this.createComment = document.getElementById('create-comment');

        this.createSelect = UtilsCategoriesInfo.getCategoryType();
        if (this.createSelect) {
            this.createSelectType.value = this.createSelect;
        }

        UtilsCategoriesInfo.createSelectCategories(this.createSelectType, this.createSelectCategory).then();
        UtilsCategoriesInfo.inputsListeners(this.createSelectType, this.createSelectCategory, this.createAmount, this.createDate);

        this.createRequestButton.addEventListener("click", () => {
            CustomHttp.createUpdateRequest(config.host + '/operations','POST', this.createSelectType, this.createSelectCategory, this.createAmount, this.createDate, this.createComment);
        });

        UtilsCategoriesInfo.removeCategoryType();
    };
}