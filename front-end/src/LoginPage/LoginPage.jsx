import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

function LoginPage() {

    const [inputs, setInputs] = useState(["", ""]);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (event, whichBar) => {
        setInputs(prevInputs => {
            const aux = [...prevInputs];
            aux[whichBar] = event.target.value;
            return aux;
        });
    }

    const handlePasswordVisibility = () => {

        setIsPasswordVisible(prev => !prev);
    }

    const handleSendInput = async (event, whichButton) => {
        const [username, password] = inputs;

        if (!username || !password){
            return;
        }

        const buttonMap = {
            0: "login",
            1: "register",
        };

        const endpoint = buttonMap[whichButton];

        try {
            const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const data = await res.json();

            if (data.token){
                localStorage.setItem("token", data.token);
                navigate("/");
            }
            
        } catch (err) {

            console.log(err);
        }
    }

    return (
        <>
        <div className="main-center-div">
            <div className="horizontal-line"/>
            <div className="search-bar-div">
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Username"
                        maxLength={20}
                        className="search-bar-input"
                        onChange={(event) => {handleInputChange(event, 0)}}>
                    </input>
                </div>
            </div>
            <div className="search-bar-div">
                <div className="search-bar-container">
                    <input 
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                        maxLength={20}
                        className="search-bar-input"
                        onChange={(event) => {handleInputChange(event, 1)}}>
                    </input>
                    <div onClick={handlePasswordVisibility} className="input-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="container-buttons-row">
                <button 
                    className="login-button"
                    onClick={(event)=>{handleSendInput(event, 0)}}>
                    Login
                </button>
                <button
                    className="login-button"
                    onClick={(event)=>{handleSendInput(event, 1)}}>
                    Register
                </button>
            </div>
            <div className="horizontal-line"/>
        </div>
        </>
    )
}

export default LoginPage;
