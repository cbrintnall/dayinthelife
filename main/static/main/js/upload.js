$(document).ready(function() {

	$(window).resize(setTitleSize);

	$('#tags-form').tagEditor({
		maxLength: 256,
		forceLowercase: true,
		clickDelete: true,
	});

	runPage()

	$('#upload-button').click(function() {
		
		var title = $('#title-form').val();
		var tags = $('#tags-form').val();
		var description = $('#description-form').val();
		var tz = $('#timezone-form').val();

		$.ajax({
			url: '/api/album/?tags=' + tags + '&description=' + description + '&title=' + title,
			type: 'GET',
			success: function(data) {
				if (data.success) {
					uploadPictures(data.success, tz)
				} else {

				}
			}
		})

	});
})

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

function addOptionToTimezone(option) {
	$('#timezone-form').append('<option>' + option + '</option>');
}