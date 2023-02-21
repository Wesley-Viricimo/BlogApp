const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
});

router.post("/users/create", (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ //Verifica se já existem usuários ou emails salvos iguais ao que o usuário informar
        where: { 
            [Op.or]: 
            [
                {username: username},
                {email: email}
            ]
        }
    }).then(user => {
        if(user == undefined) { //Se usuário for igual a indefinido significa que ainda não existe no banco de dados
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt); //Utilizando a biblioteca bcrypt para gerar um hash com a senha do usuário;

            User.create({
                username: username,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/users");
            }).catch(err => {
                res.redirect("/users");
            });
        } else {
           res.redirect("/admin/users/create");
        }
    });
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if(user != undefined) { //Se o usuário for diferente de undefined ele já está criado
            const validationPassword = bcrypt.compareSync(password, user.password); //Compara o hash da senha salva no banco com a senha informada pelo usuário

            if(validationPassword) { //Se a validação de senha retornar verdadeiro > Senha correta
                req.session.user = { //Salvar as informações do usuário em uma sessão
                    id: user.id,
                    username: user.username
                }
                res.redirect("/admin/articles");
            } else { // Se a validação de senha retornar falso > Senha incorreta
                res.redirect("/admin/articles");
            }
        } else { //Se usuário não existir
            res.redirect("/login");
        }
    })

});

router.get("/logout", (req, res) => {
    res.session.user = undefined;
    res.redirect("/");
});

module.exports = router;