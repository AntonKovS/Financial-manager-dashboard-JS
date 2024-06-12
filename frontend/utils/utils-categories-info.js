import {CustomHttp} from "../src/services/custom-http.js";
import config from "../config/config.js";

export class UtilsCategoriesInfo {
    static categoryIdKey = 'categoryId';
    static categoryTypeKey = 'categoryType';

    static async createSelectCategories(typeElement, categoryElement, categoryId = null) {
        try {
            if (typeElement.value) {
                categoryElement.innerHTML = '<option value="0">Категория...</option>';
                const result = await CustomHttp.request(config.host + '/categories/' + typeElement.value);
                result.forEach(res => {
                    const createOption = document.createElement('option');
                    createOption.innerText = res.title;
                    createOption.setAttribute('value', res.id);
                    categoryElement.appendChild(createOption);
                    if (categoryId) {
                        if (res.title === categoryId) {
                            categoryElement.value = res.id;
                        }
                    }
                });
                categoryElement.style.color = categoryElement.value === '0' ? 'grey' : 'black';
            } else {
                location.href = '#/incomes&expenses-view';
            }
        } catch (error) {
            return console.log(error);
        }
    };

    static inputsListeners(typeElement, categoryElement, amountElement, dateElement) {
        typeElement.addEventListener('input', () => {
            categoryElement.innerHTML = '<option value="0">Категория...</option>';
            categoryElement.style.color = categoryElement.value === '0' ? 'grey' : 'black';
            this.createSelectCategories(typeElement, categoryElement).then();
        });
        categoryElement.addEventListener('input', () => {
            categoryElement.style.color = categoryElement.value === '0' ? 'grey' : 'black';
        });
        amountElement.addEventListener('input', function () {
            this.value = this.value.replace(/\D/, '');
        });
        dateElement.addEventListener('input', function () {
            let maxLength = 10;
            if (this.value.length > maxLength) {
                this.value = this.value.substring(10, maxLength);
            }
        });
    }

    static processFilter(buttonFilter, button) {
        let inputDateFrom = document.getElementById('input-date-from');
        let inputDateTo = document.getElementById('input-date-to');
        inputDateFrom.setAttribute('disabled', 'disabled');
        inputDateTo.setAttribute('disabled', 'disabled');
        const that = this;
        Array.from(buttonFilter).forEach(button => {
            button.classList.remove('active');
        });
        button.classList.add('active');
        inputDateFrom.setAttribute('disabled', 'disabled');
        inputDateTo.setAttribute('disabled', 'disabled');
        inputDateFrom.classList.remove('is-invalid');
        inputDateTo.classList.remove('is-invalid');

        let int = button.className.split(/-| /)[2];
        // console.log(button.className.split(/[\s-]/)[2]);

        if (int === "interval") {
            inputDateFrom.removeAttribute('disabled');
            inputDateTo.removeAttribute('disabled');

            let tableBody = document.getElementById('table-body');
            if (tableBody) {
                tableBody.innerHTML = '';
            }
            let chartStatus1 = Chart.getChart("myChart-1");
            let chartStatus2 = Chart.getChart("myChart-2");
            if (chartStatus1 || chartStatus2) {
                chartStatus1.destroy();
                chartStatus2.destroy();
            }

            inputDateFrom.addEventListener('input', function () {
                let maxLength = 10;
                if (this.value.length > maxLength) {
                    this.value = this.value.substring(10, maxLength);
                }
            });
            inputDateTo.addEventListener('input', function () {
                let maxLength = 10;
                if (this.value.length > maxLength) {
                    this.value = this.value.substring(10, maxLength);
                }
            });

            let validInputDateFrom = false;
            let validInputDateTo = false;

            inputDateFrom.addEventListener('focusout', function () {
                if (!inputDateFrom.value) {
                    inputDateFrom.classList.add('is-invalid');
                    validInputDateFrom = false;
                } else {
                    inputDateFrom.classList.remove('is-invalid');
                    validInputDateFrom = true;
                    if (validInputDateTo) {
                        let newInt = 'interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value;
                        that.requestOperationByDate(newInt).then((resolve) => {
                            return resolve;
                        });
                        button.click();
                    }
                }
            });
            inputDateTo.addEventListener('focusout', function () {
                if (inputDateTo.value.length !== 10) {
                    inputDateTo.classList.add('is-invalid');
                    validInputDateTo = false;
                } else {
                    inputDateTo.classList.remove('is-invalid');
                    validInputDateTo = true;
                    if (validInputDateFrom) {
                        let newInt = 'interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value;
                        that.requestOperationByDate(newInt).then((resolve) => {
                            return resolve;
                        });
                        button.click();
                    }
                }
            });

            if (inputDateFrom.value && inputDateTo.value) {
                let newInt = 'interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value;
                return this.requestOperationByDate(newInt).then((resolve) => {
                    return resolve;
                });
            } else {
                let newInt = 'interval&dateFrom=0000-00-00&dateTo=0000-00-00';
                return this.requestOperationByDate(newInt).then((resolve) => {
                    return resolve;
                });
            }
        } else {
            return this.requestOperationByDate(int).then((resolve) => {
                return resolve
            });
        }
    }

    static requestOperationByDate(int = 'today') {
        try {
            const result = CustomHttp.request(config.host + '/operations?period=' + int);
            if (!result || result.error) {
                throw new Error(result.message);
            } else {
                return result;
            }
        } catch (error) {
            return console.log(error);
        }
    }

    static setCategoryId(info) {
        localStorage.setItem(this.categoryIdKey, JSON.stringify(info));
    }

    static getCategoryId() {
        const categoryId = localStorage.getItem(this.categoryIdKey);
        if (categoryId) {
            return JSON.parse(categoryId);
        }
        return null;
    }

    static removeCategoryId() {
        localStorage.removeItem(this.categoryIdKey);
    }

    static setCategoryType(info) {
        localStorage.setItem(this.categoryTypeKey, JSON.stringify(info));
    }

    static getCategoryType() {
        const categoryType = localStorage.getItem(this.categoryTypeKey);
        if (categoryType) {
            return JSON.parse(categoryType);
        }
        return null;
    }

    static removeCategoryType() {
        localStorage.removeItem(this.categoryTypeKey);
    }

}