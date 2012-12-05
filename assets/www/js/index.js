document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	consultaProcesso2Grau();
}

function limparInputConsulta() {
    $('#valor_consulta').val("");
}

function gerenciaOpcoesComboboxOab() {
    if ($('#tipoConsulta').val() == 'num_oab') {
    	alert($('#tipoConsulta').val())
        $('#div_letra').css('display', 'block');
        $('#div_estado').css('display', 'block');
    }
    else {
    	alert($('#tipoConsulta').val())
        $('#div_letra').css('display', 'none');
        $('#div_estado').css('display', 'none');
    }
}

var msgConsultaProcesso2Grau = 
	'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
	'<soapenv:Header/>' + 
	'<soapenv:Body>' +
	'<wss:consultaProcesso2Grau>' +
	'<arg0> <numero>99920110006957001</numero> </arg0>' +
	'</wss:consultaProcesso2Grau>' +
	'</soapenv:Body>' +
	'</soapenv:Envelope>';

function consultaProcesso2Grau() {
	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		contentType: 'text/xml',
		dataType: 'xml',
		contentType: 'text/xml charset="utf-8"',
		data: msgConsultaProcesso2Grau,
		processData: false,
		success: function(response) {
			var xml = $(response);
			var classe = xml.find('classe').text();
			alert(classe);
		},
		error: alert('Não foi possível realizar a consulta');
	});
}