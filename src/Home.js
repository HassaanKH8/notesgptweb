import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import NGPT from "./assets/notesgpt.png"
import './App.css';

const Home = () => {

    const [fileName, setFileName] = useState('')
    const [question, setQuestion] = useState('')
    const [fileText, setFileText] = useState('')
    const [username, setUsername] = useState('')
    const [usernamepresent, setUsernamepresent] = useState(false)
    const [fileTextS, setFileTextS] = useState(false)
    const [sidebarhidden, setSidebarHidden] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [chats, setChats] = useState([])
    const fileInputRef = useRef(null);
    const [notesList, setNotesList] = useState([])

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    useEffect(() => {
        getprofiles()
        // eslint-disable-next-line
    }, [fileName, username])

    const getprofiles = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_LINK_1, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: `${username}_highseasuser123` }),
            });

            let proFiles = []
            const data = await response.json();
            if (data.filenames) {
                proFiles = data.filenames.map((id, index) => ({ id: index + 4, name: `${id.substring(0, id.lastIndexOf('_', id.lastIndexOf('_') - 1))}${id.substring(id.lastIndexOf('.'))}`, fullfilename: `${id}` }));
            }
            let freeFiles = [
                { id: '1', name: 'Nelson Mandela Biography', filename: 'file1.txt', fullfilename: "file1_thisisforallfreeusersandprousers_byte9962-notesgpt-996200.txt" },
                { id: '2', name: 'Time Travel: Theories and Paradoxes', filename: 'file2.txt', fullfilename: "file2_thisisforallfreeusersandprousers_byte9962-notesgpt-996200.txt" },
                { id: '3', name: 'All About Multiverse', filename: 'file3.txt', fullfilename: "file3_thisisforallfreeusersandprousers_byte9962-notesgpt-996200.txt" },
            ]

            setNotesList([...freeFiles, ...proFiles])
        }
        catch (e) {
            console.log(e);
        }
    }


    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handletheFileChange = async (e) => {
        const file = e.target.files[0]
        setFileName(file.name)

        const dotIndex = (file.name).lastIndexOf('.');
        const baseName = (file.name).substring(0, dotIndex);
        const extension = (file.name).substring(dotIndex);

        const fname = `${baseName}_${username}_highseasuser123${extension}`

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', `${username}_highseasuser123`);
        formData.append('fname', fname);
        try {
            const response = await axios.post(process.env.REACT_APP_LINK_2, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            setIsLoading(false)
            setFileText(response.data.text)
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    };

    const handleQuestionSubmit = async () => {
        if (question) {
            if (fileName) {
                const newChat = { userId: `${username}_highseasuser123`, message: question, isUser: true, documentId: fileName };
                setChats([...chats, newChat, { userId: `${username}_highseasuser123`, message: "Hmmm...", isUser: false, documentId: fileName }]);
                setTimeout(() => {
                    setChats([...chats, newChat, { userId: `${username}_highseasuser123`, message: "Let me think...", isUser: false, documentId: fileName }]);
                }, 1500)
                setQuestion('');

                try {
                    await axios.post(process.env.REACT_APP_LINK_3, newChat);

                    const response = await axios.post(process.env.REACT_APP_LINK_4, {
                        question,
                        text: fileText
                    });

                    const newAnswer = { userId: `${username}_highseasuser123`, message: response.data.answer, isUser: false, documentId: fileName };
                    setChats([...chats, newChat, newAnswer]);
                    await axios.post(process.env.REACT_APP_LINK_5, newAnswer);
                } catch (error) {
                    console.error('Error asking question: ', error);
                }
            }
            else {
                alert("Please select a file from the sidebar or add a new file!")
            }
        }
        else {
            alert("Please enter a question!")
        }
    }

    useEffect(() => {
        if (fileName) {
            fetchChatHistory();
        }
        // eslint-disable-next-line
    }, [fileName]);

    const fetchChatHistory = async () => {
        if (fileName) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LINK_6}/${username}_highseasuser123/${fileName}`);
                setChats(response.data);
            } catch (error) {
                console.error('Error fetching chat history: ', error);
            }
        }
    };

    const renderChatMessages = () => {
        return chats.map((chat, index) => (
            <div key={index}>
                {chat.isUser ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <p style={{ textAlign: 'right', padding: '14px', backgroundColor: '#dbdad5', borderRadius: '20px', maxWidth: '70%', wordWrap: 'break-word', fontFamily: '"Inter", sans-serif', fontWeight: '300' }}>{chat.message}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '10px', marginTop: '10px' }}>
                        {fileName && (
                            <img className='logo2' src={NGPT} alt="Logo" style={{ width: '30px', height: '30px', marginRight: '10px', alignSelf: 'flex-start' }} />
                        )}
                        <p style={{ textAlign: 'left', maxWidth: '70%', wordWrap: 'break-word', fontFamily: '"Inter", sans-serif', fontWeight: '300', lineHeight: "20px" }}>{chat.message}</p>
                    </div>
                )}
            </div>
        ));
    };

    const handleFileChange = async (fname, fullfilename) => {
        try {
            setIsLoading(true)
            const response = await axios.post(process.env.REACT_APP_LINK_7, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: JSON.stringify({ fname: fullfilename }),
            });
            setFileText(response.data.text)
            setFileTextS(true)
            setIsLoading(false)

        } catch (error) {
            console.error('Error uploading file: ', error);
        }
        setFileName(fname);
    }

    const hideSidebar = () => {
        if (fileTextS) {
            setFileTextS(false)
        }
        else if (!fileTextS) {
            setSidebarHidden(true)
        }
    }
    const showSidebar = () => {
        setSidebarHidden(false)
    }

    return (
        <div className="page">
            <div className="navbar">
                <div>
                    <h1 className="notesgpt">NotesGPT - <span style={{ fontSize: "20px", fontWeight: 500 }}>AI File Chat</span></h1>
                </div>
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    {usernamepresent && (
                        <h1 className="username">{username}</h1>
                    )}
                    <img className="profileimg" alt="profile" src={require("./assets/profile.png")} />
                </div>
            </div>
            {usernamepresent ? (
                <div className="bottomsection">
                    {!sidebarhidden ? (
                        <div className="leftsec">
                            <div className="topbar">
                                <h1 className="backarrow" onClick={() => { hideSidebar() }}>←</h1>
                                <div style={{display: "flex",flexDirection: "row", alignItems: 'center'}}>
                                    {isLoading ? (
                                        <p className="loadingText">Loading...</p>
                                    ) : (
                                        <p className="loadingText">Add a File</p>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        accept=".pdf, .txt"
                                        onChange={handletheFileChange}
                                    />
                                    <h1 className="plusbtn" onClick={handleButtonClick}>+</h1>
                                </div>
                            </div>
                            <div className="topbottombar"></div>
                            {fileTextS ? (
                                <div className="document">
                                    <p>{fileText}</p>
                                </div>
                            ) : (
                                <div className="files">
                                    {notesList.map((item, index) => (
                                        <h1 key={index} className={fileName === item.name ? ("noteitemselected") : ("noteitem")} onClick={() => { handleFileChange(item.name, item.fullfilename) }}>{item.name}</h1>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <h1 className="backarrow2" onClick={() => { showSidebar() }}>→</h1>
                    )}
                    <div className="rightsec" style={sidebarhidden ? ({ width: '100%' }) : ({ width: "82%" })}>
                        <div style={{ width: '80%', alignSelf: 'center', marginTop: "30px" }}>
                            {renderChatMessages()}
                        </div>
                        <div style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                            <input type="text" placeholder="Ask a question..." className="tinput" value={question} onChange={handleQuestionChange} />
                            <button style={{ border: 'none', cursor: 'pointer' }} onClick={() => { handleQuestionSubmit() }}>
                                <img className="sendbtn" alt="profile" src={require("./assets/up.png")} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bottomsection2">
                    <h1 className="addusername">Add username</h1>
                    <input type="text" placeholder="Username..." className="uinput" value={username} onChange={handleUsernameChange} />
                    <button className="submitbtn" onClick={() => { setUsernamepresent(true) }}>Submit</button>
                </div>
            )}
        </div>
    );
}

export default Home;
