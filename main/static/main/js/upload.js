$(document).ready(function() {

	setTitleSize();

	$(window).resize(setTitleSize);

	$('#title-form').keyup(function(data) {
		var font_size = $(this).css('font-size');
		font_size = font_size.replace('p','');
		font_size = font_size.replace('x','');
		font_size = parseInt(font_size)

		var len = $(this).val().length * font_size
	});

	runPage()

	$('#upload-button').click(function() {
		
		var title = $('#title-form').val()
		var tags = $('#tags-form').val()
		var description = $('#description-form').val()

		$.ajax({
			url: '/api/album/?tags=' + tags + '&description=' + description + '&title=' + title,
			type: 'GET',
			success: function(data) {
				if (data.success) {
					uploadPictures(data.success)
				} else {

				}
			}
		})

	});
})

function uploadPictures(key) {
	default_concurrent_chunked_uploader.uploadStoredFiles();
	default_concurrent_chunked_uploader.getUploads().forEach(function(element){
		$.ajax({
			url: '/api/photo/' + key + '/?path=/' + element.uuid + '/' + element.originalName,
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

	$('#title-form').css({
		'width': input_width + 'px'
	})

	$('#underline').css({
		'left': title_txt + 'px'
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