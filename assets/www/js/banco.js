var db;

function erro(e) {
	console.log("transacao erro");
	alert(e);
}

function finallyy() {
	console.log("transacao finally");
}

function configurarBanco() {
	db = window.openDatabase("consultaMobile", "1.0", "consultaMobile", (1024 * 1024) * 5);
	if (db) {
		db.transaction(gerarTabelas, erro, finallyy);
	}
	else {
		alert("configurarBanco(): Banco nao configurado");
	}
}

function gerarTabelas(tx) {
	//CRIANDO AS TABELAS
	console.log("---CRIANDO TABELAS---");
	
	//PRODUTOS
	console.log("Configurando tabela PROCESSO...")
	tx.executeSql("CREATE TABLE IF NOT EXISTS PROCESSO " +
			"(" +
			"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"CATEGORIA VARCHAR(20), " +
			"NU_PROCESSO VARCHAR(20), " +
			"CLASSE VARCHAR(20)," +
			"ST_PROCESSO VARCHAR(20)," +
			"VARA VARCHAR(50)," +
			"DT_DISTRIBUICAO VARCHAR(10)," +
			"VL_ACAO VARCHAR(20)" +
			")");
	
	//PARTES DO PROCESSO
//	console.log("Configurando tabela PARTES...")
//	tx.executeSql("CREATE TABLE IF NOT EXISTS PARTES " +
//			"(" +
//			"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
//			"NM_PARTE VARCHAR(50), " +
//			"TIPO_PARTE VARCHAR(10), " +
//			"ST_PARTE VARCHAR(10), " +
//			"ADVOGADOS VARCHAR(100), " +
//			"NU_DOC VARCHAR(20), " +
//			"FOREIGN KEY(PROCESSO_ID) REFERENCES PROCESSO(ID)" +
//			")");
	
	//MOVIMENTACOES DO PROCESSO
//	console.log("Configurando tabela MOVIMENTACOES...")
//	tx.executeSql("CREATE TABLE IF NOT EXISTS MOVIMENTACOES " +
//			"(" +
//			"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
//			"DT_MOVIMENTACAO VARCHAR(10), " +
//			"DS_MOVIMENTACAO VARCHAR(100), " +
//			"DS_COMPLEMENTO VARCHAR(200), " +
//			"FOREIGN KEY(PROCESSO_ID) REFERENCES PROCESSO(ID)" +
//			")");
	
	console.log("---TABELAS CRIADAS---");
}

function listarProcessos() {
	if (db) {
		db.transaction(
			function(tx) {
				var sql = "SELECT NU_PROCESSO, CATEGORIA FROM PROCESSO";
				tx.executeSql(
					sql, 
					[], 
					function consultaSucesso(tx, results) {
						var len = results.rows.length;
						
					    for (var i=0; i<len; i++) {
					    	var link;
					    	if (results.rows.item(i).CATEGORIA == '1grau') {
					    		link = "processo1GrauInfo.html";
					    	}
					    	else if (results.rows.item(i).CATEGORIA == '2grau') {
					    		link = "processo2GrauInfo.html";
					    	}
					    	else if (results.rows.item(i).CATEGORIA == 'juizadoEspecial') {
					    		link = "processoJuizadoEspecInfo.html";
					    	}
					    	else if (results.rows.item(i).CATEGORIA == 'turmaRecursal') {
					    		link = "processoTurmaRecInfo.html";
					    	}
					    	else if (results.rows.item(i).CATEGORIA == 'execucaoPenal') {
					    		link = "processoExecPenalInfo.html";
					    	}
					    	
					    	if (len == 0) {
					    		$('#lista_historico').append('<li> Nenhuma consulta arquivada </li>');
					    		alert('nada arquivado');
					    	}
					    	else {
					    		$('#lista_historico').append('<li data-icon="arrow-r" data-iconpos="right"> <a href="' + link + 
				    				'?processoId=' + results.rows.item(i).ID + '"> <h3>' +
					        		results.rows.item(i).NU_PROCESSO + ' </h3> <p>' + results.rows.item(i).CATEGORIA + '</p> </a> </li>');
					    	}					        
					    }
//					    $('#lista_historico').listview('refresh');
					},
					function(err) {
						alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
					}
				)
			},
			function errorCB(err) {
			    console.log("Erro no db.transaction: " + err.code + ' - ' + err.message);
			    return false;
			},
			function successCB() {
			    console.log("Sucesso!");
			    return true;
			}
		);	
	}
	else {
		alert("listarProcessos(): Banco nao configurado");
	}
}

function pegarProcessoPorId(id) {
	if (db) {
		db.transaction(function(tx) {
			var sql = "SELECT * FROM PROCESSO INNER JOIN PARTES ON " +
					"PROCESSO.ID = PARTES.PROCESSO_ID" +
					"WHERE PROCESSO.ID = " + id;
			tx.executeSql(
				sql, 
				[],
				function consultaSucesso(tx, results) {					
					$('#lista_partes_1g').append('<li> <h5>' +  results.rows.item(0).NM_PARTE + '</h5>' + 
						'<p> Tipo: ' +  results.rows.item(0).TIPO_PARTE + ' </p>' +
						'<p> Situação: ' + results.rows.item(0).ST_PARTE + ' </p>' +
						'<p> Advogados: ' + results.rows.item(0).ADVOGADOS + ' </p>' +
						'<p> Documento: ' + results.rows.item(0).NU_DOC + ' </p> </li>');
				},
				function(err) {
					alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
				})
		},
		function errorCB(err) {
			alert("Erro no db.transaction: " + err.code + ' - ' + err.message);
			return false;
		}, 
		function successCB() {
			console.log("Sucesso na consulta de PROCESSO por ID!");
			return true;
		});
	}
}

function verificarProcessoPorNumero(numero) {
	if (db) {
		db.transaction(function(tx) {
			var sql = "SELECT * FROM PROCESSO INNER JOIN PARTES ON " +
					"PROCESSO.ID = PARTES.PROCESSO_ID " +
					"WHERE PROCESSO.NU_PROCESSO = " + numero;
			tx.executeSql(
				sql, 
				[],
				function consultaSucesso(tx, results) {					
					if (results.rows.length == 0) {
						return false;
					} else if (results.rows.length > 0) {
						return true;
					}
				},
				function(err) {
					alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
				})
		},
		function errorCB(err) {
			alert("Erro no db.transaction: " + err.code + ' - ' + err.message);
			return false;
		}, 
		function successCB() {
			console.log("Sucesso na consulta de PROCESSO por NUMERO!");
			return true;
		});
	}
}

function quantConsultasArquivadas() {
	var quant = 0;
	if (db) {
		db.transaction(function(tx) {
			var sql = "SELECT * FROM PROCESSO";
			tx.executeSql(
				sql, 
				[],
				function consultaSucesso(tx, results) {
					quant = results.rows.length;
				},
				function(err) {
					alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
				})
		},
		function errorCB(err) {
			alert("Erro no db.transaction: " + err.code + ' - ' + err.message);
			return false;
		}, 
		function successCB() {
			console.log("Sucesso na consulta de quantConsultasArquivadas!");
			return true;
		});
	}
	return quant;
}


function arquivarConsulta(processo) {
	alert(processo.nuProcesso);
	if (db) {
		var sql = "INSERT INTO PROCESSO (CATEGORIA, NU_PROCESSO, CLASSE, ST_PROCESSO, VARA, DT_DISTRIBUICAO, VL_ACAO) VALUES " +
				"('" + processo.categoria + "', '" + processo.nuProcesso + "', '" + processo.classe + "', '" + processo.stProcesso + 
				"', '" + processo.vara + "', '" + processo.dtDistribuicao + "', '" + processo.vlAcao + "')";
		db.transaction(
			function(tx) {
				tx.executeSql(sql);
			},
			function errorCB(err) {
				alert("Erro ao inserir Processo: " + err.code + ' - ' + err.message);
				return false;
			},
			function successCB() {
				alert("Sucesso ao inserir tabela Produto!");
				return true;
			});
	}
}