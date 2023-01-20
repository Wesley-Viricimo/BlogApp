const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");//Importando o model de categoria

const Article = connection.define('articles',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article);//Definindo que uma categoria pode conter vários artigos (1 P N);
Article.belongsTo(Category);//Definindo que um artigo pertence a uma categoria (1 P 1);

//Article.sync({force: true});//Cria a tabela ao ser executada a aplicação

module.exports = Article;