/*
	Simple ajax request that logs the user in with
	some form data, supplied in login.html
*/
$(document).ready(function() {
	$('#login-form').submit(function() {
		$.ajax({
			url: $(this).attr('action'),
			type: $(this).attr('method'),
			data: $(this).serialize(),
			success: function(data) {
				if (data.success) {
					window.location = '/'
				} else {
					setErrors(data.failed)
				}
			}
		})
		return false;
	})
})

//Sets the errors for the user page.
function setErrors(error) {
	$('#error span').text(error)
}
