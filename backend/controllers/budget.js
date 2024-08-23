import {db} from "../db.js";

export const getAllBudgets = (req, res) => {
    const sql = "SELECT username FROM users WHERE id = ?"

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Щось пішло не так.");

        const sql = "SELECT * FROM budgets WHERE user_id = ? OR contributors LIKE ?";

        const username = '%' + data[0].username + '%';

        db.query(sql, [req.params.id, username], (err, data) => {
            if (err) return res.json(err);
            if (data.length === 0) return res.status(200).json([]);

            return res.status(200).json(data);
        })

    })


};

export const getOneBudget = (req, res) => {
    const sql = "SELECT * FROM budgets WHERE id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(200).json([]);

        return res.status(200).json(data);
    })
};

export const createBudget = (req, res) => {
    const sql = "INSERT INTO budgets(`name`, `period`, `period_start`, `period_end`, `contributors`, `user_id`) VALUES (?)";
    const values = [req.body.name, req.body.period, req.body.period_start, req.body.period_end, req.body.contributors, req.body.userId]

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data.insertId);
    })
};

export const updateBudget = (req, res) => {
    const sql = "UPDATE budgets SET name = ?, period = ?, period_start = ?, period_end = ?, contributors = ? WHERE id = ?";
    const values = [req.body.name, req.body.period, req.body.period_start, req.body.period_end, req.body.contributors, req.params.id]

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Budget has been changed");
    })
};

export const deleteBudget = (req, res) => {
    const sql = "DELETE FROM income WHERE budget_id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);

        const sql = "DELETE FROM expenses WHERE budget_id = ?";

        db.query(sql, [req.params.id], (err, data) => {
            if (err) return res.json(err);

            const sql = "DELETE FROM budgets WHERE id = ?";

            db.query(sql, [req.params.id], (err, data) => {
                if (err) return res.json(err);

                return res.status(200).json("Budget has been deleted");
            })
        })

    })
};


