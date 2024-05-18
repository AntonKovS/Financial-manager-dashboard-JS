$("#leftside-navigation .sub-menu > a").click(function(e) {
    $("#leftside-navigation ul ul").slideUp(), $(this).next().is(":visible") || $(this).next().slideDown(),
        e.stopPropagation()
})

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
        // aspectRatio: 2,
        maintainAspectRatio: false,
        borderWidth: 0,
    }
};

new Chart(ctx1, config);
new Chart(ctx2, config);