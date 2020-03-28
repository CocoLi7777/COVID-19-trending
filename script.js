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
        drawLineChartByStates(rawData.locations, 'totalCase', 'confirmed', 'Total infected')
        drawLineChartByStates(rawData.locations, 'totalDeath', 'deaths', 'Total death')
        // data for recovered is not correct
        //drawLineChartByStates(rawData.locations, 'totalRecovered', 'recovered', 'Total recovered')


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

    function mapStateData(stateData, key) {
        var allDates = Object.keys(stateData.timelines[key].timeline);
        var allDatesValues =  Object.values(stateData.timelines[key].timeline);
        var lastTenDays = allDates.slice(allDates.length-10, allDates.length -1).map( value => {
            return value.split('T')[0]
        });
        var lastTenDaysValues = allDatesValues.slice(allDatesValues.length-10, allDatesValues.length -1);

        return {
            days: lastTenDays,
            values: lastTenDaysValues,
            title: stateData.province
        }
    }

    function drawLineChartByStates(rawData, containerId, category, title) {
        var ctx = document.getElementById(containerId).getContext('2d');
        var formatedData = rawData.map( value => {
            return mapStateData(value, category)
        })
        var data = {
            labels: formatedData[0].days,
            datasets: 
            formatedData.map( state => {
                return {
                    label: state.title,
                    fill: false,
                    data: state.values
                }
            })
        }
        var options = {
            title: {
                display: true,
                text: title
            }
        }
        renderChart(ctx, 'line', data ,options);
    }

    init();



    function renderChart(ctx, type, data, options) {
        var chart = new Chart(ctx, {
            type: type,
            type: type,
            data: data,
            options: options ? options: {}
        });
    }
})();

