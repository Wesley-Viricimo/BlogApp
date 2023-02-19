const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');

router.get("/admin/users", (req, res) => {
    res.send("Listagem de usuários");
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
});

router.post("/users/create", (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ 
        where: { //Buscar no banco se o email informado no formulário já existe 
            email: email
        }
    }).then(user => {
        if(user == undefined ) { //Se usuário for igual a indefinido significa que ainda não existe no banco de dados
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt); //Utilizando a biblioteca bcrypt para gerar um hash com a senha do usuário;

            User.create({
                username: username,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch(err => {
                res.redirect("/");
            });
        } else {
           res.redirect("/admin/users/create");
        }
    });
});

module.exports = router;