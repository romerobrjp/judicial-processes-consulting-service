$('#processoExecPenalInfo').bind('pageinit', function(event) {
	//var numProcesso = $('#valor_consulta').val();
	var numProcesso = '163506320128152002';
	consultaProcessoExecucaoPenal(numProcesso);
});

//swipes
//$('#processoExecPenalInfo').swipeleft(function() {
//	$.mobile.changePage('#partesExecPenalInfo');
//});
//
//$('#processoExecPenalInfo').swiperight(function() {
//	$.mobile.changePage('#movimentacoesExecPenalInfo');
//});
//
//$('#partesExecPenalInfo').swipeleft(function() {
//	$.mobile.changePage('#movimentacoesExecPenalInfo');
//});
//
//$('#partesExecPenalInfo').swiperight(function() {
//	$.mobile.changePage('#processoExecPenalInfo');
//});
//
//$('#movimentacoesExecPenalInfo').swipeleft(function() {
//	$.mobile.changePage('#processoExecPenalInfo');
//});
//
//$('#movimentacoesExecPenalInfo').swiperight(function() {
//	$.mobile.changePage('#partesExecPenalInfo');
//});

//consulta processo turma recursal
function consultaProcessoExecucaoPenal(numProcesso) {
	$('#lista_partes_ep').text("");
	$('#lista_movimentacoes_ep').text("");
	
	var msgConsultaProcessoJuizadoEspecial = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<web:consultarProcessoPorNumero>' +
		'<arg0>'+ numProcesso +'</arg0>' +
		'</web:consultarProcessoPorNumero>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	$.ajax({
		url: 'http://app.tjpb.jus.br:80/VEPCNJ/vep',
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
			$('#nuProcesso_ep').text(xml.find('nuProcesso').text());
			$('#classe_ep').text(xml.find('classe').text());
			$('#stProcesso_ep').text(xml.find('stProcesso').text());
			$('#vara_ep').text(xml.find('vara').text());
			$('#dtCadastro_ep').text(xml.find('dtCadastro').text());
			$('#vlAcao_ep').text(xml.find('vlAcao').text());
			
			//carregando infos das partes		
			xml.find('partes').each(function() {
				var nmParte = $(this).find('nmParte').text();
				var tipoParte = $(this).find('tipoParte').text();
				var dtNascimento = $(this).find('dtNascimento').text();
				var nmPai = $(this).find('nmPai').text();
				var nmMae = $(this).find('nmMae').text();
				
				$('#lista_partes_ep').append('<li> <h5>'+nmParte+'</h5>' + 
					'<p> Tipo: ' + tipoParte + ' </p>' +
					'<p> Data de nascimento: ' + dtNascimento + ' </p>' +
					'<p> Nome do pai: ' + nmPai + ' </p>' +
					'<p> Nome da mãe: ' + nmMae + ' </p> </li>');
			});
			
			//carregando infos das movimentacoes			
			xml.find('movimentacoes').each(function() {
				var dtMovimentacao = $(this).find('dtMovimentacao').text();
				var dsMovimentacao = $(this).find('dsMovimentacao').text();
				
				$('#lista_movimentacoes_ep').append('<li>' + 
					'<h5>' + dtMovimentacao + '</h5>' +
					'<p> Descrição: ' + dsMovimentacao + ' </p> </li>');
			});
		}
		//failure: alert('Não foi possível realizar a consulta')
	});
}