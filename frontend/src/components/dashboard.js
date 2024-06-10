import {UtilsCategoriesInfo} from "../../utils/utils-categories-info.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Dashboard {
    constructor() {
        this.ctx1 = document.getElementById('myChart-1');
        this.ctx2 = document.getElementById('myChart-2');
        this.buttonFilter = document.querySelectorAll('.filter-date .btn');
        this.incomesCat = [];
        this.expenseCat = [];

        // this.getCategoriesIncome().then(this.getCategoriesExpense()).then(this.showGraphsDefault()).then(this.buttonsListener(this.buttonFilter));

        // this.getCategories().then();
        this.getCategoriesIncome().then();
        this.getCategoriesExpense().then();

        this.showGraphsDefault().then();

        this.buttonsListener(this.buttonFilter);
    }

    // async getCategories() {
    //     this.getCategoriesIncome().then();
    //     this.getCategoriesExpense().then();
    // };

    async getCategoriesIncome() {
        try {
            this.incomesCat = await CustomHttp.request(config.host + '/categories/income');
            console.log(this.incomesCat);
        } catch (error) {
            return console.log(error);
        }
    };

    async getCategoriesExpense() {
        try {
            this.expenseCat = await CustomHttp.request(config.host + '/categories/expense');
            console.log(this.expenseCat);
        } catch (error) {
            return console.log(error);
        }
    };

    async showGraphsDefault() {
        const operationsDefault = await UtilsCategoriesInfo.requestOperationByDate().then();
        this.showGraphs(operationsDefault);
    };

    buttonsListener(buttonFilter) {
        const that = this;
        Array.from(buttonFilter).forEach(button => {
            button.addEventListener("click", () => {
                UtilsCategoriesInfo.processFilter(buttonFilter, button).then(function (resolve) {
                    let chartStatus1 = Chart.getChart("myChart-1");
                    let chartStatus2 = Chart.getChart("myChart-2");
                    if (chartStatus1 !== undefined || chartStatus2 !== undefined) {
                        chartStatus1.destroy();
                        chartStatus2.destroy();
                    }
                    that.showGraphs(resolve);
                });
            })
        });
    };

    showGraphs(operations) {
        let config1 = {
            type: 'pie',
            data: {
                labels: [
                    // 'Red',
                    // 'Orange',
                    // 'Yellow',
                    // 'Green',
                    // 'Blue'
                ],
                datasets: [{
                    label: 'Сумма',
                    data: [
                        // 20, 50, 5, 15, 10
                    ],
                    // backgroundColor: [
                    //     // 'rgb(255, 99, 132)',
                    //     // 'rgb(255, 205, 86)',
                    //     // 'rgb(246,246,50)',
                    //     // 'rgb(100,217,53)',
                    //     // 'rgb(54, 162, 235)',
                    // ],
                    hoverOffset: 4
                }]
            },
            options: {
                scales: {},
                responsive: true,
                plugins: {
                    // legend: {
                    //     position: 'top',
                    // },
                    // title: {
                    //     display: true,
                    //     text: 'Доходы'
                    // }
                },
                animation: {animateScale: true},
                // rotation: 90,
                aspectRatio: 1,
                // maintainAspectRatio: false,
                // radius: 190,
                borderAlign: 'center'

            }
        };
        let config2 = {
            type: 'pie',
            data: {
                labels: [
                    // 'Red',
                    // 'Orange',
                    // 'Yellow',
                    // 'Green',
                    // 'Blue'
                ],
                datasets: [{
                    label: 'Сумма',
                    data: [
                        // 20, 50, 5, 15, 10
                    ],
                    // backgroundColor: [
                    //     'rgb(255, 99, 132)',
                    //     'rgb(255, 205, 86)',
                    //     'rgb(246,246,50)',
                    //     'rgb(100,217,53)',
                    //     'rgb(54, 162, 235)',
                    // ],
                    hoverOffset: 4
                }]
            },
            options: {
                scales: {},
                responsive: true,
                plugins: {
                    // legend: {
                    //     position: 'top',
                    // },
                    // title: {
                    //     display: true,
                    //     text: 'Доходы'
                    // }
                },
                animation: {animateScale: true},
                // rotation: 90,
                aspectRatio: 1,
                // maintainAspectRatio: false,
                // radius: 190,
                borderAlign: 'center'

            }
        };

        let incomesCatSum = {};
        let expenseCatSum = {};

        this.incomesCat.forEach(income => {
            incomesCatSum[income.title] = 0;
            operations.forEach(operation => {
                if (operation && operation.type === 'income') {
                    if (operation.category === income.title) {
                        incomesCatSum[income.title] += operation.amount;
                    }
                }
            });
        });
        this.expenseCat.forEach(expense => {                     //это из запроса
            expenseCatSum[expense.title] = 0;
            operations.forEach(operation => {                       //это операции
                if (operation && operation.type === 'expense') {
                    if (operation.category === expense.title) {
                        expenseCatSum[expense.title] += operation.amount;
                    }
                }
            });
        });

        for (let i = 0; i < Object.keys(incomesCatSum).length; i++) {
            if (Object.values(incomesCatSum)[i] !== 0) {
                config1.data.labels.push(Object.keys(incomesCatSum)[i]);
                config1.data.datasets[0].data.push(Number(Object.values(incomesCatSum)[i]));
            }
        }
        for (let i = 0; i < Object.keys(expenseCatSum).length; i++) {
            if (Object.values(expenseCatSum)[i] !== 0) {
                config2.data.labels.push(Object.keys(expenseCatSum)[i]);
                config2.data.datasets[0].data.push(Number(Object.values(expenseCatSum)[i]));
            }
        }

        console.log(incomesCatSum);
        console.log(expenseCatSum);

        this.chart1 = new Chart(this.ctx1, config1);
        this.chart2 = new Chart(this.ctx2, config2);
    };

}