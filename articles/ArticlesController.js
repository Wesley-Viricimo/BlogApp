const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const slugify = require("slugify");
const Article = require("./Article");

router.get("/admin/articles", (req,res) => {
    Article.findAll({
        include: [{model: Category}]//JOIN DE ARTIGO COM CATEGORIA - Incluindo os dados do model de categorias na busca de artigos 
    }).then((articles) => {
        res.render("admin/articles/index", {articles: articles});
    })
});

router.get("/admin/articles/new", (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    })
});

router.post("/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category; //Recuperando a categoria no qual será escrito o artigo

    if(title != undefined && body != undefined) {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category //Salvando na coluna categoryId o id da categoria no qual será escrito o artigo
        }).then(() => {
            res.redirect("/admin/articles");//
        });
    } else {
        res.redirect("admin/articles/new");
    }
    
})

module.exports = router;