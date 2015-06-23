var sonido = new Audio();
sonido.src="../audio/mensaje.wav";
var socket = io.connect('http://192.168.52.22:8080');
socket.on('connect', function(){
	socket.emit('adduser', document.getElementById("nombre").value);
});

socket.on('updatechat', function (username, data) {
	$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
	sonido.play();
	var objDiv = document.getElementById("conversation");
	objDiv.scrollTop = objDiv.scrollHeight;
});

socket.on('updateusers', function(data) {
	$('#users').empty();
	$.each(data, function(key, value) {
		$('#users').append('<div style="font-size:16px"> <img src="../img/on.png"/>&nbsp;&nbsp;' + key + ' &nbsp;</div>');
	});
});


	$(function(){
		$('#datasend').click( function() {
			var message = $('#data').val();
			if(message.length<=0){
				
			}else{
				$('#data').val('');
				$('#data').focus();
				socket.emit('sendchat', message);
			}
		});
		$('#data').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('#datasend').focus().click();
			}
		});
	});
