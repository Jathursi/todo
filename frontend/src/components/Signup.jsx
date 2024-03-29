import React , {useState} from 'react'
import './Login.css';
import {FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; 
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [values, setValues] = useState({
        name:'',
        email: '',
        password: ''
    })
    //password error msg
    const [passwordError, setPasswordError] = useState('');
    //error in email (Not in form ______@__.com)
    const [emailError, setEmailError] = useState('');
    //user email exist (already registered)
    const [useremailError, setUseremailError] = useState(''); 
    //after register successful it should navigate to login page
    const navigate = useNavigate();
    const [show, setshow]=useState(false)
    const handleShow=()=>{
        setshow(!show)
    }
    const handleChange=(event)=>{
        setValues({...values, [event.target.name]:[event.target.value]});
        if (event.target.name === 'password') {
            const password = event.target.value;
            //password error msg
            if (password.length < 4 ) {
                setPasswordError('Password should be more tham 4 characters');
            }
            else if(password.length > 10){
                setPasswordError('Password should be less than 10 characters');
            }
            else {
                setPasswordError('');
            }
        }
        //error in email (Not in form ______@__.com)
        else if (event.target.name === 'email') {
            const email = event.target.value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        // Check if there is a password or email error
        if (passwordError || emailError) {
            console.log("Cannot register due to validation errors");
            return;
        }
        // If no password error, proceed with registration
        axios.post('http://localhost:8081/Sign', values)
            .then(res => {
                console.log("Register Successful");
                navigate("/"); // Redirect to login page
            })
            .catch(err => {
                if (err.response && err.response.data.error === "already have an account") {
                    setUseremailError('It seem you already have an account'); // Set email error ( account already exist )
                } else {
                    console.log(err);
                }
            });
        };    

  return (
    <div className='wrapp1'>
        <div className="wrapper">
            <div className="left">
            <div className="form">
                <div className="header_sign">
                    <div className="text">
                        <h2>Signup</h2>
                    </div>
                </div>
                <form className='wrap' onSubmit={handleSubmit}>
                <div className="inputs_sign">
                        <div className="input_sign">
                            <div className="icons"><FaUser /></div>
                            <input type='text' placeholder='Name' name='name' onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="inputs_sign">
                        <div className="input_sign">
                            <div className="icons"><FaEnvelope/></div>
                            <input type='text' placeholder='Email' name='email' onChange={handleChange} autoComplete='username'/>
                        </div>
                    </div>
                    <div className="error_message">  
                        <div className="message"> {/*  Email error */}
                            {emailError && <span className="error">{emailError}</span>}
                        </div>
                    </div>
                    <div className="inputs_sign">
                        <div className="input_sign">
                            <div className="icons"><FaLock/></div>
                                <input type={show ? "text": "password"} name='password' onChange={handleChange} placeholder='password' autoComplete='userpassword'/>
                                <label onClick={handleShow}>{show?"Hide":"Show"}</label>
                        </div>
                    </div>
                    <div className="error_message">
                        <div className="message"> {/*  password error */}
                            {passwordError && <span className="error">{passwordError}</span>}
                        </div>
                    </div>
		            {/* //email error ( account already exist ) */}
                    <div className="error_message1">
                        <div className="message1">
                            {useremailError && <span className="error">{useremailError}</span>}
                        </div>
                    </div>
                    <div className="btn_sign">
                        <button className='button_sign'>Signup</button>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <button className='button_sign1'>
                                    <span>back</span>
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
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signup