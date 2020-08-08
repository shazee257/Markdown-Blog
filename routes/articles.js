const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const article = require("../models/article");

// Get articles/new
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

// Get articles/edit/:id
router.get("/edit/:id", async (req, res) => {
  const article = await Article.findOne({ _id: req.params.id }).lean();
  res.render("articles/edit", { article });
});

// PUT articles/:id
router.put("/:id", async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
  });
  res.redirect(`/articles/${article.slug}`);
});

// Post articles
router.post("/", async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.redirect(`articles/${article.slug}`);
  } catch (err) {
    console.log(err);
    res.render("articles/new", { article });
  }
});

// Get articles/slug
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }).lean();
  if (!article) return res.redirect("/");
  res.render("articles/show", { article });
});

router.delete("/:id", async (req, res) => {
  await Article.findOneAndDelete({ _id: req.params.id });
  res.redirect("/");
});

module.exports = router;
