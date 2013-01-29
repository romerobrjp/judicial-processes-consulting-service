var db;
var processoIdDaUrl = null;

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
					function (tx, results) {
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
				        		results.rows.item(i).NU_PROCESSO + ' </h3> <p class="' + results.rows.item(i).COD_CATEGORIA + '">' 
				        		+ results.rows.item(i).DESC_CATEGORIA + '</p> </a> </li>');
					    }					    
					    if (len == 1) {
					    	$('#quant_consultas_arquivadas').text(len + " Consulta Arquivada");
					    }
					    else if (len > 1) {
					    	$('#quant_consultas_arquivadas').text(len + " Consultas Arquivadas");
					    }
					    
					    $('#lista_historico').listview('refresh');
					},
					function (err) {
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

function carregarInfoProcessoArquivadoPorId(id) {
	if (db) {
		db.transaction(
			function(tx) {
				var sql = "SELECT * FROM PROCESSO WHERE PROCESSO.ID = ?";
				tx.executeSql(
					sql, 
					[id],
					function (tx, results) {
						if (results.rows.length > 0) {
							if (results.rows.item(0).COD_CATEGORIA == '1grau') {
								$('#nuProcesso_1g').text(results.rows.item(0).NU_PROCESSO);
								$('#nuNovo_1g').text(results.rows.item(0).NU_NOVO);
								$('#classe_1g').text(results.rows.item(0).CLASSE);
								$('#stProcesso_1g').text(results.rows.item(0).ST_PROCESSo);
								$('#vara_1g').text(results.rows.item(0).VARA);
								$('#dtDistribuicao_1g').text(results.rows.item(0).DT_DISTRIBUICAO);
								$('#vlAcao_1g').text(results.rows.item(0).VL_ACAO);
								
								$('#aviso_info_processo').empty();
								$('#aviso_info_processo').text('Consulta Arquivada - Dados do Processo');
							}
						}
					},
					function (err) {
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

function carregarPartesArquivadasPorId(id) {
	if (db) {
		db.transaction(
			function(tx) {
				var sql = "SELECT * FROM PROCESSO " +
								"INNER JOIN PARTES ON PROCESSO.ID = PARTES.PROCESSO_ID " +
								"WHERE PROCESSO.ID = ? ORDER BY QUANDO";
				tx.executeSql(
					sql, 
					[id],
					function (tx, results) {
						var len = results.rows.length;
						if (len > 0) {
							if (results.rows.item(0).COD_CATEGORIA == '1grau') {
								for (i=0; i<results.rows.length; i++) {
									$('#lista_partes_1g').append(
										'<li> <h5>' + results.rows.item(i).NM_PARTE + '</h5>' + 
										'<p> Tipo: ' + results.rows.item(i).TIPO_PARTE + ' </p>' +
										'<p> Situação: ' + results.rows.item(i).ST_PARTE + ' </p>' +
										'<p> Advogados: ' + results.rows.item(i).ADVOGADOS + ' </p>' +
										'<p> Documento: ' + results.rows.item(i).NU_DOC + ' </p> </li>');
								}
								$('#quant_partes').empty();
								$('#quant_partes').text('Consulta Arquivada - ' + len + ' Partes');
								
								$("#lista_partes_1g").listview('refresh');
							}
						}
					},
					function (err) {
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

function carregarMovimentacoesArquivadasPorId(id) {
	if (db) {
		db.transaction(
			function(tx) {
				var sql = 	"SELECT * FROM PROCESSO " +
							"INNER JOIN MOVIMENTACOES ON PROCESSO.ID = MOVIMENTACOES.PROCESSO_ID " +
							"WHERE PROCESSO.ID = ? ORDER BY QUANDO";
				tx.executeSql(
					sql, 
					[id],
					function (tx, results) {
						var len = results.rows.length; 
						if (len > 0) {
							if (results.rows.item(0).COD_CATEGORIA == '1grau') {
								for (i=0; i<len; i++) {
									$('#lista_movimentacoes_1g').append(
										'<li>' + 
										'<h5>' + results.rows.item(i).DT_MOVIMENTACAO + '</h5>' +
										'<p> Descrição: ' + results.rows.item(i).DS_MOVIMENTACAO + ' </p>' +
										'<p> Complemento: ' + results.rows.item(i).DS_COMPLEMENTO + ' </p>' +  
										'</li>');
								}								
								$('#quant_movimentacoes').empty();
								$('#quant_movimentacoes').text('Consulta Arquivada - ' + len + ' Movimentações');
								
								$("#lista_movimentacoes_1g").listview('refresh');
							}
						}
					},
					function (err) {
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

function pegarProcessoIdPorNumero(numero, cbSucesso) {
	var processoId = 0;
	if (db) {
		db.transaction(
			function(tx) {
				var sql = "SELECT ID FROM PROCESSO WHERE NU_PROCESSO LIKE ?";
				tx.executeSql(
					sql, 
					[numero],
					function(tx, results) {
						var len = results.rows.length;
						
						if (len > 0) {
							processoId = results.rows.item(0).ID;	
						}
						
						cbSucesso(processoId);
					},
					function(err) {
						alert('Erro no executeSQL: ' + err.code + ' - ' + err.message);
					}
				);
			}
		);
	}
}

function excluirConsultasExcedentes() {
	var maxConsultas = 20;
	var quant = 0;
	if (db) {
		db.transaction(
			function(tx) {
				var sql = "SELECT * FROM PROCESSO";
				tx.executeSql(
					sql, 
					[],
					function(tx, results) {
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
	
	if (db) {
		var sql = "INSERT INTO PROCESSO (COD_CATEGORIA, DESC_CATEGORIA, NU_PROCESSO, NU_NOVO, CLASSE, ST_PROCESSO, VARA, DT_DISTRIBUICAO, VL_ACAO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

		db.transaction(
			function(tx) {
				tx.executeSql(
					sql,
					[processo.codCategoria, processo.descCategoria, processo.nuProcesso, processo.nuNovo, processo.classe, processo.stProcesso, processo.vara, processo.dtDistribuicao, processo.vlAcao],
					function (tx, results) {
						processoId = results.insertId;
						
						arquivarPartes(processo, processoId);
						arquivarMovimentacoes(processo, processoId);
						
						return true; 
					},		
					function (err) {
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
					function () {
						console.log("---Sucesso ao inserir tabela PARTES!");
						return true;
					},
					function (err) {
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
					function () {
						console.log("---Sucesso ao inserir tabela MOVIMENTACOES!");
						return true;
					},
					function (err) {
						alert("Erro ao inserir " + i + "ª movimentação: " + err.code + ' - ' + err.message);
						return false;
					}
				);
			}
		);			
	});
}

function arquivarConsulta(processo) {
	pegarProcessoIdPorNumero(processo.nuProcesso, function(id) {
		db.transaction(
			function(tx) {
				var sqlDeleteProcesso = "DELETE FROM PROCESSO WHERE ID = ?";

				tx.executeSql(sqlDeleteProcesso, [id], function(tx, results) {
					var sqlDeletePartes = "DELETE FROM PARTES WHERE PROCESSO_ID = ?";

					tx.executeSql(sqlDeletePartes, [id], function(tx, results) {
						var sqlDeleteMovimentacoes = "DELETE FROM MOVIMENTACOES WHERE PROCESSO_ID = ?";

						tx.executeSql(sqlDeleteMovimentacoes, [id], function(tx, results) {
							arquivarProcesso(processo);
						}, 
						function(error) {
							alert("Deu erro ao tentar deletar as partes");
						});
					}, 
					function(error) {
						alert("Deu erro ao tentar deletar as movimentações");
					});
				},
				function(error) {
					alert("Deu erro ao tentar deletar o processo");
				});
			}
		);

	}); 
}