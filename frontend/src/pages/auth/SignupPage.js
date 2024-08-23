import {Link, useNavigate} from "react-router-dom";
import axios from "../../axios";
import './auth.sass';
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import {signupStart, signupSuccess, signupFailure} from '../../redux/slices/auth';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from "react";

function SignupPage () {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const { loading, currentUser } = useSelector((state) => state.auth);


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
        dispatch(signupStart());
        try {
            const res = await axios.post('/signup', formData);
            const data = await res.data;
            if (res.status === 200) {
                navigate('/login');
                dispatch(signupSuccess());
            }
        } catch (error) {
            dispatch(signupFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    return (
        <div className="auth-form">
            <form onSubmit={handleSubmit}>
                <h2 className="form-title">Зареєструватися</h2>
                <div className="form-control">
                    <label className="label">Електронна адреса</label>
                    <input id="email" className="input" type="email" value={formData.email} required
                           onChange={handleChange}
                    />
                </div>
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
                <button disabled={loading} className="form-button">{loading ? "Завантаження..." :"Зареєструватися"}</button>
                <p className="link"><Link to="/login">Увійти</Link></p>
            </form>
        </div>
    )
}

export default SignupPage;