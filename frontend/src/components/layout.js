export class Layout {
    constructor(newRoute) {
        this.route = newRoute;
        this.labelForChange = document.getElementById('lable-for-change');

        this.showSideBar();
        this.activateSideBar();
        this.showGraphs();
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
        });
    };

    showGraphs() {
        if (this.route.template.includes('dashboard')) {
            console.log(this.route);
            const ctx1 = document.getElementById('myChart-1');
            const ctx2 = document.getElementById('myChart-2');
            const config = {
                type: 'pie',
                data: {
                    labels: [
                        'Red',
                        'Orange',
                        'Yellow',
                        'Green',
                        'Blue'
                    ],
                    datasets: [{
                        label: 'Dataset 1',
                        data: [20, 50, 5, 15, 10],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 205, 86)',
                            'rgb(246,246,50)',
                            'rgb(100,217,53)',
                            'rgb(54, 162, 235)',
                        ],
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
                    // radius: 100,
                    borderAlign: 'center'

                }
            };
            new Chart(ctx1, config);
            new Chart(ctx2, config);
        }
    };
}