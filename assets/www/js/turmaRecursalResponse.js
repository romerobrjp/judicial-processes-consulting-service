$('#processoTurmaRecInfo').bind('pageinit', function(event) {
	//var numProcesso = $('#valor_consulta').val();
	var numProcesso = '30336768520128152001';
	consultaProcessoTurmaRecursal(numProcesso);
});

//swipes
//$('#processoTurmaRecInfo').swipeleft(function() {
//	$.mobile.changePage('#partesTurmaRecInfo');
//});
//
//$('#processoTurmaRecInfo').swiperight(function() {
//	$.mobile.changePage('#movimentacoesTurmaRecInfo');
//});
//
//$('#partesTurmaRecInfo').swipeleft(function() {
//	$.mobile.changePage('#movimentacoesTurmaRecInfo');
//});
//
//$('#partesTurmaRecInfo').swiperight(function() {
//	$.mobile.changePage('#processoTurmaRecInfo');
//});
//
//$('#movimentacoesTurmaRecInfo').swipeleft(function() {
//	$.mobile.changePage('#processoTurmaRecInfo');
//});
//
//$('#movimentacoesTurmaRecInfo').swiperight(function() {
//	$.mobile.changePage('#partesTurmaRecInfo');
//});

//consulta processo turma recursal
function consultaProcessoTurmaRecursal(numProcesso) {
	$('#lista_partes_tr').text("");
	$('#lista_movimentacoes_tr').text("");
	
	var msgTurmaRecursalConsulta = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<wss:consultaProcessoTurmasRecursais>' +
		'<arg0> <numero>'+ numProcesso +'</numero> </arg0>' +
		'</wss:consultaProcessoTurmasRecursais>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';
	
	var msgTurmaRecursalConsulta = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<web:consultarProcessoPorNumero>' +
		'<arg0> <numero>'+ numProcesso +'</numero> </arg0>' +
		'</web:consultarProcessoPorNumero>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		contentType: 'text/xml',
		dataType: 'xml',
		contentType: 'text/xml charset="iso-8859-1"',
		data: msgTurmaRecursalConsulta,
		processData: false,
		success: function(response) {
			var xml = $(response);
			
			//carregando infos processo			
			$('#nuRecurso_tr').text(xml.find('nuRecurso').text());
			$('#classe_tr').text(xml.find('classe').text());
			$('#classeOrigem_tr').text(xml.find('classeOrigem').text());
			$('#dtAutuacao_tr').text(xml.find('dtAutuacao').text());
			$('#turma_tr').text(xml.find('turma').text());
			$('#vara_tr').text(xml.find('vara').text());
			$('#presidente_tr').text(xml.find('presidente').text());
			$('#relator_tr').text(xml.find('relator').text());
			
			//carregando infos das partes		
			xml.find('partes').each(function() {
				var nmParte = $(this).find('nmParte').text();
				var tipoParte = $(this).find('tipoParte').text();
				var stParte = $(this).find('stParte').text();
				var advogados = $(this).find('advogados').text();
				var nuDoc= $(this).find('nuDoc').text();
				
				$('#lista_partes_tr').append('<li> <h5>'+nmParte+'</h5>' + 
						'<p> Tipo: ' + tipoParte + ' </p>' +
						'<p> Advogados: ' + advogados + ' </p> </li>');
			});
			
			//carregando infos da movimentacoes			
			xml.find('movimentacoes').each(function() {
				var dtMovimentacao = $(this).find('dtMovimentacao').text();
				var dsMovimentacao = $(this).find('dsMovimentacao').text();
				
				$('#lista_movimentacoes_tr').append('<li>' + 
					'<h5>' + dtMovimentacao + ' </h5>' +
					'<p> Descrição: ' + dsMovimentacao + ' </p> </li>');
			});
		}
		//failure: alert('Não foi possível realizar a consulta')
	});
	
	
	//consultar no eJUS (processo VIRTUAL)
	$.ajax({
		url: 'http://app.tjpb.jus.br:80/projudi/consultaProcessual',
		type: 'POST',
		contentType: 'text/xml',
		dataType: 'xml',
		contentType: 'text/xml charset="iso-8859-1"',
		data: msgTurmaRecursalConsulta,
		processData: false,
		success: function(response) {
			var xml = $(response);
			
			if ( (xml.find('nuRecurso').text() != '') && (xml.find('nuRecurso').text() != null) && (xml.find('nuRecurso').text() != undefined) ) {
			
				//carregando infos processo			
				$('#nuRecurso_tr').text(xml.find('nuRecurso').text());
				$('#classe_tr').text(xml.find('classe').text());
				$('#classeOrigem_tr').text(xml.find('classeOrigem').text());
				$('#dtAutuacao_tr').text(xml.find('dtAutuacao').text());
				$('#turma_tr').text(xml.find('turma').text());
				$('#vara_tr').text(xml.find('vara').text());
				$('#presidente_tr').text(xml.find('presidente').text());
				$('#relator_tr').text(xml.find('relator').text());
				
				//carregando infos das partes		
				xml.find('partes').each(function() {
					var nmParte = $(this).find('nmParte').text();
					var tipoParte = $(this).find('tipoParte').text();
					var stParte = $(this).find('stParte').text();
					var advogados = $(this).find('advogados').text();
					var nuDoc= $(this).find('nuDoc').text();
					
					$('#lista_partes_tr').append('<li> <h5>'+nmParte+'</h5>' + 
							'<p> Tipo: ' + tipoParte + ' </p>' +
							'<p> Advogados: ' + advogados + ' </p> </li>');
				});
				
				//carregando infos da movimentacoes			
				xml.find('movimentacoes').each(function() {
					var dtMovimentacao = $(this).find('dtMovimentacao').text();
					var dsMovimentacao = $(this).find('dsMovimentacao').text();
					
					$('#lista_movimentacoes_tr').append('<li>' + 
						'<h5>' + dtMovimentacao + ' </h5>' +
						'<p> Descrição: ' + dsMovimentacao + ' </p> </li>');
				});
			}
		}
		//failure: alert('Não foi possível realizar a consulta')
	});
}