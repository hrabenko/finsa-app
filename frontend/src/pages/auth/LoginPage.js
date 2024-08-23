import {Link, useNavigate} from "react-router-dom";
import './auth.sass';
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import {useEffect, useState} from "react";
import { loginStart, loginSuccess, loginFailure} from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import axios from "../../axios";


function LoginPage () {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const { loading, currentUser } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser) {
            navigate("/budgets")
        }
    }, []);

    const handleChange = (e) => {
        setFormData((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart())
        try {
            const res = await axios.post('/login', formData);
            const data = await res.data;
            if (res.status === 200) {
                dispatch(loginSuccess(data));
                navigate('/budgets');
            } else {
                dispatch(loginFailure());
            }
        } catch (error) {
            dispatch(loginFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    return (
        <div className="auth-form">
            <form onSubmit={handleSubmit}>
                <h2 className="form-title">Увійти</h2>
                <div className="form-control">
                    <label className="label">Ім'я користувача</label>
                    <input id="username" className="input" type="text" value={formData.username} minLength={4} required
                           onChange={handleChange}
                    />
                </div>
                <div className="form-control">
                    <label className="label">Пароль</label>
                    <PasswordInput id={"password"} value={formData.password} handleChange={handleChange}/>
                </div>
                <button disabled={loading} className="form-button">{loading ? "Завантаження..." : "Увійти"}</button>
                <p className="link"><Link to="/signup">Зареєструватися</Link></p>
            </form>
        </div>
    )
}

export default LoginPage;