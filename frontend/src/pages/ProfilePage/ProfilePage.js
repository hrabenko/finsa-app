import axios from "../../axios";
import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import userAvatar from '../../images/user-avatar.png'
import "./ProfilePage.sass";


const currencies = [
    "ADP", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "ATS", "AUD",
    "AWG", "AZN", "BAM", "BBD", "BDT", "BEF", "BGN", "BHD", "BIF", "BMD",
    "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BZD", "CAD",
    "CDF", "CHF", "CLF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CYP",
    "CZK", "DEM", "DJF", "DKK", "DOP", "DZD", "EEK", "EGP", "ERN", "ESP",
    "ETB", "EUR", "FIM", "FJD", "FKP", "FRF", "GBP", "GEL", "GHS", "GIP",
    "GMD", "GNF", "GRD", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
    "IDR", "IEP", "ILS", "INR", "IQD", "IRR", "ISK", "ITL", "JMD", "JOD",
    "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT",
    "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LUF", "LVL", "LYD", "MAD",
    "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MTL", "MUR", "MVR",
    "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NLG", "NOK", "NPR",
    "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PTE", "PYG",
    "QAR", "RON", "RSD", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK",
    "SGD", "SHP", "SIT", "SKK", "SLE", "SOS", "SRD", "STN", "SVC", "SYP",
    "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS",
    "UAH", "UGX", "USD", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF",
    "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
]


function ProfilePage() {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        username: "",
        email: "",
        currency: ""
    });

    const {currentUser} = useSelector((state) => state.auth);

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`/user/${currentUser.id}`);
            const data = await res.data;
            if (res.status === 200) {
                setFormData({
                    username: data.username,
                    email: data.email,
                    currency: data.currency
                })
                setLoading(false);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!currentUser) {
            navigate("/")
        }
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/user`, {...formData, id: currentUser.id});
            if (res.status === 200) {
                setIsEditing((prevState) => !prevState);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    return (
        <div className="profile">
            <h2 className="profile-title">Профіль</h2>
            {loading ? <span>Завантаження...</span> :
                <div className="profile-container">
                    <img
                        title="Змінити фото"
                        className="profile-avatar"
                        src={userAvatar}/>
                    <div className="profile-info">
                        <div className="info-container username">
                            <p className="info-label">Ім'я користувача: </p>
                            {isEditing ?
                                <input id="username" onChange={handleChange} value={formData.username} minLength={4}
                                       required className="info-input"/> :
                                <p className="info-text">{formData.username}</p>}
                        </div>
                        <div className="info-container email">
                            <p className="info-label">Електронна адреса: </p>
                            {isEditing ?
                                <input id="email" onChange={handleChange} value={formData.email} type="email" required
                                       className="info-input"/> :
                                <p className="info-text">{formData.email}</p>}
                        </div>
                        <div className="info-container currency">
                            <p className="info-label">Валюта: </p>
                            {isEditing ?
                                <select id="currency" onChange={handleChange} value={formData.currency}
                                        className="info-input">
                                    {currencies.map((item) => <option key={`${item}`}>{item}</option>
                                    )}
                                </select> :
                                <p className="info-text">{formData.currency}</p>}
                        </div>
                        {isEditing ?
                            <div className="buttons">
                                <button disabled={loading} className="btn btn-save"
                                        onClick={handleUpdate}>
                                    {loading ? "Завантаження..." : "Зберегти"}
                                </button>
                            </div> :
                            <div className="buttons">
                                <button className="btn btn-edit-data"
                                        onClick={() => setIsEditing((prevState) => !prevState)}>
                                    Змінити дані
                                </button>
                                <Link className="btn btn-edit-password" to="/change-password">
                                    Змінити пароль
                                </Link>
                            </div>
                        }
                        {modal && (
                            <ModalWindow textContent="Ви дійсно бажаєте видалити профіль та всі дані?"
                                         setModal={setModal} handleFunction={handleDelete}
                            />
                        )}
                    </div>
                </div>}
        </div>
    )
}

export default ProfilePage;