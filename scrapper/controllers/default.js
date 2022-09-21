exports.getDefault = (req, res, next) => {
    res.render('default', {
      pageTitle: 'default',
      path: '/default'
    });
  }