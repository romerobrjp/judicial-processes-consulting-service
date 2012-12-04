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
	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		data: msgConsultaProcesso2Grau,
		complete: resultado,
		contentType: 'text/xml; charset="utf-8"'
	});
}

function resultado(xmlHttpRequest, status) {
	$(xmlHttpRequest.responseXML).find('consultaProcesso2GrauResponse').each(function() {
		var resposta = $(this).find('Processo').text();
	}
	alert(resposta);
}