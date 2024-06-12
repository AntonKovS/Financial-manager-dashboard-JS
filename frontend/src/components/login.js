import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Login {
    constructor(page) {
        this.page = page;
        this.processElement = null;
        this.validForm = false;
        this.rememberMe = false;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                // regex: /./,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                // regex: /./,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                // regex: /./,
                regex: /^[А-ЯЁ][а-яё]*\s[А-ЯЁ][а-яё]*\s[А-ЯЁ][а-яё]*$/,
                valid: false,
            });
            this.fields.push({
                name: 'repeatPassword',
                id: 'repeatPassword',
                element: null,
                regex: /./,
                valid: false,
            });
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            }
        }
    }

    validateField(field, element) {
        const password = this.fields.find(item => item.name === 'password');
        const repeatPassword = this.fields.find(item => item.name === 'repeatPassword');

        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add("is-invalid");
            field.valid = false;
        } else {
            element.classList.remove("is-invalid");
            field.valid = true;
        }

        if (repeatPassword && element === repeatPassword.element) {
            if (password.element.value !== repeatPassword.element.value) {
                element.classList.add("is-invalid");
                field.valid = false;
            } else {
                element.classList.remove("is-invalid");
                field.valid = true;
            }
        }

        this.validForm = this.fields.every(item => item.valid);
        if (this.validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
    }

    async processForm() {
        if (this.validForm) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                const repeatPassword = this.fields.find(item => item.name === 'repeatPassword').element.value;

                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[0],
                        lastName: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[1],
                        email: email,
                        password: password,
                        passwordRepeat: repeatPassword,
                    });
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            const rememberElement = document.getElementById('remember-me');

            if (rememberElement) {
                this.rememberMe = !!rememberElement.checked;
                // Это тоже самое, что и выше
                // if (rememberElement.checked) {
                //     this.rememberMe = true;
                // } else {
                //     this.rememberMe = false;
                // }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.rememberMe
                });
                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' + result.user.lastName,
                        userId: result.user.id
                    })
                    location.href = '#/';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

}