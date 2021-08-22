
module.exports = {
  index: (req, res) => {
    res.render("index", {
      title: "Traditional Games",
      layout: "layouts/main",
    });
  }
}