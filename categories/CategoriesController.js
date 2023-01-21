const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) =>{
    res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
    let title = req.body.title; //Recupera titulo informado no formulario pelo usuário;

    if(title != undefined){//Se o título for diferente de indefinido...
        Category.create({ //Salvar no banco de dados, no model de categorias
            title: title, //Na coluna titulos salvar o titulo informado pelo usuario;
            slug: slugify(title) //Na coluna slug, transformar a string titulo em uma slug
        }).then(() => {
            res.redirect("/");
        });

    } else {
        res.redirect("/admin/categories/new");
    }
});

module.exports = router;