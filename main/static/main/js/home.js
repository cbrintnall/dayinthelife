preparePage();

var slider = document.getElementById('slider');

var now = new Date();
var time_start = (now.getHours() - 1) * 60;
var time_end = (now.getHours() + 1) * 60;

var st;
var nd;

if (time_start < 0) {
    time_start = 0;
    time_end = 60 * 2;
}

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
    pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 4,
        stepped: false,
        format: wNumb({
            decimals: 0
        })
    },
});

slider.noUiSlider.on('change', function(data){
    st = parseInt(data[0])
    nd = parseInt(data[1])

    console.log(st)
    console.log(nd)
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

var modal = document.getElementById('album-view');
var span = document.getElementsByClassName("close")[0];
$('.gridimg').click(function() {
    modal.style.display = "block";
});

span.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

$('#logout-form').submit(function() {
    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: $(this).serialize(),
        success: function(data) {
            console.log('success')
            window.location = '/';
            return false;
        }
    });
    return false;
});
