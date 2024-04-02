import React, {useState} from 'react'
import './Login.css';
import {FaEnvelope, FaLock } from 'react-icons/fa'; 
import axios from 'axios';
import {Link,  useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [useremailError, setUseremailError] = useState('');

    const handleLogin = (e) => {
    e.preventDefault()
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:8081/Log', {email, password})
    .then(res => {
        console.log("Login successful");
        setUseremailError('');
        document.cookie = `token=${res.data.token}; path=/`;
        navigate('/Home')
        alert("Login successful");
    })
    .catch(err=>{
        if (email === 'superadmin@example.com' && password === 'superadminpassword') {
            navigate('/Signup');
        } 
        else if(err.response && err.response.data.error === "No account found with this email"){
            setUseremailError('Dont have account');
        }
        else{
            console.log(err);
        }
    });
  };
  const [show, setshow]=useState(false)
    const handleShow=()=>{
        setshow(!show)
    }
  return (
    <div className='wrapp1'>
        <div className="wrapper">
            <div className="left">
            <div className="form">
                <div className="header_sign">
                    <div className="text">
                        <h2>Login</h2>
                    </div>
                </div>
                <form className='wrap' onSubmit={handleLogin}>
                    <div className="inputs_sign">
                        <div className="input_sign">
                            <div className="icons"><FaEnvelope/></div>
                            <input type='text' placeholder='Email' name='email' onChange={(e) => setEmail(e.target.value)} autoComplete='useremail'/>
                        </div>
                        {/* User email not exist (error message) */}
                        <div className="error_message">
                            <div className="message1">
                                {useremailError && <span className='error'>{useremailError}</span>}
                            </div>
                        </div>
                        <div className="input_sign">
                            <div className="icons"><FaLock/></div>
                                <input type={show ? "text": "password"} name='password'   placeholder='password'  onChange={(e) => setPassword(e.target.value)} autoComplete='userpassword'/>
                                <label onClick={handleShow}>{show?"Hide":"Show"}</label>
                        </div>
                    </div>
                    <div className="btn_sign">
                        <button className='button_sign'>Login</button>
                            <Link to="/Signup" style={{ textDecoration: 'none' }}>
                                <button className='button_sign1'>
                                    <span>Signup</span>
                                </button>
                            </Link>
                    </div>
                </form>
            </div>
            </div>
            <div className="images">
                <div className="img_cont">
                    <div className="im_text">
                        Welcome !
                    </div>
                    <div className="im_text1">
                        Have a wonderful day
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default Login