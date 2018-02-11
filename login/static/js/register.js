$(document).ready(function() {
	$('#register').submit(function() {
		console.log($(this).serialize())
		$.ajax({
			url: $(this).attr('action'),
			type: $(this).attr('method'),
			data: $(this).serialize(),
			success: function(data) {
				if (data.failed){
					console.log(data.failed)
				} else {
					console.log('yes')
				}
			}
		});
		return false;
	});
	/*

	*/
});