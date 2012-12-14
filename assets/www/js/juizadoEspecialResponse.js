$('#processoJuizadoEspecInfo').bind('pageinit', function(event) {
	//var numProcesso = $('#valor_consulta').val();
	var numProcesso = '20020050068218';
	consultaProcessoJuizadoEspecial(numProcesso);
});

//swipes
$('#processoJuizadoEspecInfo').swipeleft(function() {
	$.mobile.changePage('#partesJuizadoEspecInfo');
});

$('#processoJuizadoEspecInfo').swiperight(function() {
	$.mobile.changePage('#movimentacoesJuizadoEspecInfo');
});

$('#partesJuizadoEspecInfo').swipeleft(function() {
	$.mobile.changePage('#movimentacoesJuizadoEspecInfo');
});

$('#partesJuizadoEspecInfo').swiperight(function() {
	$.mobile.changePage('#processoJuizadoEspecInfo');
});

$('#movimentacoesJuizadoEspecInfo').swipeleft(function() {
	$.mobile.changePage('#processoJuizadoEspecInfo');
});

$('#movimentacoesJuizadoEspecInfo').swiperight(function() {
	$.mobile.changePage('#partesJuizadoEspecInfo');
});

//consulta processo turma recursal
function consultaProcessoJuizadoEspecial(numProcesso) {
	$('#lista_partes_je').text("");
	$('#lista_movimentacoes_je').text("");
	
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
		data: msgConsultaProcessoJuizadoEspecial,
		processData: false,
		success: function(response) {
			
			var xml = $(response);
			
//			if ( xml.find('nuProcesso').text() ==  '') {
//				alert('Nenhum resultado para o número de processo informado.');
//				return;
//			}
			
			//carregando infos do processo			
			$('#nuProcesso_je').text(xml.find('nuProcesso').text());
			$('#classe_je').text(xml.find('classe').text());
			$('#stProcesso_je').text(xml.find('stProcesso').text());
			$('#vara_je').text(xml.find('vara').text());
			$('#dtDistribuicao_je').text(xml.find('dtDistribuicao').text());
			$('#vlAcao_je').text(xml.find('vlAcao').text());
			
			//carregando infos das partes		
			xml.find('partes').each(function() {
				var nmParte = $(this).find('nmParte').text();
				var tipoParte = $(this).find('tipoParte').text();
				var stParte = $(this).find('stParte').text();
				var advogados = $(this).find('advogados').text();
				var nuDoc= $(this).find('nuDoc').text();
				
				$('#lista_partes_je').append('<li> <h5>'+nmParte+'</h5>' + 
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
				
				$('#lista_movimentacoes_je').append('<li>' + 
					'<h5>' + dtMovimentacao + '</h5>' +
					'<p> Descrição: ' + dsMovimentacao + ' </p>' +
					'<p> Complemento: ' + dsComplemento + ' </p> </li>');
			});
		}
		//failure: alert('Não foi possível realizar a consulta')
	});
}