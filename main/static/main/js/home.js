var slider = document.getElementById('slider');

slider.margin = '20 auto 30px';
var slider_range = {
	'min': [ 0, 15],
	'max': [1440]
};

noUiSlider.create(slider, {
    start: [360, 720],
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

$('.noUi-value.noUi-value-horizontal.noUi-value-large').each(function() {
    var val = $(this).html();
    val = recountVal(parseInt(val));
    $(this).html(val);
});

/*
$("div.noUi-handle.noUi-handle-lower").noUi-state-drag(function(){
    console.log("Dragging...");
    var L = $("div.noUi-handle.noUi-handle-lower").offset();
    var R = $("div.noUi-handle.noUi-handle-upper").offset();
    var mid = L.left + (L.left + R.left) / 2;
    $("#line").css({
        'position' : 'absolute',
        'left': mid,
        'top': R.top
    });
});
*/
slider.noUiSlider.on('slide', function(){
    var L = $("div.noUi-handle.noUi-handle-lower").offset();
    var R = $("div.noUi-handle.noUi-handle-upper").offset();
    var mid = L.left + ((R.left - L.left) / 2) + 16;
    $("#line").css({
        'position' : 'absolute',
        'left': mid,
        'top': R.top + 10
    });
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



