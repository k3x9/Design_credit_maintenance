import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from "../components/snack_bar/toast";

const SearchFormByRollNumber = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [forms, setForms] = useState([]);
  const cookie = localStorage.getItem('imp_cookie');
  const [notify, setNotify] = React.useState({
    open: false,
    message: "",
    severity: "success",
    handleClose: () => {
      setNotify((prev) => ({ ...prev, open: false }));
    },
  });

  const fetchFormsByRollNumber = async () => {
    try {
      axios.post('http://localhost:8000/get_forms_by_roll_number/', { roll_number: rollNumber, cookie: cookie })
        .then(res => {
          console.log(res);
          console.log(res.data);
          setForms(res.data.forms);
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (rollNumber.trim() === '') {
      setNotify({
        open: true,
        message: 'Please enter a roll number.',
        severity: 'error',
        handleClose: () => {
          setNotify((prev) => ({ ...prev, open: false }));
        },
      });
    } else {
      fetchFormsByRollNumber();
    }
  };

  const handleGrade = async (formId,grade) => {
    axios.post('http://localhost:8000/grade_given/', {form_id: formId, cookie: cookie, grade: grade})
    .then(res => {
      console.log(res);
      console.log(res.data);
      
      if(res.data.status === 200){
        setNotify({
          open: true,
          message: res.data.message,
          severity: "success",
          handleClose: () => {
            setNotify((prev) => ({ ...prev, open: false }));
          },
        });

        fetchFormsByRollNumber();
      }
      else{
        setNotify({
          open: true,
          message: res.data.message,
          severity: "error",
          handleClose: () => {
            setNotify((prev) => ({ ...prev, open: false }));
          },
        });
      }
    }).catch(err => {
      console.log(err);
      setNotify({
        open: true,
        message: "Server is probably down",
        severity: "error",
        handleClose: () => {
          setNotify((prev) => ({ ...prev, open: false }));
        },
      });
    }
    )
  };

  return (
    <div className='container-search'>
      <h2>Search Forms by Roll Number</h2>
      <input
        type='text'
        placeholder='Enter Roll Number'
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {forms.map((form) => (
        <div key={form.id}>
            <h3>{form.title}</h3>
            <p>Description: {form.description}</p>
            <p>Students: {form.studentName}</p>
            <p>RollNumber: {form.studentRollNumber}</p>
            <p>Supervisor: {form.supervisorName}</p>
            <p>Category: {form.category}</p>
            <p>Course Code: {form.courseCode}</p>
            <p>Semester: {form.semester}</p>
            <p>Grade: {form.grade}</p>
            {(form.grade === 'X' || form.grade === 'NA') && (
            <button
                className='btn btn-primary'
                onClick={() => handleGrade(form.id, 'S')}
            >
                S
            </button>
            )}

            {(form.grade === 'X' || form.grade === 'NA') && (
            <button
                className='btn btn-danger'
                onClick={() => handleGrade(form.id, 'U')}
            >
                U
            </button>
            )}

            {(form.grade === 'X' || form.grade === 'NA') && (
            <button
                className='btn btn-danger'
                onClick={() => handleGrade(form.id, 'X')}
            >
                X
            </button>
            )}

            <hr />
        </div>
      ))}
      <Snackbar prop={notify} />
    </div>
  );
};

export default SearchFormByRollNumber;
