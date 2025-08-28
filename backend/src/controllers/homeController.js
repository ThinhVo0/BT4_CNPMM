export const getHomepage = (req, res) => {
  res.render('index.ejs', { name: req.user.name });  // Giả sử có middleware auth gán req.user
};