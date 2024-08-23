import {db} from "../db.js";

export const getAllArticles = (req, res) => {
    const sql = "SELECT * FROM articles";

    db.query(sql, [], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(200).json([]);

        return res.status(200).json(data);
    })
};

export const getOneArticle = (req, res) => {
    const sql = "SELECT * FROM articles WHERE id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(200).json([]);

        return res.status(200).json(data);
    })
};

export const createArticle = (req, res) => {
    const sql = "INSERT INTO articles(`title`, `image_url`, `content`, `author`) VALUES (?)";
    const values = [req.body.title, req.body.image_url, req.body.content, req.body.author]

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data.insertId);
    })
};

export const updateArticle = (req, res) => {
    const sql = "UPDATE articles SET title = ?, image_url = ?, content = ? WHERE id = ?";
    const values = [req.body.title, req.body.image_url, req.body.content, req.params.id]

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Article has been changed");
    })
};

export const deleteArticle = (req, res) => {
    const sql = "DELETE FROM articles WHERE id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Article has been deleted");
    })
};


