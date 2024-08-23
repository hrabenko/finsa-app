import {db} from "../db.js";

export const getAllIncome = (req, res) => {
    const sql = "SELECT * FROM income WHERE budget_id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(200).json([]);

        return res.status(200).json(data);
    })
};

export const createIncome = (req, res) => {
    const sql = "INSERT INTO income(`category`, `value`, `notes`, `budget_id`) VALUES (?)";
    const values = [req.body.category, req.body.value, req.body.notes, req.body.budgetId]

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data.insertId);
    })
};

export const updateIncome = (req, res) => {
    const sql = "UPDATE income SET category = ?, value = ?, notes = ? WHERE id = ?";
    const values = [req.body.category, req.body.value, req.body.notes, req.params.id]

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Income has been changed");
    })
};

export const deleteIncome = (req, res) => {
    const sql = "DELETE FROM income WHERE id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Income has been deleted");
    })
};


