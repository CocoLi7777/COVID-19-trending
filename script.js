(function() {
  var endpoint =
    'https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu&country_code=AU&timelines=true';
  var loader = document.getElementById('loading');

  async function callRemoteApi(endpoint) {
    const response = await fetch(endpoint);
    return await response.json();
  }

  async function init() {
    var rawData = await callRemoteApi(endpoint);
    console.log(rawData.locations);
    drawTotolPieChart(rawData.locations, 'latestUpdate', 'confirmed');
    drawLineChartByNewCase(
      rawData.locations,
      'newCase',
      'confirmed',
      'New Case'
    );
    drawLineChartByStates(
      rawData.locations,
      'totalCase',
      'confirmed',
      'Total infected'
    );
    drawLineChartByStates(
      rawData.locations,
      'totalDeath',
      'deaths',
      'Total death'
    );
    // data for recovered is not correct
    //drawLineChartByStates(rawData.locations, 'totalRecovered', 'recovered', 'Total recovered')

    loader.style.display = 'none';
  }
  function mapState(state) {
    switch (state) {
      case 'Australian Capital Territory':
        return 'ACT';
        break;
      case 'New South Wales':
        return 'NSW';
        break;
      case 'Northern Territory':
        return 'NT';
        break;
      case 'South Australia':
        return 'SA';
        break;
      case 'Tasmania':
        return 'TAS';
        break;
      case 'Victoria':
        return 'VIC';
        break;
      case 'Western Australia':
        return 'WA';
        break;
      case 'Queensland':
        return 'QLD';
        break;
    }
  }

  function mapStateData(stateData, key) {
    var allDates = Object.keys(stateData.timelines[key].timeline);
    var allDatesValues = Object.values(stateData.timelines[key].timeline);
    var lastTenDays = allDates
      .slice(allDates.length - 10, allDates.length - 1)
      .map(value => {
        return value.split('T')[0];
      });

    var lastTenDaysValues = allDatesValues.slice(
      allDatesValues.length - 10,
      allDatesValues.length - 1
    );
    var lastTenDaysNewCaseValues = lastTenDaysValues.map((item, index, arr) => {
      return item - arr[index - 1];
    });
    //console.log(lastTenDaysNewCaseValues.slice(1, 8));

    return {
      days: lastTenDays,
      values: lastTenDaysValues,
      newCaseNum: lastTenDaysNewCaseValues.slice(1, 9),
      title: mapState(stateData.province),
      num: stateData.latest[key],
      confirm: stateData.latest[key]
    };
  }

  function drawTotolPieChart(rawData, containerId, category) {
    var ctx = document.getElementById(containerId).getContext('2d');
    var formatedData = rawData.map(value => {
      return mapStateData(value, category);
    });
    var data = {
      labels: formatedData.map(state => {
        return `${state.title}: ${state.num}`;
      }),
      datasets: [
        {
          data: formatedData.map(state => {
            return state.confirm;
          }),
          backgroundColor: [
            '#6c5ce7',
            '#ffcd56',
            '#e17055',
            '#00b894',
            '#d63031',
            '#00cec9',
            '#74b9ff',
            '#e84393'
          ]
        }
      ]
    };
    var options = {
      title: {
        display: true,
        text: 'Confirmed Number'
      },
      legend: {
        position: 'left',
        align: 'start'
      }
    };
    renderChart(ctx, 'doughnut', data, options);
  }

  function drawLineChartByNewCase(rawData, containerId, category, title) {
    var ctx = document.getElementById(containerId).getContext('2d');
    var formatedData = rawData.map(value => {
      return mapStateData(value, category);
    });
    var data = {
      labels: formatedData[0].days,
      datasets: formatedData.map(state => {
        return {
          label: `${state.title}: ${
            state.newCaseNum[state.newCaseNum.length - 1]
          }`,
          fill: false,
          data: state.newCaseNum
        };
      }),
      backgroundColor: [
        '#6c5ce7',
        '#ffcd56',
        '#e17055',
        '#00b894',
        '#d63031',
        '#00cec9',
        '#74b9ff',
        '#e84393'
      ]
    };
    var options = {
      title: {
        display: true,
        text: title
      }
    };
    renderChart(ctx, 'line', data, options);
  }

  function drawLineChartByStates(rawData, containerId, category, title) {
    var ctx = document.getElementById(containerId).getContext('2d');
    var formatedData = rawData.map(value => {
      return mapStateData(value, category);
    });
    var data = {
      labels: formatedData[0].days,
      datasets: formatedData.map(state => {
        return {
          label: state.title,
          fill: false,
          data: state.values
        };
      })
    };
    var options = {
      title: {
        display: true,
        text: title
      }
    };
    renderChart(ctx, 'line', data, options);
  }

  init();

  function renderChart(ctx, type, data, options) {
    var chart = new Chart(ctx, {
      type: type,
      data: data,
      options: options ? options : {}
    });
  }
})();
