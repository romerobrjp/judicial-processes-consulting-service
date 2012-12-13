$('#processoExecPenalInfo').bind('pageinit', function(event) {
	var numProcesso = $('#valor_consulta').val();
	//var numProcesso = '';
	consultaProcessoExecucaoPenal(numProcesso);
});

//swipes
$('#partesExecPenalInfo').swipeleft(function() {
	$.mobile.changePage('#movimentacoesExecPenalInfo');
});

$('#partesExecPenalInfo').swiperight(function() {
	$.mobile.changePage('#partesExecPenalInfo');
});

$('#partesExecPenalInfo').swipeleft(function() {
	$.mobile.changePage('#processoExecPenalInfo');
});

$('#partesExecPenalInfo').swiperight(function() {
	$.mobile.changePage('#movimentacoesExecPenalInfo');
});

$('#movimentacoesExecPenalInfo').swipeleft(function() {
	$.mobile.changePage('#partesExecPenalInfo');
});

$('#movimentacoesExecPenalInfo').swiperight(function() {
	$.mobile.changePage('#processoExecPenalInfo');
});

//consulta processo turma recursal
function consultaProcessoExecucaoPenal(numProcesso) {
	$('#lista_partes_ep').text("");
	$('#lista_movimentacoes_ep').text("");
	
	var msgConsultaProcessoJuizadoEspecial = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<wss:consultaProcessoJuizadosEspeciais>' +
		'<arg0> <numero>'+ numProcesso +'</numero> </arg0>' +
		'</wss:consultaProcessoJuizadosEspeciais>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		contentType: 'text/xml',
		dataType: 'xml',
		contentType: 'text/xml charset="iso-8859-1"',
		data: msgConsultaProcessoExecucaoPenal,
		processData: false,
		success: function(response) {
			var xml = $(response);
			
//			if ( xml.find('nuProcesso').text() ==  '') {
//				alert('Nenhum resultado para o número de processo informado.');
//				return;
//			}

			//carregando infos do processo			
			$('#nuProcesso_ep').text(xml.find('nuProcesso').text());
			$('#classe_ep').text(xml.find('classe').text());
			$('#stProcesso_ep').text(xml.find('stProcesso').text());
			$('#vara_ep').text(xml.find('vara').text());
			$('#dtDistribuicao_ep').text(xml.find('dtDistribuicao').text());
			$('#vlAcao_ep').text(xml.find('vlAcao').text());
			
			//carregando infos das partes		
			xml.find('partes').each(function() {
				var nmParte = $(this).find('nmParte').text();
				var tipoParte = $(this).find('tipoParte').text();
				var stParte = $(this).find('stParte').text();
				var advogados = $(this).find('advogados').text();
				var nuDoc= $(this).find('nuDoc').text();
				
				$('#lista_partes_ep').append('<li> <h5>'+nmParte+'</h5>' + 
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
				
				$('#lista_movimentacoes_ep').append('<li>' + 
					'<h5>' + dtMovimentacao + '</h5>' +
					'<p> Descrição: ' + dsMovimentacao + ' </p>' +
					'<p> Complemento: ' + dsComplemento + ' </p> </li>');
			});
		}
		//failure: alert('Não foi possível realizar a consulta')
	});
}