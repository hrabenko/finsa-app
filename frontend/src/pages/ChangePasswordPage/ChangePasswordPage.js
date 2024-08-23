import {Link, useNavigate} from "react-router-dom";
import '../auth/auth.sass';
import {useState, useEffect} from "react";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import {useSelector} from "react-redux";
import axios from "../../axios";

function SignupPage () {
    const navigate = useNavigate();

    const {currentUser} = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        id: currentUser.id,
        currentPassword: "",
        newPassword: ""
    });
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!currentUser) {
            navigate("/")
        }
    }, []);

    const handleChange = (e) => {
        setFormData((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await axios.post('/user/user-password', formData);
            if (res.status === 200) {
                navigate('/profile');
                setLoading(false);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
            setLoading(true);
        }
    }

    return (
        <div className="auth-form">
            <form onSubmit={handleSubmit}>
                <h2 className="form-title">Змінити пароль</h2>
                <div className="form-control">
                    <label className="label">Пароль</label>
                    <PasswordInput id={"currentPassword"} value={formData.currentPassword} handleChange={handleChange}/>
                </div>
                <div className="form-control">
                    <label className="label">Новий пароль</label>
                    <PasswordInput id={"newPassword"} value={formData.newPassword} handleChange={handleChange}/>
                </div>
                <button disabled={loading} className="form-button">{loading ? "Завантаження..." : "Змінити пароль"}</button>
                <p className="link"><Link to="/profile">Повернутися</Link></p>
            </form>
        </div>
    )
}

export default SignupPage;