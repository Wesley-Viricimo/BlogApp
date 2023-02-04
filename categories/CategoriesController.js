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
            res.redirect("/admin/categories");
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

router.get("/admin/categories/edit/:id", (req, res) => {
    let id = req.params.id;// Recebendo o id da categoria como parâmetro e atribuindo à variável

    if(isNaN(id)) {
        res.redirect("/admin/categories");
    }

    // Procurando um id que seja igual ao id recebido como parâmetro
    Category.findByPk(id).then(category => { // Ao encontrar enviar esta categoria encontrada
        if(id != undefined){ // Se o id for diferente de indefinido
            res.render("admin/categories/edit",{category: category});
        } else { // Se for valor indefinido redirecionar para a rota de categorias
            res.render("/admin/categories");
        }
    }).catch(erro => { // Se der erro redirecionar para a rota de categorias
        res.redirect("/admin/categories");
    });
});

router.post("/categories/update", (req, res) => {
    let id = req.body.id; //Recebendo o id da categoria via formulário
    let title = req.body.title;//Recebendo o título da categoria via formulário

    Category.update({//Editar o título e slug da categoria
        title: title,
        slug: slugify(title)}, 
        { where: {
            id: id //Onde o id do banco de dados é igual ao id recebido do formulário
        }
    }).then(() => {
        res.redirect("/admin/categories");
    })
});

module.exports = router;