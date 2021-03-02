var Routes = function (app,router) {

    this.app = app;
    this.router = router;
    this.init();

};
module.exports = Routes;


Routes.prototype.init = function () {

    var self = this;

    //Session check each routes
    var sessionCheck = function (req, res, next) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            req.session.sessionObj = JSON.parse(sessionObj);
            next();
        } else {
            res.redirect(self.app.conf.basepath+'/login');
        }
    };



    self.router.get('/', sessionCheck, function (req, res) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            res.render('dashboard.html', {layout: '',sessionObj:req.session.sessionObj, basepath:self.app.conf.basepath});
        } else {
            res.redirect(self.app.conf.basepath+'/login');
        }


    });

    self.router.get('/login', function (req, res) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            res.redirect(self.app.conf.basepath+'/dashboard');
        } else {
            if(self.app.conf.domainKey){
                res.render('login-custom.html', {layout: false, basepath:self.app.conf.basepath,domainKey: self.app.conf.domainKey});
            }else{
                res.render('login.html', {layout: false, basepath:self.app.conf.basepath});
            }
        }
    });


    self.app.use(self.app.conf.basepath,self.router);


};

