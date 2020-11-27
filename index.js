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