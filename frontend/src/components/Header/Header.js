import logo from '../../images/logo.svg';
import userIcon from '../../images/icons/user-icon.svg';
import logoutIcon from '../../images/icons/logout-icon.svg';
import {useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Link, NavLink, useNavigate} from "react-router-dom";
import "./Header.sass";
import ModalWindow from "../ModalWindow/ModalWindow";
import axios from "../../axios";
import {logOut} from "../../redux/slices/auth";

function Header() {
    const [modal, setModal] = useState(false);
    const { currentUser } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const activeStyles = {
        textDecoration: "underline"
    }


    const logoutButton = async () => {
        setModal(false);
        const res = await axios.post("/logout");
        const data = await res.data;
        dispatch(logOut(data));
        navigate("/");
    }

    return (
        <header className="header">
            {currentUser ?
                <div className="header-container">
                    <Link to="/">
                        <img className="header-logo" src={logo}/>
                    </Link>
                    <nav className="navigation">
                        <NavLink to="/budgets"
                                 style={({isActive}) => isActive ? activeStyles : null}>
                            Бюджети
                        </NavLink>
                        <NavLink to="/savings"
                                 style={({isActive}) => isActive ? activeStyles : null}>
                            Заощадження
                        </NavLink>
                        <NavLink to="/blog"
                                 style={({isActive}) => isActive ? activeStyles : null}>
                            Блог
                        </NavLink>
                    </nav>
                    <div className="buttons">
                        <Link to="/profile">
                            <img src={userIcon} width={20}/>
                        </Link>
                        <img onClick={() => setModal(true)} src={logoutIcon} width={20}/>
                        {modal && (
                            <ModalWindow textContent="Ви дійсно бажаєте вийти?"
                                         setModal={setModal} handleFunction={logoutButton}
                            />
                        )}
                    </div>
                </div> :
                <Link to="/">
                    <img className="header-logo" src={logo}/>
                </Link>
            }
        </header>
    )
}

export default Header;