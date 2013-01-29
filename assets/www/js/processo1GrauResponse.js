var numProcesso = "";
var proc = new Processo();

function consultarProcesso1Grau(numProcesso) {
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
			
//			if ( xml.find('nuProcesso').text() ==  '') {
//				alert('Nenhum resultado para o n�mero de proc informado.');
//				return;
//			}

			//salvando infos do proc
			proc.codCategoria = "1grau";
			proc.descCategoria = "1� Grau";
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
				parte.tipoParte = $(this).find('tipoParte').text();
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
		//error: alert('N�o foi poss�vel realizar a consulta')
	});
}

function carregarInfosProcesso1Grau(proc) {	
	$('#nuProcesso_1g').html(proc.nuProcesso);
	$('#nuNovo_1g').html(proc.nuNovo);	
	$('#classe_1g').text(proc.classe);
	$('#stProcesso_1g').text(proc.stProcesso);
	$('#vara_1g').text(proc.vara);
	$('#dtDistribuicao_1g').text(proc.dtDistribuicao);
	$('#vlAcao_1g').text(proc.vlAcao);
	
	$('#aviso_info_processo').empty();
	$('#aviso_info_processo').text('Dados do Processo');
}

function carregarPartesProcesso1Grau(proc) {
	$('#lista_partes_1g').empty();
	$(proc.partes).each(function(i, p) {
		$('#lista_partes_1g').append(
			'<li> <h5>' + p.nmParte + '</h5>' + 
			'<p> Tipo: ' + p.tipoParte + ' </p>' +
			'<p> Situa��o: ' + p.stParte + ' </p>' +
			'<p> Advogados: ' + p.advogados + ' </p>' +
			'<p> Documento: ' + p.nuDoc + ' </p> </li>');
	});	
	$("#lista_partes_1g").listview('refresh');
	
	$('#quant_partes').empty();	
	$('#quant_partes').text(proc.partes.length + ' Partes');
}

function carregarMovimentacoesProcesso1Grau(proc) {
	$('#lista_movimentacoes_1g').empty();	
	$(proc.movimentacoes).each(function(i, m) {
		$('#lista_movimentacoes_1g').append(
			'<li>' + 
			'<h5>' + m.dtMovimentacao + '</h5>' +
			'<p> Descri��o: ' + m.dsMovimentacao + ' </p>' +
			'<p> Complemento: ' + m.dsComplemento + ' </p>' +  
			'</li>');
	});	
	$("#lista_movimentacoes_1g").listview('refresh');
	
	$('#quant_movimentacoes').empty();	
	$('#quant_movimentacoes').text(proc.movimentacoes.length + ' Movimenta��es');
}

function carregarProcesso1GrauPorId(id) {
	var proc = pegarProcessoPorId(id);
	alert(proc.nuProcesso);
	
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