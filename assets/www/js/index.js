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
	'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"'+ 
	'xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
	'<soapenv:Header/>' + 
	'<soapenv:Body>' +
	'<wss:consultaProcesso2Grau xmlns="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
	'<arg0> <numero>99920110006957001</numero> </arg0>' +
	'</wss:consultaProcesso2Grau>' +
	'</soapenv:Body>' +
	'</soapenv:Envelope>';

function consultaProcesso2Grau() {
	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		dataType: 'xml',
		contentType: 'text/xml',
		data: msgConsultaProcesso2Grau,
		success: function(xmlHttpRequest, status) {
			alert("sucessando");
			$(xmlHttpRequest.responseXML).find('consultaProcesso2GrauResponse').each(function() {
				var resposta = $(this).find('Processo').find('classe').text();
			});
			alert(resposta);
		},
		failure: alert('DEU AGUIA')		
	});
}

function resultado(xmlHttpRequest, status) {
	$(xmlHttpRequest.responseXML).find('consultaProcesso2GrauResponse').each(function() {
		var resposta = $(this).find('Processo').text();
	});
	alert(resposta);
}