var numProcesso = "";
var permitidoArquivar = false;

//variaveis processo;
var nuProcesso;
var classe;
var stProcesso;
var vara;
var dtDistribuicao;
var vlAcao;
//variaveis partes
var nmParte;
var tipoParte;
var stParte;
var advogados;
var nuDoc;
//variaveis movimentacoes
var dtMovimentacao;
var dsMovimentacao;
var dsComplemento;

var processoJson;

$('#processo1GrauInfo').bind('pageinit', function(event) {
	//numProcesso = $('#valor_consulta').val();
	numProcesso = '00520120004162';
	var quant = quantConsultasArquivadas();
	if (quant < 20) {
		permitidoArquivar = true;
	}
	consultarProcesso1Grau(numProcesso);	
});

//consulta processo 1º grau
function consultarProcesso1Grau(numProcesso) {
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
			
			nuProcesso = xml.find('nuProcesso').text();
			classe = xml.find('classe').text();
			stProcesso = xml.find('stProcesso').text();
			vara = xml.find('vara').text();
			dtDistribuicao = xml.find('dtDistribuicao').text();
			vlAcao = xml.find('vlAcao').text();
				
			//carregando infos do processo			
			$('#nuProcesso_1g').text(nuProcesso);
			$('#classe_1g').text(classe);
			$('#stProcesso_1g').text(stProcesso);
			$('#vara_1g').text(vara);
			$('#dtDistribuicao_1g').text(dtDistribuicao);
			$('#vlAcao_1g').text(vlAcao);
			
			//carregando infos das partes
			xml.find('partes').each(function() {
				nmParte = $(this).find('nmParte').text();
				tipoParte = $(this).find('tipoParte').text();
				stParte = $(this).find('stParte').text();
				advogados = $(this).find('advogados').text();
				nuDoc = $(this).find('nuDoc').text();
				
				$('#lista_partes_1g').append('<li> <h5>' + nmParte + '</h5>' + 
					'<p> Tipo: ' + tipoParte + ' </p>' +
					'<p> Situação: ' + stParte + ' </p>' +
					'<p> Advogados: ' + advogados + ' </p>' +
					'<p> Documento: ' + nuDoc + ' </p> </li>');
			});
			
			//carregando infos da movimentacoes			
			xml.find('movimentacoes').each(function() {
				dtMovimentacao = $(this).find('dtMovimentacao').text();
				dsMovimentacao = $(this).find('dsMovimentacao').text();
				dsComplemento = $(this).find('dsComplemento').text();
				
				$('#lista_movimentacoes_1g').append('<li>' + 
					'<h5>' + dtMovimentacao + '</h5>' +
					'<p> Descrição: ' + dsMovimentacao + ' </p>' +
					'<p> Complemento: ' + dsComplemento + ' </p> </li>');
			});
			
			processoJson = {
				"categoria" : "1grau",
				"nuProcesso" : nuProcesso,
				"classe" : classe,
				"stProcesso" : stProcesso,
				"vara" : vara,
				"dtDistribuicao" : dtDistribuicao,
				"vlAcao" : vlAcao,
				"partes" : [{
					"nmParte" : nmParte,
					"tipoParte" : tipoParte,
					"stParte" : stParte,
					"advogados" : advogados,
					"nuDoc" : nuDoc
				}],
				"movimentacoes" : [{
					"dtMovimentacao" : dtMovimentacao,
					"dsMovimentacao" : dsMovimentacao,
					"dsComplemento" : dsComplemento
				}]
			}
			
			if (permitidoArquivar == true) {
//				if (!verificarProcessoPorNumero()) {
					alert('arquivando o processo ' + processoJson.nuProcesso + '...' + typeof processoJson);
					arquivarConsulta(processoJson);
//				}
			}
		}
		//error: alert('Não foi possível realizar a consulta')
	});
	
	
}

//swipes
//$('#processo1GrauInfo').swipeleft(function() {
//	$.mobile.changePage('#partes1GrauInfo');
//});
//
//$('#processo1GrauInfo').swiperight(function() {
//	$.mobile.changePage('#movimentacoes1GrauInfo');
//});
//
//$('#partes1GrauInfo').swipeleft(function() {
//	$.mobile.changePage('#movimentacoes1GrauInfo');
//});
//
//$('#partes1GrauInfo').swiperight(function() {
//	$.mobile.changePage('#processo1GrauInfo');
//});
//
//$('#movimentacoes1GrauInfo').swipeleft(function() {
//	$.mobile.changePage('#processo1GrauInfo');
//});
//
//$('#movimentacoes1GrauInfo').swiperight(function() {
//	$.mobile.changePage('#partes1GrauInfo');
//});