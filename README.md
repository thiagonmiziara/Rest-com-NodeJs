<h1>Passo a passo da API:</h1>

Para iniciarmos o projeto API no nodeJs temos o comando do NPM: npm init

Comando para instalar Express :  npm install express

como chamar os modulos do Express para index.js :
const express = require('express'); tem que chamar como string porque ele é uma biblioteca

para criar seu app : const app = express();

para criar o servidor : app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

para verificar se o servidor esta funcionando no console uma o comando ; node index.js

criando uma rota no node; app.get('/atendimentos', (req, res) => res.send('Você está na rota de atendimentos'));

para criar um atalho para noa digitar no console mais node index.js no packge.json nos scripts coloca  "start": "node index.js", 

instalando nodemon ; npm install --save-dev nodemon

para inicializar esta lib tem que configurar os scripts para.

  "scripts": {
        "start": "nodemon index.js"}

apos feito isso tem que criar uma pasta controller e criar um modulo.export para esportar a função app
module.exports = app => {
    app.get('/atendimentos', (req, res) => res.send('Você está na rota de atendimentos e está realizando um GET'));
}

após feito isso tem que instalar consing ; npm install consign

apos isso no index.js  inporta o consing .
const consign = require('consign');
e executa o consign.

consign(){
    .include('controllers') // aqui estou importando a pasta controllers 
    .into(app); // aqui estou incluindo no app
}

apos feito isso cria uma nova pasta conif. com um arquivo cunstomExpress.js e nele passa todas as configuraçoes:
const express = require('express');
const consign = require('consign');

module.exports = () => {
    const app = express();

    consign()
        .include('controllers')
        .into(app);

    return app;
}

apos feito isso na pagina index.js temos que importar o arquivo customExpress como ele é uma function temos que executalo tbm

const customExpress = require('./config/customExpress');

const app = customExpress();

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));


apos isso vamos fazer um post no controller agora a função vai ficar assim 

module.exports = app => {
    // crianto um get
    app.get('/atendimentos', (req, res) => res.send('Você está na rota de atendimentos e está realizando um GET'))
        // criando um post
    app.post('/atendimentos', (req, res) => {

        console.log(req.body)
        res.send('Você está na rota de atendimentos e está realizando um POST')

    })
}


apos isso vamos instalar mais uma lib a body.parser com o npm ; npm install body-parser

apos instalação da lib temos que configurar no arquivo cusntomExpress e ele vai ficar assim 

const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')

module.exports = () => {
 const app = express()

 app.use(bodyParser.urlencoded({ extended: true }))
 app.use(bodyParser.json())

 consign()
   .include('controllers')
   .into(app)

 return app
}


feito isso temos que intalar o mysql com o comando npm install mysql
 
após a instalação do mysql temos que criar um schema no worband e criar uma pasta no vscode com o nome infraestrutura com o arquivo conexao.js e configurar o banco de dados do mysql :

const mysql = require('mysql');

const conexao = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'senha',
    database: 'agenda-petshop'
});

module.exports = conexao; 

apos feito esta configuração temos que ir nor aquivo principal index.js e fazer a conexao como está abaixo

const customExpress = require('./config/customExpress');
const conexao = require('./infraestrutura/conexao');

conexao.connect(erro => {
    if (erro) {
        console.log(erro, 'Não está funcionando');
    } else {
        console.log('Conectado com sucesso!');
        const app = customExpress();
        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
    }
});

apos feito isso precisamos criar as tabelas , mais vamos criar as tabelas com um script dentro da pasta infraestrutura criamos o arquivo
tabelas.js e criamos uma classe.

class Tabelas {
    init(conexao) {
        this.conexao = conexao;

        this.criarAtendimentos();
    }

    criarAtendimentos() {
        const sql = 'CREATE TABLE IF NOT EXISTS Atendimentos (id int NOT NULL AUTO_INCREMENT, cliente varchar(50) NOT NULL, pet varchar(20), servico varchar(20) NOT NULL ,status varchar(20) NOT NULL, observacoes text, PRIMARY KEY (id)) '

        this.conexao.query(sql, erro => {
            if (erro) {
                console.log(erro, 'Não foi possivel criar a tabela');
            } else {
                console.log('Tabela Atendimentos criada com sucesso!');
            }
        })
    }
}

module.exports = new Tabelas;


apos criar a classe e exportar fazemos a conexao com o index.js com o codigo abaixo

const customExpress = require('./config/customExpress');
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas');

conexao.connect(erro => {
    if (erro) {
        console.log(erro, 'Não está funcionando');
    } else {
        console.log('Conectado com sucesso!');

        Tabelas.init(conexao);

        const app = customExpress();
        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
    }
});



apos feito isso temos que criar mais uma pasta com nome modules e um arquivo com o nome atendimento.js e criar uma class que vai ser responsavel de setar os dados no mysql 

const conexao = require('../infraestrutura/conexao');

class Atendimento {

    adiciona(atendimento) {
        const sql = 'INSERT INTO Atendimentos SET ?'

        conexao.query(sql, atendimento, (erro, resultados) => {
            if (erro) {
                console.log(erro, 'Erro ao adicionar atendimento');
            } else {
                console.log(resultados);
            }
        });
    }
}
module.exports = new Atendimento;


apos feito isso vamos no arquivo atendimentos.js e importamos a class Atendimento e fazemos o seguinte codigo abaixo;

const Atendimento = require('../models/atendimentos');

module.exports = app => {
    // crianto um get
    app.get('/atendimentos', (req, res) => res.send('Você está na rota de atendimentos e está realizando um GET'))
        // criando um post
    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body;

        Atendimento.adiciona(atendimento);
        res.send('Você está na rota de atendimentos e está realizando um POST')

    })
}

apos feito isso temo que adicionar dois novos campos na tabela o campo data e o dataCriacao como esta abaixo

class Tabelas {
    init(conexao) {
        this.conexao = conexao;

        this.criarAtendimentos();
    }

    criarAtendimentos() {
        const sql = 'CREATE TABLE  IF NOT EXISTS Atendimentos (id int NOT NULL AUTO_INCREMENT, cliente varchar(50) NOT NULL, pet varchar(20), servico varchar(20) NOT NULL, data  datetime NOT NULL, dataCriacao datetime NOT NULL,status varchar(20) NOT NULL, observacoes text, PRIMARY KEY (id)) '

        this.conexao.query(sql, erro => {
            if (erro) {
                console.log(erro, 'Não foi possivel criar a tabela');
            } else {
                console.log('Tabela Atendimentos criada com sucesso!');
            }
        });
    }
}

module.exports = new Tabelas;

apos feito isso temos que adicionar a data na class Atendimento como esta abaixo e instalar uma nova lib para ela converter a data para o formato que o banco de dados sql aceite e nao der mais erro com a lib moment comando para instalar = npm install moment

apos instalar a lib moment vamos configurar na class Atendimento com o seguinte codigo

const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Atendimento {

    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        const atendimentoDatado = {...atendimento, dataCriacao, data }
        const sql = 'INSERT INTO Atendimentos SET ?';

        conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if (erro) {
                console.log(erro, 'Erro ao adicionar atendimento');
            } else {
                console.log(resultados, 'ok');
            }
        });
    }
}
module.exports = new Atendimento;


apos feito isso pegamos o res do atendimento.js/controlers e adicionamos no atendimento.js/ models e alteramos as mensagens de erro e de sucesso com status code com o seuinte codigo abaixo ;


const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Atendimento {

    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        const atendimentoDatado = {...atendimento, dataCriacao, data }
        const sql = 'INSERT INTO Atendimentos SET ?';

        conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(resultados);
            }
        });
    }
}
module.exports = new Atendimento;



