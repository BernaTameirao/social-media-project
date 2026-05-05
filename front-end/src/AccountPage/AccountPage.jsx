import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import "./AccountPage.css";

function AccountPage() {

    const [pageData, setPageData] = useState({user: {}, posts: []});
    const [currentUserData, setCurrentUserData] = useState({});
    const [token, setToken] = useState(null);
    const [isCurrentUser, setIsCurrentUser] = useState(null);
    const [isChangingDesc, setIsChangingDesc] = useState(false);
    const [input, setInput] = useState("");
    const { username } = useParams();    

    useEffect(() => {
            const loadData = async () => {
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);

                let userData = null;
                let pageInfo = null;
    
                try {
                    const res = await fetch("http://localhost:3000/account/me", {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });
    
                    userData = await res.json();

                    if (res.ok)
                        setCurrentUserData(userData);

                } catch (err) {
                    console.log("User error:", err);
                }

                try {
                    const res = await fetch(`http://localhost:3000/account/get-info?username=${username}`);
                    pageInfo = await res.json();

                    if(res.ok)
                        setPageData(pageInfo);

                } catch (err) {
                    console.log("Page error:", err);
                }

                setIsCurrentUser(userData.id === pageInfo.user.id);
            };
    
            loadData();
        }, []);

    const handleImageUpload = async (event) => {

        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            const res = await fetch("http://localhost:3000/account/update/profile-image", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok)
                setPageData(prev => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        image: data.image
                    }
                }));

        } catch (err) {
            console.error(err);
        }
    }

    const handleDescInput = (event) => {

        setInput(event.target.value);
    }

    const handleDescBool = () => {
        const aux = !isChangingDesc;
        setIsChangingDesc(aux);

        const sendDescChanges = async () => {
            try {
                const res = await fetch("http://localhost:3000/account/update/profile-desc", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        new_desc: input
                    })
                });

                const data = await res.json();

                if (res.ok)
                    setPageData(prev => ({
                        ...prev,
                        user: {
                            ...prev.user,
                            description: data.description
                        }
                    }));

            } catch (err) {

                console.log(err);
            }
        }

        if (!aux && input!==""){

            sendDescChanges();
        }
    }

    const handleFollowButton = async () => {

        try {
            const res = await fetch("http://localhost:3000/follows", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    followed_id: pageData.user.id
                })
            });

            const data = await res.json();
            if(res.ok)
                console.log(data);

        } catch (err) {

            console.log(err);
        }
    }

    return (
        <>
            <div className="main-center-div">
                <div className="horizontal-line"/>
                <div className="profile-container">
                    <label className="profile-image-container">
                        {isCurrentUser ? 
                            (
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="profile-image-upload-input"
                                />
                            ) : (<></>)}
                        {pageData.user.image ? 
                            (
                                <img src={`http://localhost:3000/${pageData.user.image}`}/>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
                                    <circle cx="64" cy="64" r="64" fill="#1F2937"/>
                                    <circle cx="64" cy="52" r="20" fill="#6B7280"/>
                                    <path d="M24 110c6-20 24-30 40-30s34 10 40 30" fill="#6B7280"/>
                                </svg>
                            )}
                    </label>
                    <div>{pageData.user.username ? pageData.user.username : "Lorem Ipsum"}</div>
                    <div className="horizontal-line"/>
                    <div className="description-container">
                        { isChangingDesc ? 
                            (
                                <div className="search-bar-container">
                                    <input 
                                        type="text" 
                                        placeholder="Write here"
                                        className="search-bar-input"
                                        onChange={handleDescInput}>
                                    </input>
                                </div>
                            ) : (
                                <div>{pageData.user.description ? pageData.user.description : "Lorem Ipsum"}</div>
                            )
                        }
                        { isCurrentUser ? 
                            (
                                <div onClick={handleDescBool} className="input-button">
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
                            ) : (<></>)
                        }
                    </div>
                    <div className="container-buttons-row">
                        <button 
                            className="login-button"
                            onClick={handleFollowButton}
                            disabled={isCurrentUser}
                        >
                            Follow
                        </button>
                        <div>Followers: {pageData.user.followers_count ? pageData.user.followers_count : "-"}</div>
                        <div>Following: {pageData.user.following_count ? pageData.user.following_count : "-"}</div>
                    </div>
                </div>
                <div className="horizontal-line"/>
                <div className="messages-feed-container">
                    {pageData.posts
                        .map((item, index) => (
                            <div key={index} className={`message-container-${index%2}`}>{item.username} disse: {item.content}</div>
                    ))}
                </div>
            </div> 
        </>
    )

}

export default AccountPage