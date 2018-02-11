$(document).ready(function() {

	$(window).resize(setTitleSize);

	//Settings for tags lib
	$('#tags-form').tagEditor({
		maxLength: 256,
		forceLowercase: true,
		clickDelete: true,
	});

	//Fades in the page over a second span
	runPage()

	//Handles the user hitting the submit button
	$('#upload-button').click(function() {
		//This takes in form data and sends it to create an album..
		var title = $('#title-form').val();
		var tags = $('#tags-form').val();
		var description = $('#description-form').val();
		var tz = $('#timezone-form').val();

		$.ajax({
			url: '/api/album/?tags=' + tags + '&description=' + description + '&title=' + title,
			type: 'GET',
			//On success, it then sends it off to uploading photos
			success: function(data) {
				if (data.success) {
					uploadPictures(data.success, tz)
				} else {

				}
			}
		})

	});
})

/*
	Upload pictures uses fineuploaders chunkloading system.
	After uploading the files (or during due to async), we then 
	create entries in the database stating where they are stored
	and what timezone they were uploaded in.
*/
function uploadPictures(key, timezone) {
	default_concurrent_chunked_uploader.uploadStoredFiles();
	default_concurrent_chunked_uploader.getUploads().forEach(function(element){
		$.ajax({
			url: '/api/photo/' + key + '/?path=/' + element.uuid + '/' + element.originalName + '&tz=' + timezone,
			type: 'GET',
			success: function(data) {

			}
		})
	});
}

//Just measures the title size
function setTitleSize() {
	var title_width_comp = $('#title').width()
	var title_txt = $('#title span span').width()
	var input_width = (Math.floor(title_width_comp) - Math.floor(title_txt)).toString();

	$('.txt').css({
		'width': input_width + 'px'
	})
}

function runPage(){
	$('body').animate({
		'opacity':'1.0'
	}, 1000)
}

function getTitle() {
	return $('#title-form').val()
}

//Called via django with the jinja2 templating, loads a selection table of all timezones.
function addOptionToTimezone(option) {
	$('#timezone-form').append('<option>' + option + '</option>');
}