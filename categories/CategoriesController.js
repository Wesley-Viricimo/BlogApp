const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

//Rota que contem o formulário para cadastro de nova categoria
router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
    let title = req.body.title; //Recupera titulo informado no formulario pelo usuário

    if(title != undefined) {//Se o título for diferente de indefinido
        Category.create({ //Salvar no banco de dados, no model de categorias
            title: title, //Na coluna titulos salvar o titulo informado pelo usuario
            slug: slugify(title) //Na coluna slug, transformar a string titulo em uma slug
        }).then(() => { //Após salvar as informações no banco de dados, redirecionar para a rota principal
            res.redirect("/");
        });
    } else { //Se o título receber valor indefinido redirecionar para a rota de criação de categorias
        res.redirect("/admin/categories/new");
    }
});


router.get("/admin/categories", (req,res) => {
    //Função findAll irá buscar no banco as categorias existentes e o método then irá retornar as categorias encontradas
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });
});

router.post("/categories/delete", (req, res) => {
    let id = req.body.id;//Recebendo o id da categoria que irá ser deletada

    if(id != undefined) {
        if(!isNaN(id)){//Verifica se o valor é numérico ou não
            Category.destroy({ //Deletar a categoria que tenha o id no banco de dados igual ao id recuperado na requisição
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        } else { //Se o id não for numérico
            res.redirect("/admin/categories");
        }
    } else { //Se o id for nulo
        res.redirect("/admin/categories");
    }
});

module.exports = router;