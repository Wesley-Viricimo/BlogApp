function adminAuth(req, res, next) {
    if(req.session.user != undefined) {
        if(req.session.user.level == 1 || req.session.user.level == 2){
            next();
        } else{
            res.render("admin/users/admin");
        }
    } else {
        res.redirect("/login");
    }
}

module.exports = adminAuth;