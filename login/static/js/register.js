$(document).ready(function() {
	$('#register-form').submit(function() {
		$.ajax({
			url: $('#register-form').attr('action'),
			type: $('#register-form').attr('method'),
			data: $('#register-form').serialize(),
			success: function(data) {
				if (data.failed){
					setError(data.failed)
					return false;
				} else {
					window.location = '/';
				}
			}
		});
		return false;
	});
});

$(function() {
	dateInput = $('#datepicker').pickadate({
		format: 'dddd, mmmm dd, yyyy',
		formatSubmit: 'yyyy-mm-dd',
		hiddenSuffix: '',
		today: '',
		  selectYears: true,
	})
});

function setError(error) {
	$('#errors span').text(error)
}
