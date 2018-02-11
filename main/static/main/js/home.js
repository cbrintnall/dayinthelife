var slider = document.getElementById('slider');

slider.margin = '20 auto 30px';
var slider_range = {
	'min': [ 0, 1],
	'max': [24]
};

noUiSlider.create(slider, {
    start: [6, 12],
    behaviour: 'drag-tap',
    connect: true,
    range: slider_range,
    tooltips: true,
    steps: 24,
    pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 4,
        stepped: true,
    },
});

