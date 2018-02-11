var pictures;
var srcs = {};
var currentIndex = 0;

$('#up').click(function() {
	moveRight();
})

$('#down').click(function() {
	moveLeft();
})

function loadImages() {
	$.ajax({
		url: '/api/public/?album_id=' + id,
		type: 'GET',
		success: function(data) {
			pictures = data;
			var counter = 0;
			pictures.albums[0].photos.forEach(function (element){
				srcs[counter.toString()] = element.photo_path;
				counter++;
			})

			setImage(currentIndex);
		}
	})
}

function setImage(index) {
	$('#current_image').attr('src', '/media/' + srcs[index.toString()]);
	console.log(currentIndex)
}

function moveRight() {
	if (currentIndex >= Object.keys(srcs).length - 1) {
		return;
	}

	currentIndex++;
	setImage(currentIndex);
}

function moveLeft() {
	if (currentIndex <= 0) {
		return;
	}

	currentIndex--;
	setImage(currentIndex);
}