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

function preparePage() {
    
    st="00:00";
    nd="23:59";

    var square_count = 0;
    var random_boolean;
    var count = 0;

    $.ajax({
        url: '/api/public/?photo_time_start='+st+'?photo_time_end='+nd,
        type: "GET",
        success: function(data) {
            console.log(data);
        }
    });


    while(square_count < 15){
        random_boolean = Math.random() >= 0.66;
        if(random_boolean && square_count % 5 < 4){
            $('.grid').append($('<div>',{class:'blankimg wide',id:count}));
            square_count = square_count + 2;
        }
        else{
            $('.grid').append($('<div>',{class:'blankimg',id:count}));
            square_count = square_count + 1;
        }
        count = count + 1;
    }

    var photos = JSON.parse(data);
    console.log(photos);

    var i;
    for (i=0; (i < photos.length && i < count); ++i){
        $('#' + i).prepend($('<img>',{id:i,src:photos[i]}))
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
