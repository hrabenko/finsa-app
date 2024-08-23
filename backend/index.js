import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import articleRoutes from './routes/article.js';
import savingsRoutes from './routes/savings.js';
import budgetRoutes from './routes/budget.js';
import incomeRoutes from './routes/income.js';
import expenseRoutes from './routes/expense.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
})

const upload = multer({storage});

app.use('/uploads', express.static('uploads'));
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Не вдалося завантажити файл!' });
    }

    res.json({
        url: `/uploads/${req.file.filename}`,
    });
});

app.delete('/delete', (req, res) => {
    const { fileName } = req.body;
    if (!fileName) {
        return res.status(400).json({ error: 'Ім\'я файлу не вказано!' });
    }

    const filePath = path.join('uploads', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Не вдалося видалити файл' });
        }

        res.json({ message: 'Файл видалено успішно' });
    });
});

app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/articles", articleRoutes);
app.use("/savings", savingsRoutes);
app.use("/budgets", budgetRoutes);
app.use("/income", incomeRoutes);
app.use("/expenses", expenseRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
});