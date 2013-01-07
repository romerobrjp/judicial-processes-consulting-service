var db;
var processoId = null;

function erro(e) {
	console.log("transacao erro");
	alert(e);
}

function finallyy() {
	console.log("transacao finally");
}

function configurarBanco() {
	db = window.openDatabase("consultaMobile", "1.0", "consultaMobile", (1024 * 1024) * 4);
	if (db) {
		db.transaction(gerarTabelas, erro, finallyy);
	}
	else {
		alert("configurarBanco(): Banco nao configurado");
	}
}

function gerarTabelas(tx) {
//	tx.executeSql("DROP TABLE IF EXISTS MOVIMENTACOES");
//	tx.executeSql("DROP TABLE IF EXISTS PARTES");
//	tx.executeSql("DROP TABLE IF EXISTS PROCESSO");
	
	//CRIANDO AS TABELAS
	console.log("---CRIANDO TABELAS---");
	
	//PRODUTOS
	console.log("Configurando tabela PROCESSO...")
	tx.executeSql("CREATE TABLE IF NOT EXISTS PROCESSO " +
			"(" +
			"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"CATEGORIA VARCHAR(20), " +
			"NU_PROCESSO VARCHAR(30), " +
			"NU_PROCESSO_1_GRAU VARCHAR(30), " +
			"CLASSE VARCHAR(20), " +
			"CLASSE_ORIGEM VARCHAR(20), " +
			"ST_PROCESSO VARCHAR(20), " +
			"VARA VARCHAR(80), " +
			"DT_DISTRIBUICAO VARCHAR(10), " +
			"TP_DISTRIBUICAO VARCHAR(20), " +
			"VL_ACAO VARCHAR(20), " +
			"NM_ORGAO VARCHAR(30), " +
			"NM_LOCAL VARCHAR(30), " +
			"NM_VOLUME VARCHAR(30), " +
			"DT_ENTRADA VARCHAR(10), " +
			"DT_AUTUACAO VARCHAR(10), " +
			"TURMA VARCHAR(30), " +
			"PRESIDENTE VARCHAR(50), " +
			"RELATOR VARCHAR(50)" +
			")");
	
	//PARTES DO PROCESSO
	console.log("Configurando tabela PARTES...")
	tx.executeSql("CREATE TABLE IF NOT EXISTS PARTES " +
			"(" +
			"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"NM_PARTE VARCHAR(50), " +
			"TIPO_PARTE VARCHAR(10), " +
			"ST_PARTE VARCHAR(10), " +
			"ADVOGADOS VARCHAR(100), " +
			"NU_DOC VARCHAR(20), " +
			"PROCESSO_ID INTEGER," +
			"FOREIGN KEY(PROCESSO_ID) REFERENCES PROCESSO(ID)" +
			")");
	
	//MOVIMENTACOES DO PROCESSO
	console.log("Configurando tabela MOVIMENTACOES...")
	tx.executeSql("CREATE TABLE IF NOT EXISTS MOVIMENTACOES " +
			"(" +
			"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"DT_MOVIMENTACAO VARCHAR(10), " +
			"DS_MOVIMENTACAO VARCHAR(100), " +
			"DS_COMPLEMENTO VARCHAR(200), " +
			"NM_PAI VARCHAR(100), " +
			"NM_MAE VARCHAR(100), " +
			"DT_NASCIMENTO, " +
			"PROCESSO_ID INTEGER, " +
			"FOREIGN KEY(PROCESSO_ID) REFERENCES PROCESSO(ID)" +
			")");
	
	console.log("---TABELAS CRIADAS---");
}

function listarProcessos() {
	if (db) {
		db.transaction(
			function(tx) {
				var id = null;
				var sqlProcesso = "SELECT *, CATEGORIA FROM PROCESSO";
				var sqlPartes = "SELECT * FROM PROCESSO " +
				"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
				"WHERE PROCESSO.ID = " + id;
				var sqlMovs = "SELECT * FROM PROCESSO " +
				"INNER JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID" +
				"WHERE PROCESSO.ID = " + id;
				
				tx.executeSql(
					sqlProcesso, 
					[], 
					function consultaSucesso(tx, results) {
						var len = results.rows.length;
						
						if (len == 0) {
				    		$('#lista_historico').html('<li> Nenhuma consulta arquivada </li>');
				    	}
						
						$('#lista_historico').html('');
						
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

//				    		$('#lista_historico').append(
//				    			'<li>' + 
//				    				'<h3>' + results.rows.item(i).NU_PROCESSO + ' </h3> ' + 
//					    			'<p>' + results.rows.item(i).CATEGORIA + '</p>' + 
//				    				'<ul>' +
//				    					'<li>' + results.rows.item(i).NU_PROCESSO + '</li>' +
//				    				'</ul>' +
//			    				'</li>');				    		
				    		
				    		$('#lista_historico').append('<li data-icon="arrow-r" data-iconpos="right"> <a href="' + link + 
			    				'?processoId=' + results.rows.item(i).ID + '"> <h3>' +
				        		results.rows.item(i).NU_PROCESSO + ' </h3> <p>' + results.rows.item(i).CATEGORIA + '</p> </a> </li>');
					    }
					    $('#lista_historico').listview('refresh');
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
		alert("listarProcessos(): Banco não configurado");
	}
}

function pegarProcessoPorId(id) {
	var processo = new Processo();
	var pate = new Parte();
	var mov = new Movimentacao();
	
	if (db) {
		db.transaction(function(tx) {
//			var sql = "SELECT * FROM PROCESSO " +
//					"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
//					"JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID" +
//					"WHERE PROCESSO.ID = " + id;
			var sql = "SELECT * FROM PROCESSO WHERE PROCESSO.ID = " + id;
			tx.executeSql(
				sql, 
				[],
				function consultaSucesso(tx, results) {
					if (results.rows.length > 0) {
						processo.categoria = results.rows.item(0).CATEGORIA;
						processo.nuProcesso = results.rows.item(0).NU_PROCESSO;
						processo.classe = results.rows.item(0).CLASSE;
						processo.stProcesso = results.rows.item(0).ST_PROCESSO;
						processo.vara = results.rows.item(0).VARA;
						processo.dtDistribuicao = results.rows.item(0).DT_DISTRIBUICAO;
						processo.vlAcao = results.rows.item(0).VL_ACAO;
					}
				},
				function(err) {
					alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
				})
			},
			[],
			function() {
				console.log("Sucesso na consulta de PROCESSO por ID!");
				return true;
			},
			function(err) {
				alert("Erro no db.transaction: " + err.code + ' - ' + err.message);
				return false;
			}
		);
	}
	return processo;
}

function carregarConsultaArquivadaPorId(id) {
	if (db) {
		db.transaction(function(tx) {
//			var sql = "SELECT * FROM PROCESSO " +
//					"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
//					"JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID" +
//					"WHERE PROCESSO.ID = " + id;
			var sqlProcesso = "SELECT * FROM PROCESSO WHERE PROCESSO.ID = " + id;
			var sqlPartes = "SELECT * FROM PROCESSO " +
							"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
							"WHERE PROCESSO.ID = " + id;
			var sqlMovs = "SELECT * FROM PROCESSO " +
							"INNER JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID" +
							"WHERE PROCESSO.ID = " + id;
			tx.executeSql(
				sql, 
				[],
				function consultaSucesso(tx, results) {
					if (results.rows.length > 0) {
						if (results.rows.item(0).CATEGORIA == '1grau') {
							//carregando infos do processo			
							$('#nuProcesso_1g').text(results.rows.item(0).NU_PROCESSO);
							$('#classe_1g').text(results.rows.item(0).CLASSE);
							$('#stProcesso_1g').text(results.rows.item(0).ST_PROCESSo);
							$('#vara_1g').text(results.rows.item(0).VARA);
							$('#dtDistribuicao_1g').text(results.rows.item(0).DT_DISTRIBUICAO);
							$('#vlAcao_1g').text(results.rows.item(0).VL_ACAO);
						}
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
			console.log("Sucesso na consulta de PROCESSO por ID!");
			return true;
		});
	}
}

function verificarProcessoPorNumero(numero) {
	if (db) {
		db.transaction(function(tx) {
			var sql = "SELECT * FROM PROCESSO WHERE NU_PROCESSO LIKE '" + numero + "'";
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

function pegarProcessoIdPorNumero(numero) {
	var processoId = null;
	
	if (db) {
		db.transaction(function(tx) {
			var sql = "SELECT ID FROM PROCESSO WHERE NU_PROCESSO LIKE '" + numero + "'";
			alert(sql);
			tx.executeSql(
				sql, 
				[],
				function consultaSucesso(tx, results) {
					var len = results.rows.length;
					alert(len + "quant pegarProcessoId");
					if (len > 0) {
						processoId = results.rows.item(0).ID;
						alert("processoId: " + processoId);
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
	alert("pegarProcessoIdPorNumero: " + processoId);
	return processoId;
}

function excluirConultasExcedentes() {
	var maxConsultas = 20;
	var quant = 0;
	if (db) {
		db.transaction(function(tx) {
			var sql = "SELECT * FROM PROCESSO";
			tx.executeSql(
				sql, 
				[],
				function consultaSucesso(tx, results) {
					quant = results.rows.length;
					if (quant > maxConsultas) {
						alert(quant - maxConsultas + " consultas a mais que o permitido");
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
			console.log("Sucesso na consulta de quantConsultasArquivadas!");
			return true;
		});
	}
	return quant;
}


function arquivarProcesso(processo) {
	var processoId = null;
	
	if (db) {
		var sql = "INSERT INTO PROCESSO (CATEGORIA, NU_PROCESSO, CLASSE, ST_PROCESSO, VARA, DT_DISTRIBUICAO, VL_ACAO) VALUES " +
			"('" + processo.categoria + "', '" + processo.nuProcesso + "', '" + processo.classe + "', '" + processo.stProcesso + 
			"', '" + processo.vara + "', '" + processo.dtDistribuicao + "', '" + processo.vlAcao + "')";

		db.transaction(
			function(tx) {
//				alert(sql);
				tx.executeSql(
					sql,
					[],
					function querySuccess(tx, results) {
						processoId = results.insertId;
						alert("processoId: " + results.insertId);
						alert("processoId: " + processoId);
						console.log("---Sucesso ao inserir tabela Processo!");
						return true; 
					},		
					function queryError(err) {
						alert("---Erro ao inserir Processo: " + err.code + ' - ' + err.message);
						return false;
					}
				);
			}		
		);		
//		alert("processoId: " + processoId);
		//persistindo as partes ------------------------------------------------------------------------------------------------
		for (i=0; i<processo.partes.length; i++) {
			sql = "INSERT INTO PARTES (NM_PARTE, TIPO_PARTE, ST_PARTE, ADVOGADOS, NU_DOC, PROCESSO_ID) VALUES " +
				"('" + processo.partes[i].nmParte + "', '" + processo.partes[i].tipoParte + "', '" + processo.partes[i].stParte + 
				"', '" + processo.partes[i].advogados + "', '" + processo.partes[i].nuDoc + "', '" + processoId + "')";
//			alert(sql);
//			alert("Partes processoId: " + processoId);
			db.transaction(
				function(tx) {
					tx.executeSql(sql);
				},
				[],
				function querySuccess() {
					console.log("---Sucesso ao inserir tabela PARTES!");
					return true;
				},
				function queryError(err) {
					alert("Erro ao inserir " + i + "ª parte: " + err.code + ' - ' + err.message);
					return false;
				}
			);				
		}
		
		//persistindo as movimentacoes -----------------------------------------------------------------------------------------------
//		for (var m in processo.movimentacoes) {
//			sql = "INSERT INTO MOVIMENTACOES (DT_MOVIMENTACAO, DS_MOVIMENTACAO, DS_COMPLEMENTO, DT_NASCIMENTO, NM_PAI, NM_MAE, PROCESSO_ID) VALUES " +
//				"('" + processo.movimentacoes[i].dtMovimentacao + "', '" + processo.movimentacoes[i].dsMovimentacao + 
//				"', '" + processo.movimentacoes[i].dsComplemento + "', '" + processo.movimentacoes[i].dtNascimento + 
//				"', '" + processo.movimentacoes[i].nmPai + "', '" + processo.movimentacoes[i].nmMae + "', '" + processoId + "')";
////			alert(sql);
//			db.transaction(
//				function(tx) {
//					tx.executeSql(sql);
//				},
//				[],
//				function querySuccess() {
//					console.log("---Sucesso ao inserir tabela MOVIMENTACOES!");
//					return true;
//				},
//				function queryError(err) {
//					alert("Erro ao inserir " + i + "ª movimentação: " + err.code + ' - ' + err.message);
//					return false;
//				}
//			);			
//		}
	}
	else {
		alert("Sem banco ativo para efetuar transação.");
	}
}