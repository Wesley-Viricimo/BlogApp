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
        res.redirect("admin/articles");
    }

    Article.findByPk(id).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article: article, categories: categories});
            })
        } else {
            res.redirect("admin/articles");
        }
    }).catch(err => {
        res.redirect("admin/articles");
    });
});

router.post("/articles/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.update({title: title, body: body, categoryId: category, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

router.get("/articles/page/:num", (req, res)=> {
    let page = req.params.num; //Recebendo o número da página acessada como parâmetro da rota
    let offset = 0; //Inicializando offset

    if(isNaN(page) || page == 1) { //Se a página recebida não for um número ou se a página recebida for 1
        offset = 0; 
    } else { 
        offset = (parseInt(page) - 1) * 4; //Convertendo a minha página para inteiro e subtraindo 1 e mutiplicando pelo limite de exibição de artigos por página
    }
 
    Article.findAndCountAll({
        limit: 4, //Limite de exibição de artigos por página
        offset: offset, //Passando a variável offset para dentro propriedade offset
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        let next;

        if(offset + 4 >= articles.count) { //Se a variável offset + 4 for maior que a quantidade máxima de artigos, significa que não tem mais artigos para serem exibidos em uma próxima página
            next = false;
        } else {
            next = true;
        }

        let result = { //Criando um array que contém a página, a variável que controla se existem mais artigos para serem exibidos e os artigos
            page: parseInt(page),
            next : next,
            articles : articles
        }

        Category.findAll().then(categories => { 
            res.render("admin/articles/page", {result: result, categories: categories})//Enviando para a view o meu array e as categorias
        })

        
    })
})

module.exports = router;