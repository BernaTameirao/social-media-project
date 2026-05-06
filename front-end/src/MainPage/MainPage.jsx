import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import './MainPage.css';

import { PopUp } from '../Components/PopUp/PopUp';

function MainPage() {

    const [items, setItems] = useState([]);
    const [inputs, setInputs] = useState(["", ""]);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [isPopUp, setIsPopUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);

            const headers = {
                Authorization: `Bearer ${storedToken}`
            };

            try {
                const userRes = await fetch("http://localhost:3000/account/me", { headers });
                const userData = await userRes.json();

                let usernameAux = null;

                if (userRes.ok) {
                    usernameAux = userData.username;
                    setUsername(usernameAux);
                }

                const typeOfFeed = usernameAux ? "/get-user-feed" : "";

                const postsRes = await fetch(
                    `http://localhost:3000/posts${typeOfFeed}?limit=50`,
                    { headers }
                );

                const postsData = await postsRes.json();

                if (postsRes.ok) {
                    setItems(postsData);
                }

            } catch (err) {
                console.log("Error:", err);
            }
        };

        loadData();
    }, []);

    const handleInputChange = (event, whichBar) => {
        setInputs(prevInputs => {
            const aux = [...prevInputs];
            aux[whichBar] = event.target.value;
            return aux;
        });
    }

    const handleAccountButton = () => {

        if(username){
            navigate(`/account/${username}`);
        } else {
            navigate("/login");
        }
    }

    const handlePopUp = () => {

        setIsPopUp(prev => !prev);
    }

    const handleSendInput = async (event) => {
        const message = inputs[1];
        if (!message || !token){
            return
        }

        try {
            const res = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: message
                })
            });
            
            const data = await res.json();

            if(res.ok)
                setItems(prevItems => [data, ...prevItems]);

        } catch (err) {

            console.log(err);
        }
    }

    return (
        <>
        <div className="main-center-div">
            <div className="search-bar-div">
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Search here"
                        maxLength={200}
                        className="search-bar-input"
                        onChange={(event) => {handleInputChange(event, 0)}}>
                    </input>
                    <div className="input-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </div>
                    <div className="input-button" onClick={handlePopUp}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/>
                            <path d="M13.73 21a2 2 0 01-3.46 0"/>
                        </svg>
                    </div>
                    <PopUp open={isPopUp} onClose={handlePopUp}>
                    </PopUp>
                </div>
            </div>
            <div className="horizontal-line"/>
            <div className="messages-feed-container">
                {items
                    .filter(item => item.content.toLowerCase().includes(inputs[0].toLowerCase()))
                    .map((item, index) => (
                        <Link to={`/account/${item.username}`} className="clean-link">
                            <div key={index} className={`message-container-${index%2}`}>{item.username} disse: {item.content}</div>
                        </Link>
                ))}
            </div>
            <div className="horizontal-line"/>
            <div className="search-bar-div">
                <div className="search-bar-container">
                    <div 
                        className="account-username-container"
                        onClick={handleAccountButton}
                    >
                        {username ? username : ("Guest")}
                    </div>
                    <input 
                        type="text" 
                        placeholder="Write here"
                        maxLength={200}
                        className="search-bar-input"
                        onChange={(event) => {handleInputChange(event, 1)}}>
                    </input>
                    <div onClick={(event) => {handleSendInput(event)}} className="input-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default MainPage;
