import {db} from "../db.js";

export const getAllExpenses = (req, res) => {
    const sql = "SELECT * FROM expenses WHERE budget_id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(200).json([]);

        return res.status(200).json(data);
    })
};

export const createExpense = (req, res) => {
    const sql = "INSERT INTO expenses(`category`, `value`, `notes`, `budget_id`) VALUES (?)";
    const values = [req.body.category, req.body.value, req.body.notes, req.body.budgetId]

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data.insertId);
    })
};

export const updateExpense = (req, res) => {
    const sql = "UPDATE expenses SET category = ?, value = ?, notes = ? WHERE id = ?";
    const values = [req.body.category, req.body.value, req.body.notes, req.params.id]

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Expense has been changed");
    })
};

export const deleteExpense = (req, res) => {
    const sql = "DELETE FROM expenses WHERE id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Expense has been deleted");
    })
};


