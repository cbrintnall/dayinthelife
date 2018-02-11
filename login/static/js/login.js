$(document).ready(function() {
	$('#register').click(function() {
		$.ajax({
			url: '/auth/api/register/',
			type: 'POST',
			data: {
				username: 'brintnc',
				password: 'test',
				email: 'test@test.com',
				first: 'Christian',
				last: 'Brintnall',
				dob: '1994-12-23',
				timezone: 'PST',
				csrfmiddlewaretoken: $('#csrf-token').val()
			},
			success: function(data) {
				console.log(data);
			}
		});
	});
});