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
	'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+ 
	'xmlns:xsd="http://www.w3.org/2001/XMLSchema"' + 
	'xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/">' +
	'<soap:Body>' +
	'<consultaProcesso2Grau xmlns="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
	'<arg0> 99920110006957001 </arg0>' +
	'</consultaProcesso2Grau>' +
	'</soap:Body>' +
	'</soap:Envelope>';

function consultaProcesso2Grau() {
	alert(msgConsultaProcesso2Grau);
	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		dataType: 'xml',
		contentType: 'text/xml; charset=utf-8',
		data: msgConsultaProcesso2Grau,
		success: function(xmlHttpRequest, status) {
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