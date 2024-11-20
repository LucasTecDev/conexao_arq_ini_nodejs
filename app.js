const sql = require('mssql');
const fs = require('fs');
const xml2js = require('xml2js');

// Caminho do arquivo de configuração
const configFile = 'C:/Shop9/ArqID9.txt';

// Função para carregar e processar o arquivo XML
async function loadConfig(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parser = new xml2js.Parser();
    const config = await parser.parseStringPromise(data);

    // Extrair informações do arquivo XML
    const conexao = config.SHOP9.CONEXAO[0];
    return {
        user: conexao.Usuario[0],
        password: conexao.Senha[0],
        server: conexao.Servidor[0].split(',')[0], // Extrai apenas o servidor
        port: parseInt(conexao.Servidor[0].split(',')[1], 10), // Extrai a porta
        options: {
            encrypt: false, // Ajuste conforme necessário
            enableArithAbort: true,
        },
        timeout: parseInt(conexao.Timeout[0], 10), // Apenas como referência, não usado diretamente
    };
}

(async () => {
    try {
        // Carregar configuração do arquivo XML
        const dbConfig = await loadConfig(configFile);
        // Conectar ao banco de dados
        const pool = await sql.connect(dbConfig);
        console.log('Conexão bem-sucedida!');

        // Exemplo de consulta
        //const result = await pool.request().query('SELECT * FROM S9_Real..Funcionarios');
        //console.log(result.recordset);

        // Fechar a conexão
        await pool.close();
    } catch (err) {
        console.error('Erro ao conectar ao SQL Server:', err);
    }
})();
