import {Link, useNavigate} from "react-router-dom";
import mainImage from '../../images/main-page.png';
import './WelcomePage.sass';
import {useSelector} from "react-redux";
import {useEffect} from "react";

function WelcomePage () {
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser) {
            navigate("/budgets")
        }
    }, []);

    return (
        <div className="welcome">
            <div className="image-container">
                <img src={mainImage} className="welcome-image" />
            </div>
            <div className="action-container">
                <h1 className="welcome-title">Слідкуй за своїми фінансами разом з нами.</h1>
                <div className="btn btn-login"><Link to={"/login"}>Увійти</Link></div>
                <div className="btn btn-signup"><Link to={"/signup"}>Зареєструватися</Link></div>
                <hr className="btn-divider" />
                <div className="btn btn-blog"><Link to={"/blog"}>Читати блог</Link></div>
            </div>
        </div>
    )
}

export default WelcomePage;