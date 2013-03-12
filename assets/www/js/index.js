var networkState;
var states = {};

try {
	configurarBanco();
} 
catch (e) {
	alert("configurarBanco(): " + e);	
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	checarConexao();
	
	$(document).bind("mobileinit", function(){
		$.mobile.defaultPageTransition = 'slide';
	});
}



function checarConexao() {
	networkState = navigator.network.connection.type;
	
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
    }
}

function limparInputConsulta() {
    $('#valor_consulta').val("");
}

//function gerenciaOpcoesComboboxOab() {
//    if ($('#tipoConsulta').val() == 'num_oab') {
//    	alert($('#tipoConsulta').val())
//        $('#div_letra').css('display', 'block');
//        $('#div_estado').css('display', 'block');
//    }
//    else {
//    	alert($('#tipoConsulta').val())
//        $('#div_letra').css('display', 'none');
//        $('#div_estado').css('display', 'none');
//    }
//}

function consultarPorNumero() {
	var numProcesso = $('#valor_consulta').val();
	
	if (numProcesso == '' || numProcesso == 'Digite aqui...') {
		alert('Informe um número de processo para realizar a consulta.');
		return null;
	}
	if (networkState == 'none') {
        $("#popup_aviso_internet").popup('open');
        return null;
    }
	
	if($('#grau1').is(':checked') == true) {
		$.mobile.changePage("processo1GrauInfo.html");
	}	
	else if($('#grau2').is(':checked') == true) {
		$.mobile.changePage("processo2GrauInfo.html");
	}	
	else if($('#juizado_especial').is(':checked') == true) {
		$.mobile.changePage("processoJuizadoEspecInfo");
	}
	else if($('#turma_recursal').is(':checked') == true) {
		$.mobile.changePage("processoTurmaRecInfo");
	}
	else if($('#execucao_penal').is(':checked') == true) {
		$.mobile.changePage("processoExecPenalInfo");
	}
}