import {useState} from "react";
import icon1 from '../../images/icons/password-icon1.png'
import icon2 from '../../images/icons/password-icon2.png'
import "./PasswordInput.sass"

function PasswordInput ({id, value, handleChange}) {
    const [hidden, setHidden] = useState(true);

    return (
        <div>
            <div className="password-input">
                <input id={id} value={value} onChange={handleChange} minLength={8} required
                       type={hidden ? "password" : "text"}/>
                <img className="password-input-icon"
                     onClick={() => setHidden((prevState) => !prevState)}
                     src={hidden ? icon1 : icon2}/>
            </div>
        </div>
    )
}

export default PasswordInput;