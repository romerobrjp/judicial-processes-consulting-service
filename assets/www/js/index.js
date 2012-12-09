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
    
    if(networkState == 'none') {
        $("#aviso_conexao").css('display', 'block');
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

function consultar() {
	if($('#grau1').is(':checked') == true) {
		consultaProcesso1Grau();
	}
	if($('#grau2').is(':checked') == true) {
		consultaProcesso2Grau();
	}
}