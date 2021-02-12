export default class ImgPreloader {

    constructor(debug){
        debug = debug || true;
        const elements = document.querySelectorAll('[data-js-preload]');

        this.load = () => {
            return new Promise((resolve, reject) => {
                if( !elements.length ) return;

                debug && console.info("PRELOADER - initialize", this);

                let imageArr = new Array(elements.length).fill().map(e => ( new Image() ));
                let loadedImages = 0;

                debug && console.info("PRELOADER - array mapping", imageArr);

                imageArr.map((image, idx) => {
                    image.onload = (img) => {
                        loadedImages++;
                        debug && console.info("PRELOADER - image loaded", img);

                        elements[idx].src = elements[idx].dataset.jsPreload;
                        if( loadedImages === elements.length ){
                            debug && console.info("PRELOADER - resolving promise");
                            resolve(imageArr)
                        }
                    };

                    image.onerror = (err) => console.error("Error loading image: ", err);

                    image.src = elements[idx].dataset.jsPreload;
                })

            })
        }
    }
}