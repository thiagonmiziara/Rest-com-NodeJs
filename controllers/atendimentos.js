const Atendimento = require('../models/atendimentos');

module.exports = app => {
    // crianto um get
    app.get('/atendimentos', (req, res) => res.send('Você está na rota de atendimentos e está realizando um GET'))
        // criando um post
    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body;

        Atendimento.adiciona(atendimento, res);
    });
}