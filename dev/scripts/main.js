/*
    __                     __  __  _                                   __  __                                  
   / /   __  ___  ______  / /_/ /_(_)________ _   _      _____  ____ _/ /_/ /_  ___  _________ ___  ____ _____ 
  / /   / / / / |/_/ __ \/ __/ __/ / ___/ __ `/  | | /| / / _ \/ __ `/ __/ __ \/ _ \/ ___/ __ `__ \/ __ `/ __ \
 / /___/ /_/ />  </ /_/ / /_/ /_/ / /__/ /_/ /   | |/ |/ /  __/ /_/ / /_/ / / /  __/ /  / / / / / / /_/ / /_/ /
/_____/\__,_/_/|_|\____/\__/\__/_/\___/\__,_/    |__/|__/\___/\__,_/\__/_/ /_/\___/_/  /_/ /_/ /_/\__,_/ .___/ 
                                                                                                      /_/        
*/

import * as polyfil from "./modules/polyfil";
import ENV from './modules/Config';
import ImgPreloader from './modules/Preloader';
import {walkthrough} from './modules/walkthrough';
import {getForecast} from './modules/weather';

/*const Preloader = new ImgPreloader();
Preloader.load().then((response) => {

});*/

(function(){

    walkthrough.init(getForecast);

    if(window.DeviceOrientationEvent){
        window.addEventListener('deviceorientation', function(event) {
            document.getElementById('beta').innerHTML = Math.round(event.beta);
            document.getElementById('gamma').innerHTML = Math.round(event.gamma);
            document.getElementById('alpha').innerHTML = Math.round(event.alpha);
            document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
        }, true);
    }

})();