import {Layout} from "./components/layout.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.contentLayoutElement = document.getElementById('content-layout');
        this.titleElement = document.getElementById('page-title');
        this.stylesUtilsBefore = document.getElementById('styles-utils-before');
        this.styleElement = document.getElementById('style-element');
        this.scriptElement = document.getElementById('script-element');


        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/pages/dashboard.html',
                useLayout: 'templates/layout.html',
                styles: 'dashboard.css',
                scripts: ['layout.js'],
                // scripts: 'layout.js',
                // load: () => {
                //     new Layout();    //this.openNewRoute.bind(this), определяем какой файл js использовать и сделать экземпляр класса из него
                // },
            },
            {
                route: '#/sign-up',
                title: 'Создайте аккаунт',
                template: 'templates/pages/auth/sign-up.html',
                useLayout: false,
                styles: 'auth.css',
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/pages/auth/login.html',
                useLayout: false,
                styles: 'auth.css',
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
            },
        ];
        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (urlRoute === '#/logout') {
                // await Auth.logout();
                window.location.href = '#/';
                return;
            }

            if (newRoute.template) {
                let contentBlock = this.contentElement;
                if (newRoute.useLayout) {
                    this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    //
                    //     this.profileNameElement = document.getElementById('profile-name');
                    //     if (!this.userName) {
                    //         let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    //         if (userInfo) {
                    //             userInfo = JSON.parse(userInfo);
                    //             if (userInfo.name) {
                    //                 this.userName = userInfo.name;
                    //             }
                    //         }
                    //     }
                    //     this.profileNameElement.innerText = this.userName;
                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                if (newRoute.title) {
                    this.titleElement.innerText = newRoute.title + ' | SaveMoney';
                }
                if (newRoute.useLayout) {
                    new Layout(newRoute);
                }
            }
            this.styleElement.setAttribute('href', ('css/' + newRoute.styles));
        } else {
            window.location.href = '#/';
            // return;
        }
    }
}