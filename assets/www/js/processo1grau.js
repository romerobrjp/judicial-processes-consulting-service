//consulta processo 1� grau
function consultaProcesso1Grau() {
	$('#lista_partes').text("");
	$('#lista_movimentacoes').text("");
	var msgConsultaProcesso1Grau = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<wss:consultaProcesso1Grau>' +
		'<arg0> <numero>00520120004162</numero> </arg0>' +
		'</wss:consultaProcesso1Grau>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		contentType: 'text/xml',
		dataType: 'xml',
		contentType: 'text/xml charset="utf-8"',
		data: msgConsultaProcesso1Grau,
		processData: false,
		success: function(response) {
			var xml = $(response);
//			var responseJson = xml2json.parser(xml);
//			alert(responseJson.nuProcesso);
			
			//carregando infos processo
			
			$('#nuProcesso_1g').text(xml.find('nuProcesso').text());
			$('#classe_1g').text(xml.find('classe').text());
			$('#stProcesso_1g').text(xml.find('stProcesso').text());
			$('#vara_1g').text(xml.find('vara').text());
			$('#dtDistribuicao_1g').text(xml.find('dtDistribuicao').text());
			$('#vlAcao_1g').text(xml.find('vlAcao').text());
			
			//carregando infos das partes
			
			xml.find('partes_1g').each(function() {
				var nmParte = $(this).find('nmParte').text();
				var tipoParte = $(this).find('tipoParte').text();
				var stParte = $(this).find('stParte').text();
				var advogados = $(this).find('advogados').text();
				var nuDoc= $(this).find('nuDoc').text();
				
				$('#lista_partes_1g').append('<li> <h45>'+nmParte+'</h5>' + 
						'<p> Tipo: ' + tipoParte + ' </p>' +
						'<p> Situa��o: ' + stParte + ' </p>' +
						'<p> Advogados: ' + advogados + ' </p>' +
						'<p> Documento: ' + nuDoc + ' </p>' +						
						+'</li>');
			});
			
			//carregando infos da movimentacoes
			
			xml.find('movimentacoes_1g').each(function() {
				var dtMovimentacao = $(this).find('dtMovimentacao').text();
				var dsMovimentacao = $(this).find('dsMovimentacao').text();
				var dsComplemento = $(this).find('dsComplemento').text();
				
				$('#lista_movimentacoes_1g').append('<li>' + 
						'<p> Data movimenta��o: ' + dtMovimentacao + ' </p>' +
						'<p> Descri��o: ' + dsMovimentacao + ' </p>' +
						'<p> Complemento: ' + dsComplemento + ' </p>' +
						+'</li>');
			});
		}
		//failure: alert('N�o foi poss�vel realizar a consulta')
	});
}

$('#processo1GrauInfo').live('pageshow', function(event) {
	consultaProcesso1Grau();
});