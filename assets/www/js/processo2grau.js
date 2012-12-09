//consulta processo 2� grau
function consultaProcesso2Grau() {
	$('#lista_partes').text("");
	$('#lista_movimentacoes').text("");
	var msgConsultaProcesso2Grau = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<wss:consultaProcesso2Grau>' +
		'<arg0> <numero>88820040049115001</numero> </arg0>' +
		'</wss:consultaProcesso2Grau>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

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
			
			//carregando infos do processo
			
			$('#nuProcesso_2g').text(xml.find('nuProcesso').text());
			$('#nuProcesso1Grau_2g').text(xml.find('nuProcesso1Grau').text());
			$('#classe_2g').text(xml.find('classe').text());
			$('#dtDistribuicao_2g').text(xml.find('dtDistribuicao').text());			
			$('#vara_2g').text(xml.find('vara').text());
			$('#nmOrgao_2g').text(xml.find('nmOrgao').text());
			$('#tpDistribuicao_2g').text(xml.find('tpDistribuicao').text());
			$('#nmLocal_2g').text(xml.find('nmLocal').text());
			$('#nmVolume_2g').text(xml.find('nmVolume').text());
			$('#dtEntrada_2g').text(xml.find('dtEntrada').text());
			$('#nmRelator_2g').text(xml.find('nmRelator').text());
			
			//carregando infos das partes
			
			xml.find('partes').each(function() {
				var nmParte = $(this).find('nmParte').text();
				var tipoparte = $(this).find('tipoparte').text();
				
				$('#lista_partes_2g').append('<li> <h5>'+nmParte+'</h5>' + 
						'<p> Tipo: ' + tipoparte + ' </p> </li>');
			});
			
			//carregando infos da movimentacoes
			
			xml.find('movimentacoes').each(function() {
				var dtMovimentacao = $(this).find('dtMovimentacao').text();
				var dsMovimentacao = $(this).find('dsMovimentacao').text();
				
				$('#lista_movimentacoes_2g').append('<li>' + 
						'<h5>' + dtMovimentacao + '</h5>' +
						'<p>' + dsMovimentacao + '</p>' +
						'</li>');
			});
		}
		//failure: alert('N�o foi poss�vel realizar a consulta')
	});
}

$('#processo2GrauInfo').live('pageshow', function(event) {
	consultaProcesso2Grau();
});