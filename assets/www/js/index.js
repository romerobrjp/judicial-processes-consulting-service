document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	checarConexao();
}

function checarConexao() {
    var networkState = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'unknown';
    states[Connection.ETHERNET] = 'ethernet';
    states[Connection.WIFI]     = 'wifi';
    states[Connection.CELL_2G]  = '2g';
    states[Connection.CELL_3G]  = '3g';
    states[Connection.CELL_4G]  = '4g';
    states[Connection.NONE]     = 'none';

    //alert(networkState + ' - ' + states[Connection.NONE]);
    
    if (networkState == 'none') {
        $("#aviso_conexao").css('display', 'block');
        $('#btConsultar').attr('onclick', 'alert("SEM ACESSO À INTERNET")');
    }
}

function limparInputConsulta() {
    $('#valor_consulta').val("");
}

function gerenciaOpcoesComboboxOab() {
    if ($('#tipoConsulta').val() == 'num_oab') {
    	alert($('#tipoConsulta').val())
        $('#div_letra').css('display', 'block');
        $('#div_estado').css('display', 'block');
    }
    else {
    	alert($('#tipoConsulta').val())
        $('#div_letra').css('display', 'none');
        $('#div_estado').css('display', 'none');
    }
}

function consultarPorNumero() {
	var numProcesso = $('#valor_consulta').val();
	
//	if (numProcesso == '' || numProcesso == 'Digite aqui...') {
//		alert('Informe um número de processo para efetuar a consulta.');
//		return;
//	}
	
	if($('#grau1').is(':checked') == true) {
		$.mobile.changePage( $("#processo1GrauInfo") );
	}	
	else if($('#grau2').is(':checked') == true) {
		$.mobile.changePage( $("#processo2GrauInfo") );
	}	
	else if($('#juizado_especial').is(':checked') == true) {
		$.mobile.changePage( $("#processoJuizadoEspecInfo") );
	}
	else if($('#turma_recursal').is(':checked') == true) {
		$.mobile.changePage( $("#processoTurmaRecInfo") );
	}
	else if($('#execucao_penal').is(':checked') == true) {
		$.mobile.changePage( $("#processoExecPenalInfo") );
	}
}