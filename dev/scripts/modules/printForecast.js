export const printForecast = (result, node) => {

    // Empty the node to update data
    node.querySelector('.forecastList').innerHTML = '';

    // Current forecast
    node.querySelector('.currentWeatherLabel').innerHTML = `${result.data.current.weather[0].main}`; // Ex: Sunny
    node.querySelector('.currentWeatherTemp').innerHTML = `${Math.round(result.data.current.temp)}°`; // Ex: 10°
    node.querySelector('.currentWeatherMinMax').innerHTML = `${Math.round(result.data.daily[0].temp.min)}°/${Math.round(result.data.daily[0].temp.max)}°`; //Ex 10°/22°

    /*console.log({
        "label" : result.data.current.weather[0].main,
        "temp" : Math.round(result.data.current.temp),
        "minmax" : `${Math.round(result.data.daily[0].temp.min)}°/${Math.round(result.data.daily[0].temp.max)}°`
    })*/

    // Cycle throught data / days and make the html
    for(let i=1; i<=7; i++){

        let dayCtn = document.createElement('div')
            dayCtn.classList.add('daily');
            
            let dailyLabel = document.createElement('span');
            dailyLabel.classList.add('daily__label');
            dailyLabel.innerHTML = getDate(result.data.daily[i].dt).dayName;
            dayCtn.innerHTML += dailyLabel.outerHTML;
        
        let weatherIcon = document.createElement('img');
            weatherIcon.classList.add('daily__icon');
            weatherIcon.src=`http://openweathermap.org/img/wn/${result.data.daily[i].weather[0].icon}@2x.png`;
            dayCtn.innerHTML += weatherIcon.outerHTML;

        let dailyMinMax = document.createElement('span');
            dailyMinMax.classList.add('daily__minmax');
            dailyMinMax.innerHTML = `${Math.round(result.data.daily[i].temp.min)}°/${Math.round(result.data.daily[i].temp.max)}°`;
            dayCtn.innerHTML += dailyMinMax.outerHTML;
        
        node.querySelector('.forecastList').innerHTML += dayCtn.outerHTML;
    }
}

const getDate = (timestamp) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let date = new Date(timestamp * 1000)

    return {
        'dayName' : days[date.getDay()]
    }
}