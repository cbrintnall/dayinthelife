/* Get the current time and the the starting parameters for the time filter */
var now = new Date();
var time_start = (now.getHours() - 1) * 60;
var time_end = (now.getHours() + 1) * 60;

// Edge case where we manually wrap the time around
if (time_start < 0) {
    time_start = 0;
    time_end = 60 * 2;
}

// Set the slider up to 24 hours as minutes from midnight (24 * 60)
var slider_range = {
    'min': [0, 15],
    'max': [1440]
};

// Create the main slider w/ nouislider
var slider = document.getElementById('slider');
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

// Converts the pips created by noslideui into times
function recountVal(val) {
    switch (val) {
        case 0: return '12:00 AM'; break;
        case 360: return '6:00 AM'; break;
        case 720: return '12:00 PM'; break;
        case 1080: return '6:00 PM'; break;
        case 1440: return '12:00 AM'; break;
    }
}

// Toggle between the time and moment view
function togglemode() {
    var elem = document.getElementById("toggle");
    if (elem.value == "View by Time") {
        $("#toggle span").text('View by Moment');
        elem.value = "View by Moment";
    } else {
        $("#toggle span").text('View by Time');
        elem.value = "View by Time";
    }
}

var delay;
var st;
var nd;
// Filter the displayed pictures whenever the slider is changed
slider.noUiSlider.on('change', function (data) {
    if (Date.now() - delay < 20) {
        return;
    }
    delay = Date.now();
    st = parseInt(data[0] / 60) + ':' + data[0] % 60
    nd = parseInt(data[1] / 60) + ':' + data[1] % 60
    if (nd == "24:0")
        nd = '23:59'
    prepareData();
});

// Get the title of the focused image and display at the top of the page
$(document).on('mouseover', '.image', function () {
    var id = $(this).attr("id");
    $.ajax({
        url: '/api/public/?album_id=' + id,
        type: "GET",
        success: function (data) {
            $(".title").html("<h1>through the eyes of " + data.albums[0].album_title + " </h1>");
        }
    });
});

// Called when the page is first rendered, really just setting up variables
function prepareFirstPage() {
    st = "00:00";
    nd = "23:59";
    prepareData();
}

// Makes a json call to get image data
function prepareData() {
    $("div.blankimg").remove();
    $.ajax({
        url: '/api/public/?photo_time_start=' + st + '?photo_time_end=' + nd,
        type: "GET",
        success: function (data) {
            console.log(data);
            process_photos(data);
        }
    });
}

// Creates the "grid" that photos are placed in too
function process_photos(data) {
    var photos = data.photos;
    var square_count = 0;
    var random_boolean;
    var count = 0;

    while (square_count < 15) {
        random_boolean = Math.random() >= 0.66;
        if (random_boolean && square_count % 5 < 4) {
            $('.grid').append($('<div>', { class: 'blankimg wide', id: count }));
            square_count = square_count + 2;
        }
        else {
            $('.grid').append($('<div>', { class: 'blankimg', id: count }));
            square_count = square_count + 1;
        }
        count = count + 1;
    }

    var i;
    var idx;
    for (i = 0; (i < photos.length && i < count); ++i) {
        idx = Math.floor(Math.random() * Math.floor(photos.length));
        $('#' + i).prepend($('<img>', { class: 'image', id: photos[idx].photo_album_id, src: 'media/' + photos[idx].photo_path }));
    }
}

// Have clicking a image take you to its relevant album
$(document).on('click', '.image', function () {
    window.location = '/album/' + $(this).attr('id') + '/'
});

// Handle a user logout
$('#logout-form').submit(function () {
    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: $(this).serialize(),
        success: function (data) {
            console.log('success')
            window.location = '/';
            return false;
        }
    });
    return false;
});
