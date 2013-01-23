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
	tx.executeSql("DROP TABLE IF EXISTS MOVIMENTACOES");
	tx.executeSql("DROP TABLE IF EXISTS PARTES");
	tx.executeSql("DROP TABLE IF EXISTS PROCESSO");
	
	//CRIANDO AS TABELAS
	console.log("---CRIANDO TABELAS---");
	
	//PRODUTOS
	console.log("Configurando tabela PROCESSO...")
	tx.executeSql("CREATE TABLE IF NOT EXISTS PROCESSO " +
			"(" +
			"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"COD_CATEGORIA VARCHAR(10), " +
			"DESC_CATEGORIA VARCHAR(20), " +
			"NU_PROCESSO VARCHAR(30), " +
			"NU_NOVO VARCHAR(30), " +
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
			"RELATOR VARCHAR(50), " +
			"QUANDO DATE DEFAULT (DATETIME('NOW')) " +
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
			"PROCESSO_ID INTEGER, " +
			"QUANDO DATE DEFAULT (DATETIME('NOW')), " +
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
			"QUANDO DATE DEFAULT (DATETIME('NOW')), " +
			"FOREIGN KEY(PROCESSO_ID) REFERENCES PROCESSO(ID)" +
			")");
	
	console.log("---TABELAS CRIADAS---");
}

function listarProcessosArquivados() {
	if (db) {
		db.transaction(
			function(tx) {
				var id = null;
				var sqlProcesso = "SELECT * FROM PROCESSO";
				
				tx.executeSql(
					sqlProcesso, 
					[], 
					function querySuccess(tx, results) {
						var len = results.rows.length;
						
						if (len == 0) {
				    		$('#lista_historico').html('<li> Nenhuma consulta arquivada </li>');
				    	}
						
						$('#lista_historico').html('');
						
					    for (var i=0; i<len; i++) {
					    	var link;
					    	if (results.rows.item(i).COD_CATEGORIA == '1grau') {
					    		link = "processo1GrauInfo.html";
					    	}
					    	else if (results.rows.item(i).COD_CATEGORIA == '2grau') {
					    		link = "processo2GrauInfo.html";
					    	}
					    	else if (results.rows.item(i).COD_CATEGORIA == 'juizadoEspecial') {
					    		link = "processoJuizadoEspecInfo.html";
					    	}
					    	else if (results.rows.item(i).COD_CATEGORIA == 'turmaRecursal') {
					    		link = "processoTurmaRecInfo.html";
					    	}
					    	else if (results.rows.item(i).COD_CATEGORIA == 'execucaoPenal') {
					    		link = "processoExecPenalInfo.html";
					    	}

				    		$('#lista_historico').append('<li data-icon="arrow-r" data-iconpos="right"> <a href="' + link + 
			    				'?processoId=' + results.rows.item(i).ID + '"> <h3>' +
				        		results.rows.item(i).NU_PROCESSO + ' </h3> <p class="' + results.rows.item(i).COD_CATEGORIA + '">' + results.rows.item(i).DESC_CATEGORIA + '</p> </a> </li>');
					    }
					    $('#lista_historico').listview('refresh');
					},
					function queryError(err) {
						alert('Erro no executeSQL de LISTAR PROCESSOS: ' + err.code + ' - ' + err.message);
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
			var sql = "SELECT * FROM PROCESSO WHERE PROCESSO.ID = ?";
			
			var sqlPartes = "SELECT * FROM PROCESSO " +
			"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
			"WHERE PROCESSO.ID = ? " +
			"ORDER BY PARTES.WHEN";
			
			var sqlMovs = "SELECT * FROM PROCESSO " +
			"INNER JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID" +
			"WHERE PROCESSO.ID = ? " +
			"ORDER BY MOVIMENTACOES.WHEN";
			
			tx.executeSql(
				sql, 
				[id],
				function querySuccess(tx, results) {
					if (results.rows.length > 0) {
						processo.codCategoria = results.rows.item(0).COD_CATEGORIA;
						processo.descCategoria = results.rows.item(0).DESC_CATEGORIA;
						processo.nuProcesso = results.rows.item(0).NU_PROCESSO;
						processo.classe = results.rows.item(0).CLASSE;
						processo.stProcesso = results.rows.item(0).ST_PROCESSO;
						processo.vara = results.rows.item(0).VARA;
						processo.dtDistribuicao = results.rows.item(0).DT_DISTRIBUICAO;
						processo.vlAcao = results.rows.item(0).VL_ACAO;
					}
				},
				function queryError(err) {
					alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
				}
			);
		});
	}
	alert(processo.nuProcesso);
	return processo;
}

function carregarConsultaArquivadaPorId(id) {
	if (db) {
		db.transaction(
			function(tx) {
	//			var sql = "SELECT * FROM PROCESSO " +
	//					"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
	//					"JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID" +
	//					"WHERE PROCESSO.ID = " + id;
				var sqlProcesso = "SELECT * FROM PROCESSO WHERE PROCESSO.ID = ?";
				var sqlPartes = "SELECT * FROM PROCESSO " +
								"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
								"WHERE PROCESSO.ID = ?";
				var sqlMovs = "SELECT * FROM PROCESSO " +
								"INNER JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID" +
								"WHERE PROCESSO.ID = ?";
				tx.executeSql(
					sqlProcesso, 
					[id],
					function querySuccess(tx, results) {
						alert(results.rows.length);
						if (results.rows.length > 0) {
							if (results.rows.item(0).CATEGORIA == '1grau') {
								//carregando infos do processo
								alert("arquivado: " + results.rows.item(0).NU_PROCESSO);
								$('#nuProcesso_1g').text(results.rows.item(0).NU_PROCESSO);
								$('#nuProcesso_1g').text(results.rows.item(0).NU_NOVO);
								$('#classe_1g').text(results.rows.item(0).CLASSE);
								$('#stProcesso_1g').text(results.rows.item(0).ST_PROCESSo);
								$('#vara_1g').text(results.rows.item(0).VARA);
								$('#dtDistribuicao_1g').text(results.rows.item(0).DT_DISTRIBUICAO);
								$('#vlAcao_1g').text(results.rows.item(0).VL_ACAO);
							}
						}
					},
					function queryError(err) {
						alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
					}
				);
			},
			function errorCB(err) {
				alert("Erro no db.transaction: " + err.code + ' - ' + err.message);
				return false;
			}, 
			function successCB() {
				console.log("Sucesso na consulta de PROCESSO por ID!");
				return true;
			}
		);
	}
}

function verificarProcessoPorNumero(numero) {
	if (db) {
		db.transaction(
			function(tx) {
				var sql = "SELECT * FROM PROCESSO WHERE NU_PROCESSO LIKE ?";
				tx.executeSql(
					sql, 
					[numero],
					function querySuccess(tx, results) {					
						if (results.rows.length > 0) {
							return true;
						}
						else {
							return false;
						}
					},
					function queryError(err) {
						alert('Erro no executeSQL de verificarProcessoPorNumero: ' + err.code + ' - ' + err.message);
					});
			},
			function errorCB(err) {
			    alert("Error processing SQL: " + err.code);
			}
		);
	}
}

function pegarProcessoIdPorNumero(numero) {
	var processoId = null;
	
	if (db) {
		db.transaction(
			function(tx) {
				var sql = "SELECT ID FROM PROCESSO WHERE NU_PROCESSO LIKE ?";
				tx.executeSql(
					sql, 
					[numero],
					function querySuccess(tx, results) {
						var len = results.rows.length;
						alert(len + "quant pegarProcessoId");
						if (len > 0) {
							processoId = results.rows.item(0).ID;
							alert("processoId: " + processoId);
						}
					},
					function queryError(err) {
						alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
					}
				);
			}
		);
	}
	alert("pegarProcessoIdPorNumero: " + processoId);
	return processoId;
}

function excluirConultasExcedentes() {
	var maxConsultas = 20;
	var quant = 0;
	if (db) {
		db.transaction(
			function(tx) {
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
			}
		);
	}
	return quant;
}

function arquivarProcesso(processo) {
	var processoId = null;
	
	var processoJaExiste = verificarProcessoPorNumero(processo.nuProcesso);
	
	alert('Processo ja existe: ' + processoJaExiste);
	
	if (db) {
		var sql = "INSERT INTO PROCESSO (COD_CATEGORIA, DESC_CATEGORIA, NU_PROCESSO, NU_NOVO, CLASSE, ST_PROCESSO, VARA, DT_DISTRIBUICAO, VL_ACAO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

		db.transaction(
			function(tx) {
				tx.executeSql(
					sql,
					[processo.codCategoria, processo.descCategoria, processo.nuProcesso, processo.nuNovo, processo.classe, processo.stProcesso, processo.vara, processo.dtDistribuicao, processo.vlAcao],
					function querySuccess(tx, results) {
						processoId = results.insertId;
						
						arquivarPartes(processo, processoId);
						arquivarMovimentacoes(processo, processoId);
						
						return true; 
					},		
					function queryError(err) {
						alert("---Erro ao inserir Processo: " + err.code + ' - ' + err.message);
						return false;
					}
				);
			}		
		);
	}
	else {
		alert("Sem banco ativo para efetuar transação.");
	}
}

function arquivarPartes(processo, processoId) {
	//persistindo as partes ------------------------------------------------------------------------------------------------
	$(processo.partes).each(function(i, p) {
		var sql = "INSERT INTO PARTES (NM_PARTE, TIPO_PARTE, ST_PARTE, ADVOGADOS, NU_DOC, PROCESSO_ID) VALUES(?, ?, ?, ?, ?, ?)";
		
		db.transaction(
			function(tx) {
				tx.executeSql(
					sql,
					[p.nmParte, p.tipoParte, p.stParte, p.advogados, p.nuDoc, processoId],
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
		);		
	});
}

function arquivarMovimentacoes(processo, processoId) {
	//persistindo as movimentacoes -----------------------------------------------------------------------------------------------
	$(processo.movimentacoes).each(function(i, m) {
		var sql = "INSERT INTO MOVIMENTACOES (DT_MOVIMENTACAO, DS_MOVIMENTACAO, DS_COMPLEMENTO, DT_NASCIMENTO, NM_PAI, NM_MAE, PROCESSO_ID) VALUES " +
			"(?, ?, ?, ?, ?, ?, ?)";
		
		db.transaction(
			function(tx) {
				tx.executeSql(
					sql,
					[m.dtMovimentacao, m.dsMovimentacao, m.dsComplemento, m.dtNascimento, m.nmPai, m.nmMae, processoId],
					function querySuccess() {
						console.log("---Sucesso ao inserir tabela MOVIMENTACOES!");
						return true;
					},
					function queryError(err) {
						alert("Erro ao inserir " + i + "ª movimentação: " + err.code + ' - ' + err.message);
						return false;
					}
				);
			}
		);			
	});
}