import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from "../components/snack_bar/toast";
import { alignProperty } from '@mui/material/styles/cssUtils';

// const cookie = localStorage.getItem('imp_cookie');

const Form = () => {
    const [formData, setFormData] = useState({
        student_cookie: '',
        supervisorEmail: '',
        semester: 0,
        courseCode: '',
        category: 0,
        title: '',
        description: '',
        supervisorOutside: false,
        supervisorApproval: false,
        completed: false
    });
    
    const [notify, setNotify] = React.useState({
        open: false,
        message: "",
        severity: "success",
        handleClose: () => {
          setNotify((prev) => ({ ...prev, open: false }));
        },
      });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData({
            ...formData,
            [name]: val
        });
    };

    const handleSubmit = async (e) => {
        const cookie = localStorage.getItem('imp_cookie');
        e.preventDefault();
        console.log("cookie: ", cookie);
        setFormData({
            ...formData,
            student_cookie: cookie
        });
        console.log("formData: ", formData);
        for (const key in formData) {
            if (formData[key] === '') {
                console.log("Please fill all the fields")
              setNotify({
                open: true,
                message: "Please fill all the fields",
                severity: "error",
                handleClose: () => {
                  setNotify((prev) => ({ ...prev, open: false }));
                },
              });
              return;
            }
          }
        console.log("form:",formData);
        try {
            axios.post('http://localhost:8000/form_submission/', formData)
            .then(res => {
                console.log(res);
                console.log(res.data);

                const message = res.data.message;
                if (res.data.status === 200){
                    setNotify({
                        open: true,
                        message: message,
                        severity: "success",
                        handleClose: () => {
                          setNotify((prev) => ({ ...prev, open: false }));
                        },
                      });
                    
                      setFormData({
                        student_cookie: '',
                        supervisorEmail: '',
                        semester: 0,
                        courseCode: '',
                        category: 0,
                        title: '',
                        description: '',
                        supervisorOutside: false,
                        supervisorApproval: false,
                        completed: false
                    });
                }
                else if(res.data.message === 'Invalid cookie'){
                  // direct to login page
                  window.location.href = '/login';
                }
                else{
                    setNotify({
                        open: true,
                        message: message,
                        severity: "error",
                        handleClose: () => {
                          setNotify((prev) => ({ ...prev, open: false }));
                        },
                      });
                }
            })
            .catch(err => {
                console.log(err);
                setNotify({
                    open: true,
                    message: "Server is probably down",
                    severity: "error",
                    handleClose: () => {
                      setNotify((prev) => ({ ...prev, open: false }));
                    },
                  });
            });
        } catch (err) {
            console.log(err);
        }

        
    };

    return (
        <form onSubmit={handleSubmit}>
        
            
            <input type="text" name="supervisorEmail" placeholder="Supervisor's Email" value={formData.supervisorEmail} onChange={handleChange} required />
{/*         
            <label style={{ textAlign: 'left', display: 'block' }}>Semester:</label> */}
            <select name="semester" value={formData.semester} onChange={handleChange} style={{ width: '100%', textAlign: 'left' }}>
                <option value="">Select Semester</option>
                <option value={2.5}>Summer vacation post 1st year</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={4.5}>Summer vacation post 2nd year</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={6.5}>Summer vacation post 3rd year</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
            </select>
        
            {/* <input type="text" name="courseCode" placeholder="Course Code:" value={formData.courseCode} onChange={handleChange} required /> */}
            <select name="courseCode" value={formData.courseCode} onChange={handleChange} style={{ width: '100%', textAlign: 'left' }}>
                <option value="">Select Course Code</option>
                <option value="CSN1020">CSN1020</option>
                <option value="CSN2020">CSN2020</option>
                <option value="CSN3020">CSN3020</option>
            </select>

            {/* <label>Category:</label> */}
            <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', textAlign: 'left' }}>
                <option value={""}>Select Category</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
            </select>
    
            <input type="text" name="title" placeholder='Title of Project:' value={formData.title} onChange={handleChange} required />    
        
            <input type="text" name="description" placeholder="Description:" value={formData.description} onChange={handleChange} required />
        
            <label>Is Supervisor from outside institute?:</label>
            <input type="checkbox" name="supervisorOutside" checked={formData.supervisorOutside} onChange={handleChange} />
            
        <button type="submit">Submit</button>
        <Snackbar prop={notify} />
    </form>

    );
};

export default Form;
