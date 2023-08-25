import React from 'react'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login1') ;
        axios.post('http://localhost:3001/login', {email, pass}).then(res => {
            if(res.data["result"] == 1){
                navigate('/home');
            }
            else{
                alert(res.data["result"]);
            }
        }).error(err => {console.log(err)});
    }
    return (
        <div>
            <h1>Login</h1>

            <form id = 'login_form'>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" onChange = {(e) => setEmail(e.target.value)}/>
                    <label htmlFor="password">Password</label> 
                    <input type="password" className="form-control" id="password" onChange = {(e) => setPass(e.target.value)}/>
                </div>
            </form>
                <button onClick={(e) => 
                    { 
                        e.preventDefault(); 
                        console.log('Login') ;
                        handleSubmit(e);
                        document.getElementById("login_form").reset();
                    }}
                    type="submit" className="btn btn-primary">Submit</button>
        </div>
    )
}

export default Login;