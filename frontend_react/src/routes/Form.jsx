import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from "../components/snack_bar/toast";
import { alignProperty } from '@mui/material/styles/cssUtils';

// const cookie = localStorage.getItem('imp_cookie');

const Form = () => {
  const cookie = localStorage.getItem('imp_cookie');
    const [formData, setFormData] = useState({
        student_cookie: '',
        supervisorEmail: '',
        semester: '',
        courseCode: '',
        category: '',
        title: '',
        description: '',
        supervisorOutside: false,
        supervisorApproval: false,
        completed: false,
        student_cookie: cookie
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
        e.preventDefault();
        console.log("cookie: ", cookie);
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
            axios.post('https://dcm-backend.vercel.app/form_submission/', formData)
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
                        semester: '',
                        courseCode: '',
                        category: '',
                        title: '',
                        description: '',
                        supervisorOutside: false,
                        supervisorApproval: false,
                        completed: false,
                        student_cookie: cookie
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
              <option value="EEN1010">EEN1010</option>
              <option value="EEN2020">EEN2020</option>
              <option value="EEN3010">EEN3010</option>
              <option value="CIN1010">CIN1010</option>
              <option value="CIN2010">CIN2010</option>
              <option value="CIN3010">CIN3010</option>
              <option value="MEN1010">MEN1010</option>
              <option value="MEN2010">MEN2010</option>
              <option value="MEN3010">MEN3010</option>
              <option value="MTN1010">MTN1010</option>
              <option value="MTN2010">MTN2010</option>
              <option value="MTN3010">MTN3010</option>
              <option value="BBN1010">BBN1010</option>
              <option value="BBN2010">BBN2010</option>
              <option value="BBN3010">BBN3010</option>
              <option value="CHN1010">CHN1010</option>
              <option value="CHN2010">CHN2010</option>
              <option value="CHN3010">CHN3010</option>
              <option value="ESN1010">ESN1010</option>
              <option value="ESN2010">ESN2010</option>
              <option value="ESN3010">ESN3010</option>
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
