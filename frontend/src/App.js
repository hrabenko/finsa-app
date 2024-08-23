import { BrowserRouter, Routes, Route } from "react-router-dom"
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import LoginPage from "./pages/auth/LoginPage";
import Layout from "./components/Layout/Layout";
import SignupPage from "./pages/auth/SignupPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import ArticlePage from "./pages/ArticlePage/ArticlePage";
import SavingsPage from "./pages/SavingsPage/SavingsPage";
import BudgetsPage from "./pages/BudgetsPage/BudgetsPage";
import BudgetDetailsPage from "./pages/BudgetDetailsPage/BudgetDetailsPage";
import CreateArticlePage from "./pages/CreateArticlePage/CreateArticlePage";
function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<WelcomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="change-password" element={<ChangePasswordPage />} />
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="blog/:id" element={<ArticlePage />} />
                    <Route path="blog/create" element={<CreateArticlePage />} />
                    <Route path="budgets" element={<BudgetsPage />} />
                    <Route path="budgets/:id" element={<BudgetDetailsPage />} />
                    <Route path="savings" element={<SavingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;