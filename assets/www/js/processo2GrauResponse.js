var numProcesso = "";
var proc = new Processo();

//consultar processo 2º grau
function consultarProcesso2Grau(numProcesso) {
	var parte;
	var mov;
	
	$('#lista_partes_2g').text("");
	$('#lista_movimentacoes_2g').text("");
	
	var msgConsultaProcesso2Grau = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://wsserver.servicos.consultaprocessual.tjpb.jus.br/">' +
		'<soapenv:Header/>' + 
		'<soapenv:Body>' +
		'<wss:consultaProcesso2Grau>' +
		'<arg0> <numero>' + numProcesso + '</numero> </arg0>' +
		'</wss:consultaProcesso2Grau>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	$.ajax({
		url: 'http://app.tjpb.jus.br:80/consultaprocessual2/ConsultaProcessualWSService',
		type: 'POST',
		contentType: 'text/xml',
		dataType: 'xml',
		contentType: 'text/xml charset="iso-8859-1"',
		data: msgConsultaProcesso2Grau,
		processData: false,
		success: function(response) {
			var xml = $(response);
			
//			if ( xml.find('nuProcesso').text() ==  '') {
//				alert('Nenhum resultado para o número de processo informado.');
//				return;
//			}
			
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
				parte = new Parte();
				
				parte.nmParte = $(this).find('nmParte').text();
				parte.tipoParte = $(this).find('tipoparte').text();
				
				proc.partes.push(parte);				
			});
			
			//carregando infos da movimentacoes			
			xml.find('movimentacoes').each(function() {
				mov = new Movimentacao();
				
				mov.dtMovimentacao = $(this).find('dtMovimentacao').text();
				mov.dsMovimentacao = $(this).find('dsMovimentacao').text();
				
				proc.movimentacoes.push(mov);
			});
			
			carregarInfosProcesso2Grau(proc);
			arquivarConsulta(proc);
		}
		//failure: alert('Não foi possível realizar a consulta')
	});
}

function carregarInfosProcesso2Grau(proc) {	
	$('#nuProcesso_2g').html(proc.nuProcesso);
	$('#nuProcesso1Grau_2g').html(proc.nuNovo);	
	$('#classe_2g').text(proc.classe);
	$('#dtDistribuicao_2g').text(proc.dtDistribuicao);
	$('#vara_2g').text(proc.vara);
	$('#nmOrgao_2g').text(proc.nmOrgao);
	$('#tpDistribuição_2g').text(proc.tpDistribuicao);
	$('#nmLocal_2g').text(proc.nmLocal);
	$('#nmVolume_2g').text(proc.nmVolume);
	$('#dtEntrada_2g').text(proc.dtEntrada);
	$('#nmRelator_2g').text(proc.nmRelator);
	
	$('#aviso_info_processo').text('');
	$('#aviso_info_processo').text('Dados do Processo');
}

function carregarPartesProcesso2Grau(proc) {
	$('#lista_partes_2g').children().remove('li');
		
	$(proc.partes).each(function(i, p) {
		$('#lista_partes_2g').append(
			'<li> <h5>' + p.nmParte + '</h5>' + 
			'<p> Tipo: ' + p.tipoParte + ' </p>');
	});	
	$("#lista_partes_2g").listview('refresh');
	
	$('#quant_partes_2g').text('');	
	$('#quant_partes_2g').text(proc.partes.length + ' Partes');
}

function carregarMovimentacoesProcesso2Grau(proc) {
	$('#lista_movimentacoes_2g').children().remove('li');
	
	$(proc.movimentacoes).each(function(i, m) {
		$('#lista_movimentacoes_2g').append(
			'<li>' + 
			'<h5>' + m.dtMovimentacao + '</h5>' +
			'<p> Descrição: ' + m.dsMovimentacao + ' </p>' +
			'</li>');
	});	
	$("#lista_movimentacoes_2g").listview('refresh');
	
	$('#quant_movimentacoes_2g').text('');	
	$('#quant_movimentacoes_2g').text(proc.movimentacoes.length + ' Movimentações');
}

function carregarProcesso2GrauPorId(id) {
	var proc = pegarProcessoPorId(id);
	alert(proc.nuProcesso);
	
	carregarInfosProcesso1Grau(proc);
	carregarPartesProcesso1Grau(proc);
	carregarMovimentacoesProcesso1Grau(proc);
}

//swipes
//$('#processo2GrauInfo').swipeleft(function() {
//	$.mobile.changePage('#partes2GrauInfo');
//});
//
//$('#processo2GrauInfo').swiperight(function() {
//	$.mobile.changePage('#movimentacoes2GrauInfo');
//});
//
//$('#partes2GrauInfo').swipeleft(function() {
//	$.mobile.changePage('#movimentacoes2GrauInfo');
//});
//
//$('#partes2GrauInfo').swiperight(function() {
//	$.mobile.changePage('#processo2GrauInfo');
//});
//
//$('#movimentacoes2GrauInfo').swipeleft(function() {
//	$.mobile.changePage('#processo2GrauInfo');
//});
//
//$('#movimentacoes2GrauInfo').swiperight(function() {
//	$.mobile.changePage('#partes2GrauInfo');
//});