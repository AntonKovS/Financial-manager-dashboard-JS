import {Layout} from "./components/layout.js";
import {Login} from "./components/login.js";
import {Auth} from "./services/auth.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.titleElement = document.getElementById('page-title');
        this.styleElement = document.getElementById('style-element');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/pages/dashboard.html',
                useLayout: 'templates/layout.html',
                styles: 'dashboard.css',
                scripts: ['layout.js'],
            },
            {
                route: '#/signup',
                title: 'Создайте аккаунт',
                template: 'templates/pages/auth/signup.html',
                useLayout: false,
                styles: 'auth.css',
                load: () => {
                    new Login('signup');
                },
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/pages/auth/login.html',
                useLayout: false,
                styles: 'auth.css',
                load: () => {
                    new Login('login');
                },
            },
            {
                route: '#/incomes&spendings-view',
                title: 'Доходы и расходы',
                template: 'templates/pages/incomes-spendings/incomes&spendings-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/incomes&spendings-create',
                title: 'Создание дохода/расхода',
                template: 'templates/pages/incomes-spendings/incomes&spendings-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/incomes&spendings-edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/pages/incomes-spendings/incomes&spendings-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/incomes-view',
                title: 'Доходы',
                template: 'templates/pages/incomes-spendings/incomes-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/incomes-create',
                title: 'Создание категории доходов',
                template: 'templates/pages/incomes-spendings/incomes-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/incomes-edit',
                title: 'Редактирование категории доходов',
                template: 'templates/pages/incomes-spendings/incomes-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/spendings-view',
                title: 'Расходы',
                template: 'templates/pages/incomes-spendings/spendings-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/spendings-create',
                title: 'Создание категории расходов',
                template: 'templates/pages/incomes-spendings/spendings-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            },
            {
                route: '#/spendings-edit',
                title: 'Редактирование категории расходов',
                template: 'templates/pages/incomes-spendings/spendings-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-spendings.css',
            }];

        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        const userInfo = Auth.getUserInfo();
        if ((!userInfo || !accessToken) && urlRoute !== '#/signup') {
            await Auth.removeTokensAndUserInfo();
            if (urlRoute !== '#/login') {
            window.location.href = '#/login';
            return;
            }
        }

        if (newRoute) {
            if (newRoute.template) {
                let contentBlock = this.contentElement;
                if (newRoute.useLayout) {
                    this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                if (newRoute.title) {
                    this.titleElement.innerText = newRoute.title + ' | SaveMoney';
                }
                if (userInfo && userInfo.fullName) {
                    document.getElementById('profile-name').innerText = userInfo.fullName;
                }
            }
            this.styleElement.setAttribute('href', ('css/' + newRoute.styles));
            if (newRoute.useLayout) {
                new Layout(newRoute);
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            window.location.href = '#/';
            // return;
        }
    }
}