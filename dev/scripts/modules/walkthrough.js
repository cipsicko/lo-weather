import {printForecast} from './printForecast';
import {wave} from './wave';
import {Swipe} from './Swipe';

export const walkthrough = {
    callback : null,
    index : 0,
    dots : document.querySelectorAll('.dot'),
    screens : document.querySelectorAll('.screen'),
    nextBtn : document.querySelector('.next-screen'),
    prevBtn : document.querySelector('.prev-screen'),

    nextScreen : () => {
        if (walkthrough.index < walkthrough.indexMax()){
            walkthrough.index++;
            walkthrough.updateScreen();
        }
    },

    prevScreen : () => {
        if (walkthrough.index > 0){
            walkthrough.index--;
            walkthrough.updateScreen();
        }
    },

    updateScreen : () => {
        walkthrough.reset();
        walkthrough.goTo(walkthrough.index);
        walkthrough.setBtns();
        walkthrough.runCallBack();
    },

    setBtns : () => {

        if( walkthrough.index == walkthrough.indexMax() ){
            walkthrough.nextBtn.setAttribute('disabled', 'true');
            walkthrough.prevBtn.removeAttribute('disabled');
        } else if (walkthrough.index == 0) {
            walkthrough.nextBtn.removeAttribute('disabled');
            walkthrough.prevBtn.setAttribute('disabled', 'true');
        } else {
            walkthrough.nextBtn.removeAttribute('disabled');
            walkthrough.prevBtn.removeAttribute('disabled');
        }
    },

    goTo : (index) => {
        walkthrough.screens[index].classList.add('active');
        walkthrough.dots[index].classList.add('active');
    },

    reset : () => {
        for( let i=0; i< walkthrough.screens.length; i++ ){
            walkthrough.screens[i].classList.remove('active');
            walkthrough.dots[i].classList.remove('active');
        }
    },
    
    indexMax : () => {
        return document.querySelectorAll('.screen').length-1;
    },

    runCallBack : () => {
        let activeCity = walkthrough.screens[walkthrough.index].getAttribute('data-city');
        if(walkthrough.callBack){
            walkthrough.callBack(activeCity)
                .then( (result) => {
                    printForecast(result,  walkthrough.screens[walkthrough.index]);
                    wave(walkthrough.index);
                },
                (err) => {
                    // on error
                })
        }
    },

    init : (callback) => {

        walkthrough.callBack = callback;
        walkthrough.runCallBack();

        document.querySelector('.next-screen').addEventListener('click', (ev)=>{
            walkthrough.nextScreen();
        });

        document.querySelector('.prev-screen').addEventListener('click', (ev)=>{
            walkthrough.prevScreen();
        });

        document.addEventListener('swiped', function(e) {
            console.log(e.detail.dir)
            if( e.detail.dir === 'left' ){
                walkthrough.nextScreen();
            }
            if( e.detail.dir === 'right' ){
                walkthrough.prevScreen();
            }
        });
    }
}