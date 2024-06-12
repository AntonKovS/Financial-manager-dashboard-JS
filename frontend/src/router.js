import {Layout} from "./components/layout.js";
import {Login} from "./components/login.js";
import {Auth} from "./services/auth.js";
import {Incomes} from "./components/incomes.js";
import {Expenses} from "./components/expenses.js";
import {IncomesCreate} from "./components/incomes-create.js";
import {ExpensesCreate} from "./components/expenses-create.js";
import {IncomeEdit} from "./components/income-edit.js";
import {ExpensesEdit} from "./components/expenses-edit.js";
import {OperationsView} from "./components/operations-view.js";
import {OperationsCreate} from "./components/operations-create.js";
import {OperationsEdit} from "./components/operations-edit.js";
import {Dashboard} from "./components/dashboard.js";

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
                load: () => {
                    new Dashboard();
                },
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
                route: '#/incomes&expenses-view',
                title: 'Доходы и расходы',
                template: 'templates/pages/incomes-expenses/incomes&expenses-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new OperationsView();
                },
            },
            {
                route: '#/incomes&expenses-create',
                title: 'Создание дохода/расхода',
                template: 'templates/pages/incomes-expenses/incomes&expenses-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new OperationsCreate();
                },
            },
            {
                route: '#/incomes&expenses-edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/pages/incomes-expenses/incomes&expenses-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new OperationsEdit();
                },
            },
            {
                route: '#/incomes-view',
                title: 'Доходы',
                template: 'templates/pages/incomes-expenses/incomes-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new Incomes();
                },
            },
            {
                route: '#/incomes-create',
                title: 'Создание категории доходов',
                template: 'templates/pages/incomes-expenses/incomes-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new IncomesCreate();
                },
            },
            {
                route: '#/incomes-edit',
                title: 'Редактирование категории доходов',
                template: 'templates/pages/incomes-expenses/incomes-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new IncomeEdit();
                },
            },
            {
                route: '#/expenses-view',
                title: 'Расходы',
                template: 'templates/pages/incomes-expenses/expenses-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new Expenses();
                },
            },
            {
                route: '#/expenses-create',
                title: 'Создание категории расходов',
                template: 'templates/pages/incomes-expenses/expenses-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new ExpensesCreate();
                },
            },
            {
                route: '#/expenses-edit',
                title: 'Редактирование категории расходов',
                template: 'templates/pages/incomes-expenses/expenses-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new ExpensesEdit();
                },
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