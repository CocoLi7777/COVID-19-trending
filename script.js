(function() {
    var endpoint = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu&country_code=AU&timelines=true';
    var loader = document.getElementById('loading');

    async function callRemoteApi(endpoint) {
        const response = await fetch(endpoint);
        return await response.json();
    }

    async function init() {
        var rawData = await callRemoteApi(endpoint);
        console.log(rawData);
        drawTotolPieChart(rawData.latest);
        drawTotalCaseByStates(rawData.locations);
        loader.style.display = 'none';
    }

    function drawTotolPieChart(rawData) {
        var ctx = document.getElementById('latestUpdate').getContext('2d');
        var data = {
            labels: Object.keys(rawData).map( value => {
                return value.toUpperCase()
            }),
            datasets: [{
                data: [rawData.confirmed, rawData.deaths, rawData.recovered],
                backgroundColor: [ '#ffcd56', '#fe6384', '#37a2eb']
            }]
        }
        var options = {
            title: {
                display: true,
                text: 'Latest update'
            }
        }
        renderChart(ctx, 'doughnut', data ,options);
    }

    function drawTotalCaseByStates(rawData) {
        var ctx = document.getElementById('totalCase').getContext('2d');
        var data = {
            labels: Object.keys(rawData[0].timelines.confirmed.timeline).map( value => {
                return value.split('T')
            }),
            datasets: [{
                data: [rawData.confirmed, rawData.deaths, rawData.recovered],
                backgroundColor: [ '#ffcd56', '#fe6384', '#37a2eb']
            }]
        }
        var options = {
            title: {
                display: true,
                text: 'Total case trending'
            }
        }
        renderChart(ctx, 'line', data ,options);
    }

    init();

    var ctx = document.getElementById('totalDeath').getContext('2d');
    var totalDeath = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var ctx = document.getElementById('dailyIncrease').getContext('2d');
    var data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3]
        }]
    };

    renderChart(ctx, 'line', data, null)

    function renderChart(ctx, type, data, options) {
        var chart = new Chart(ctx, {
            type: type,
            type: type,
            data: data,
            options: options ? options: {}
        });
    }
})();

