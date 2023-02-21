const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-sessions");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

//View engine
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com sucesso");
    }).catch(() => {
        console.log("Erro!");
    });
    
app.use("/", categoriesController);  
app.use("/", articlesController);  //Definindo os controllers que serão utilizados
app.use("/",usersController);   

app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => { //Buscando as categorias no banco de dados e enviando para a view de artigos
            res.render("index", {articles: articles, categories: categories})
        });
    });
});

app.get("/:slug", (req, res) => { 
    let slug = req.params.slug;
    Article.findOne({ //Procurar um artigo com a slug que o usuário informar na rota
        where:{
            slug: slug
        }
    }).then(article => {
        if(article != undefined){ 
            Category.findAll().then(categories => { //Buscando as categorias no banco de dados e enviando para a view de artigos
                res.render("article", {article: article, categories: categories})
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => { //Se der algum erro
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] //Join para retornar todos os artigos que fazem parte da categoria selecionada
    }).then( category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.listen(8080, () => {
    console.log("O servidor está rodando");
});