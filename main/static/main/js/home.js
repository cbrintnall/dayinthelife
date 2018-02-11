var slider = document.getElementById('slider');

var now = new Date();
var time_start = (now.getHours() - 1) * 60;
var time_end = (now.getHours() + 1) * 60;

console.log(time_start);
console.log(time_end);
if (time_start < 0) {
    time_start = 0;
    time_end = 60 * 2;
}

slider.margin = '20 auto 30px';
var slider_range = {
	'min': [ 0, 15],
	'max': [1440]
};

noUiSlider.create(slider, {
    start: [time_start, time_end],
    behaviour: 'drag-tap',
    connect: true,
    range: slider_range,
    tooltips: [wNumb({}), wNumb({})],
    steps: 24,
    pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 4,
        stepped: true,
        format: wNumb({
            decimals: 0
        })
    },
});

function recountVal(val){
    switch(val){
        case 0: return '12:00 AM'; break;
        case 360: return '6:00 AM'; break;
        case 720: return '12:00 PM'; break;
        case 1080: return '6:00 PM'; break;
        case 1440: return '12:00 AM'; break;
    }
}
