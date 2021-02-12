const axios = require('axios');

const ENDPOINT = "https://api.openweathermap.org/data/2.5/onecall?";
const EXCLUDE = "minutely,hourly,alerts"
const APIKEY = "bb721fcb5b39795ce20f33040a45f036"
const COORDINATES = {
    "London" : ["51.5074", "0.1278"],
    "Milan" : ["45.4642", "9.1900"],
    "Bangkok" : ["13.7563", "100.5018"],
    "LosAngeles" : ["34.0522", "118.2437"],
    "Nairobi" : ["1.2921", "36.8219"]
}

export const getForecast = (location) => {

    return new Promise( (resolve, reject) => {
        console.log(`Getting data for: ${location}`)
        axios.get(`${ENDPOINT}&lat=${COORDINATES[location][0]}&lon=${COORDINATES[location][1]}&exclude=${EXCLUDE}&units=metric&appid=${APIKEY}`)
            .then( (response) => {
                console.log(`API Call Success`)
                resolve(response);
            })
            .catch( (error) => {
                console.warn(`Error on API Call: ${error}`);
                reject(error);
            })
            .then( () => {
                console.info(`API Call ends here!`);
            })

    })
}


