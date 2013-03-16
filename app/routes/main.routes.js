
var exports = module.exports = {};

exports.home = function(req, res, next){
  res.render('index', {
    title: 'Read My Feed'
  });
};

