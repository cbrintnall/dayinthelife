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
    tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
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

$('.noUi-value.noUi-value-horizontal.noUi-value-large').each(function() {
    var val = $(this).html();
    val = recountVal(parseInt(val));
    $(this).html(val);
});

function recountVal(val){
    switch(val){
        case 0: return '12:00 AM'; break;
        case 6: return '6:00 AM'; break;
        case 12: return '12:00 PM'; break;
        case 18: return '6:00 PM'; break;
        case 24: return '12:00 AM'; break;
    }
}

