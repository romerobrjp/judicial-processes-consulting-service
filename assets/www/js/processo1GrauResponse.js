$('#processo1GrauInfo').bind('pageinit', function(event) {
	//var numProcesso = $('#valor_consulta').val();
	var numProcesso = '00520120004162';	
	consultaProcesso1Grau(numProcesso);
});

//swipes
$('#processo1GrauInfo').swipeleft(function() {
	$.mobile.changePage('#movimentacoes1GrauInfo');
});

$('#processo1GrauInfo').swiperight(function() {
	$.mobile.changePage('#partes1GrauInfo');
});

$('#partes1GrauInfo').swipeleft(function() {
	$.mobile.changePage('#processo1GrauInfo');
});

$('#partes1GrauInfo').swiperight(function() {
	$.mobile.changePage('#movimentacoes1GrauInfo');
});

$('#movimentacoes1GrauInfo').swipeleft(function() {
	$.mobile.changePage('#partes1GrauInfo');
});

$('#movimentacoes1GrauInfo').swiperight(function() {
	$.mobile.changePage('#processo1GrauInfo');
});

//consulta processo 1º grau
function consultaProcesso1Grau(numProcesso) {
	$('#lista_partes_1g').text("");
	$('#lista_movimentacoes_1g').text("");
	var msgConsultaProcesso1Grau =
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<wss:consultaProcesso1Grau>' +
		'<arg0> <numero>' + numProcesso + '</numero> </arg0>' +
		'</wss:consultaProcesso1Grau>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		contentType: 'text/xml',
		dataType: 'xml',
		contentType: 'text/xml charset="iso-8859-1"',
		data: msgConsultaProcesso1Grau,
		processData: false,
		success: function(response) {
			var xml = $(response);
			
//			if ( xml.find('nuProcesso').text() ==  '') {
//				alert('Nenhum resultado para o número de processo informado.');
//				return;
//			}
			
			//carregando infos do processo			
			$('#nuProcesso_1g').text(xml.find('nuProcesso').text());
			$('#classe_1g').text(xml.find('classe').text());
			$('#stProcesso_1g').text(xml.find('stProcesso').text());
			$('#vara_1g').text(xml.find('vara').text());
			$('#dtDistribuicao_1g').text(xml.find('dtDistribuicao').text());
			$('#vlAcao_1g').text(xml.find('vlAcao').text());
			
			//carregando infos das partes			
			xml.find('partes').each(function() {
				var nmParte = $(this).find('nmParte').text();
				var tipoParte = $(this).find('tipoParte').text();
				var stParte = $(this).find('stParte').text();
				var advogados = $(this).find('advogados').text();
				var nuDoc= $(this).find('nuDoc').text();
				
				$('#lista_partes_1g').append('<li> <h5>' + nmParte + '</h5>' + 
					'<p> Tipo: ' + tipoParte + ' </p>' +
					'<p> Situação: ' + stParte + ' </p>' +
					'<p> Advogados: ' + advogados + ' </p>' +
					'<p> Documento: ' + nuDoc + ' </p> </li>');
			});
			
			//carregando infos da movimentacoes			
			xml.find('movimentacoes').each(function() {
				var dtMovimentacao = $(this).find('dtMovimentacao').text();
				var dsMovimentacao = $(this).find('dsMovimentacao').text();
				var dsComplemento = $(this).find('dsComplemento').text();
				
				$('#lista_movimentacoes_1g').append('<li>' + 
					'<h5>' + dtMovimentacao + '</h5>' +
					'<p> Descrição: ' + dsMovimentacao + ' </p>' +
					'<p> Complemento: ' + dsComplemento + ' </p> </li>');
			});
		}
		//error: alert('Não foi possível realizar a consulta')
	});
}