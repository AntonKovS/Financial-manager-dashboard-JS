import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Layout {
    constructor(newRoute) {
        this.route = newRoute;
        this.labelForChange = document.getElementById('lable-for-change');
        this.balance = document.getElementById('balance');
        this.balanceAmount = document.getElementById('balance-amount');
        this.balanceUpdateButton = document.getElementById('balance-update-button');

        this.showSideBar();
        this.activateSideBar();
        this.showBalance().then();

        this.balance.parentElement.addEventListener("click", this.balanceMenu.bind(this));
        this.balanceUpdateButton.addEventListener("click", this.updateBalance.bind(this));
    }

    showSideBar() {
        $(document).ready(function () {
            const sidebarButton = $(".sidebar-button");

            function toggleSidebar() {
                sidebarButton.toggleClass("active");
                $(".sidebar-main").toggleClass("move-to-left-bar");
                $(".sidebar-css").toggleClass("move-to-left-sidebar");
            }

            sidebarButton.on("click tap", function () {
                toggleSidebar();
            });

            $(document).keyup(function (e) {
                if (e.keyCode === 27) {
                    toggleSidebar();
                }
            });

        });
    };

    activateSideBar() {
        const that = this;
        $("#leftside-navigation .sub-menu > a").click(function (e) {
            $("#leftside-navigation ul ul").slideUp();
            $(this).next().is(":visible") || $(this).next().slideDown();
            e.stopPropagation();
            $("i.nav-link-item-icon").toggleClass( "fa-chevron-right fa-chevron-down" );
        });

        document.querySelectorAll('.sidebar-css .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((this.route.route.includes(href) && href !== '#/') || (this.route.route === '#/' && href === '#/')) {
                item.classList.add('active');
                item.classList.remove('link-body-emphasis');
                if (item.classList.contains('sub-menu-hidden-element')) {
                    this.labelForChange.firstElementChild.innerText = item.firstElementChild.textContent;
                    this.labelForChange.classList.add('active');
                    this.labelForChange.classList.remove('link-body-emphasis');
                }
            }
            if (this.route.route === '#/incomes-create' || this.route.route === '#/expenses-create') {
                this.labelForChange.firstElementChild.innerText = 'Создание';
                this.labelForChange.classList.add('active');
                this.labelForChange.classList.remove('link-body-emphasis');
            }
            if (this.route.route === '#/incomes-edit' || this.route.route === '#/expenses-edit') {
                this.labelForChange.firstElementChild.innerText = 'Редактирование';
                this.labelForChange.classList.add('active');
                this.labelForChange.classList.remove('link-body-emphasis');
            }
        });
    };

    async showBalance() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (!result || result.error) {
                throw new Error(result.message);
            }
            this.balance.innerText = result.balance + " $";
        } catch (error) {
            return console.log(error);
        }
    }

    async balanceMenu() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (!result || result.error) {
                throw new Error(result.message);
            }
            this.balance.innerText = result.balance + " $";
            this.balanceAmount.value = result.balance;
        } catch (error) {
            return console.log(error);
        }
    }

    async updateBalance() {
        try {
            if (this.balanceAmount.value === this.balance.textContent.split(' ')[0] || !this.balanceAmount.value.match(/^(\d){1,13}$/g)) {
                return;
            }
            const result = await CustomHttp.request(config.host + '/balance', 'PUT', {"newBalance": this.balanceAmount.value});
            if (!result || result.error) {
                throw new Error(result.message);
            }
            await this.showBalance();
        } catch (error) {
            return console.log(error);
        }
    }


}