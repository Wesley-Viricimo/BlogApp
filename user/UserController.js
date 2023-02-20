const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    })
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

module.exports = router;