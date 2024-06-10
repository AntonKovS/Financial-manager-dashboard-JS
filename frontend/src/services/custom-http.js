import {Auth} from "./auth.js";

export class CustomHttp {
    static async request(url, method = "GET", body = null) {

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };
        let token = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                const result = await Auth.processUnauthorizedResponse();
                if (result) {
                    return await this.request(url, method, body);
                } else {
                    return null;
                }
            }
            throw new Error(response.message);
        }
        return await response.json();
    }

    static inputsValidate(category, amount, date, comment) {
        let validFields = {inputCategory: false, inputAmount: false, inputDate: false, inputComment: false};

        if (category.value === '0') {
            category.classList.add('is-invalid');
            validFields.inputCategory = false;
        } else {
            category.classList.remove('is-invalid');
            validFields.inputCategory = true;
        }
        if (!amount.value) {
            amount.classList.add('is-invalid');
            validFields.inputAmount = false;
        } else {
            amount.classList.remove('is-invalid');
            validFields.inputAmount = true;
        }
        if (!date.value) {
            date.classList.add('is-invalid');
            validFields.inputDate = false;
        } else {
            date.classList.remove('is-invalid');
            validFields.inputDate = true;
        }
        if (!comment.value) {
            comment.classList.add('is-invalid');
            validFields.inputComment = false;
        } else {
            comment.classList.remove('is-invalid');
            validFields.inputComment = true;
        }

        return validFields.inputCategory === true && validFields.inputAmount === true && validFields.inputDate === true && validFields.inputComment === true;
    };

    static createUpdateRequest(url, method, type, category, amount, date, comment) {
        try {
            let valid = this.inputsValidate(category, amount, date, comment);
            if (valid) {
                const result = this.request(url, method, {
                    "type": type.value,
                    "amount": Number(amount.value),
                    "date": date.value,
                    "comment": comment.value,
                    "category_id": Number(category.value),
                });
                if (!result || result.error) {
                    throw new Error(result.message);
                }
                window.location.href = '#/incomes&expenses-view';
            }
        } catch (error) {
            return console.log(error);
        }
    };

}