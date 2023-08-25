import React from 'react'
import { useState } from 'react'
import axios from 'axios'

function Register() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register') ;
        axios.post('http://localhost:3001/register', {name, email, password}).then(result => {console.log(result)}).catch(err => {console.log(err)});
    }
    return (
        <div>
            <h1>Register</h1>

            <form id = 'register_form'>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="name" className="form-control" id="name" onChange={(e) => setName(e.target.value)}/>
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </form>
            <button onClick={(e) =>
                {
                    e.preventDefault();
                    console.log('Register');
                    handleSubmit(e);
                    document.getElementById("register_form").reset();
                }}
                type="submit" className="btn btn-primary">Submit</button>

        </div>
    )
}

export default Register;