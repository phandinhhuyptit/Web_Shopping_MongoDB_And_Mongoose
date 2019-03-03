exports.GetError404 = (req, res, next) => {
    res.status(404).render('404', {


        TitlePage: 'Page Not Found',
        Path: '/404',
        isAuthenticated: req.session.isLoggedIn,
        NameAccount: req.user ? req.user.Name : null,
    });

}
exports.GetError500 = (req, res, next) => {
    res.status(500).render('500', {
        TitlePage: 'Error!',
        Path: '/500',
        isAuthenticated: req.session.isLoggedIn,
        NameAccount: req.user ? req.user.Name : null,
    });
};
