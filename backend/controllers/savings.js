import {db} from "../db.js";

export const getAllSavings = (req, res) => {
    const sql = "SELECT * FROM savings WHERE user_id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(200).json([]);

        return res.status(200).json(data);
    })
};

export const createSavings = (req, res) => {
    const sql = "INSERT INTO savings(`name`, `category`, `value`, `currency`, `user_id`) VALUES (?)";
    const values = [req.body.name, req.body.category, req.body.value, req.body.currency, req.body.userId]

    db.query(sql, [values], (err, data) => {
        console.log(data);
        if (err) return res.json(err);
        return res.status(200).json(data.insertId);
    })
};

export const updateSavings = (req, res) => {
    const sql = "UPDATE savings SET name = ?, category = ?, value = ?, currency = ? WHERE id = ?";
    const values = [req.body.name, req.body.category, req.body.value, req.body.currency, req.params.id]

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Savings has been changed");
    })
};

export const deleteSavings = (req, res) => {
    const sql = "DELETE FROM savings WHERE id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Savings has been deleted");
    })
};


