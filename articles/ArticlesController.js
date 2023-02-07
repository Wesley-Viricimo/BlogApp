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
});

router.post("/articles/delete", (req, res) => {
    let id = req.body.id;//Recebendo o id da categoria que irá ser deletada

    if(id != undefined) {
        if(!isNaN(id)){//Verifica se o valor é numérico ou não
            Article.destroy({ //Deletar a categoria que tenha o id no banco de dados igual ao id recuperado na requisição
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        } else { //Se o id não for numérico
            res.redirect("/admin/articles");
        }
    } else { //Se o id for nulo
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id;

    if(isNaN(id)) { //Se o id não for um número
        res.redirect("admin/categories");
    }

    Article.findByPk(id).then(article => {
        if(id != undefined) {
            res.render("admin/articles/edit", {article: article});
        } else {
            res.redirect("admin/categories");
        }
    }).catch(err => {
        res.redirect("admin/categories");
    });

})

module.exports = router;