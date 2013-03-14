var numProcesso = "";
var proc = new Processo();

//consultar processo 1º grau
function consultarProcesso1Grau(numProcesso) {
	proc = new Processo();
	var parte;
	var mov;
	
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
			
			if (xml.find('nuProcesso').text() == '' || xml.find('nuProcesso').text() == null || xml.find('nuProcesso').text() == undefined) {
				alert('Nenhum resultado para o número processo digitado.');
				$.mobile.changePage("index.html");
				return null;
			}

			//salvando infos do proc
			proc.codCategoria = "1grau";
			proc.descCategoria = "1º Grau";
			proc.nuProcesso = xml.find('nuProcesso').text();
			proc.nuNovo = xml.find('nuProcessoCnj').text();
			proc.classe = xml.find('classe').text();
			proc.stProcesso = xml.find('stProcesso').text();
			proc.vara = xml.find('vara').text();
			proc.dtDistribuicao = xml.find('dtDistribuicao').text();
			proc.vlAcao = xml.find('vlAcao').text();

			//salvando infos das partes
			xml.find('partes').each(function() {
				parte = new Parte();
				
				parte.nmParte = $(this).find('nmParte').text();
				parte.tipoParte = $(this).find('tipoparte').text();
				parte.stParte = $(this).find('stParte').text();
				parte.advogados = $(this).find('advogados').text();
				parte.nuDoc = $(this).find('nuDoc').text();
				
				proc.partes.push(parte);
			});
			
			//salvando infos da movimentacoes			
			xml.find('movimentacoes').each(function() {
				mov = new Movimentacao();
				
				mov.dtMovimentacao = $(this).find('dtMovimentacao').text();
				mov.dsMovimentacao = $(this).find('dsMovimentacao').text();
				mov.dsComplemento = $(this).find('dsComplemento').text();
				
				proc.movimentacoes.push(mov);
			});
			
			carregarInfosProcesso1Grau(proc);
			arquivarConsulta(proc);			
		}
		//error: alert('Não foi possível realizar a consulta')
	});
}

function carregarInfosProcesso1Grau(proc) {	
	$('#nuProcesso_1g').html(proc.nuProcesso);
	$('#nuNovo_1g').html(proc.nuNovo);	
	$('#classe_1g').html(proc.classe);
	$('#stProcesso_1g').html(proc.stProcesso);
	$('#vara_1g').html(proc.vara);
	$('#dtDistribuicao_1g').html(proc.dtDistribuicao);
	$('#vlAcao_1g').html(proc.vlAcao);
	
	$('#aviso_info_processo_1g').text('');
	$('#aviso_info_processo_1g').text('Dados do Processo');
}

function carregarPartesProcesso1Grau(proc) {
	//$('#lista_partes_1g').children().remove('li');
	$('#lista_partes_1g li').not("#divider").remove();
	
	$(proc.partes).each(function(i, p) {
		$('#lista_partes_1g').append(
			'<li> <h5>' + p.nmParte + '</h5>' + 
			'<p> <b> Tipo: </b>' + p.tipoParte + ' </p>' +
			'<p> <b> Situação: </b>' + p.stParte + ' </p>' +
			'<p> <b> Advogados: </b>' + p.advogados + ' </p>' +
			'<p> <b> Documento: </b>' + p.nuDoc + ' </p> </li>');
	});	
	$("#lista_partes_1g").listview('refresh');
	$('#quant_partes_1grau').text('');	
	$('#quant_partes_1grau').text(proc.partes.length + ' Partes');
}

function carregarMovimentacoesProcesso1Grau(proc) {
	//$('#lista_movimentacoes_1g').children().remove('li');
	$('#lista_movimentacoes_1g li').not("#divider").remove();
	
	$(proc.movimentacoes).each(function(i, m) {
		$('#lista_movimentacoes_1g').append(
			'<li>' + 
			'<h5>' + m.dtMovimentacao + '</h5>' +
			'<p> <b> Descrição: </b>' + m.dsMovimentacao + ' </p>' +
			'<p> <b> Complemento: </b>' + m.dsComplemento + ' </p>' +  
			'</li>');
	});	
	$("#lista_movimentacoes_1g").listview('refresh');
	$('#quant_movimentacoes').text('');	
	$('#quant_movimentacoes').text(proc.movimentacoes.length + ' Movimentações');
}

function carregarProcesso1GrauPorId(id) {
	var proc = pegarProcessoPorId(id);
	
	carregarInfosProcesso1Grau(proc);
	carregarPartesProcesso1Grau(proc);
	carregarMovimentacoesProcesso1Grau(proc);
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