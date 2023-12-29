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

  const handleViewAll = async () => {
    try {
      window.location.href = '/view-all-forms';
    } catch (error) {
      console.log(error);
    }
  };

  const handleGrade = async (formId, grade) => {
    axios.post('http://localhost:8000/grade_given/', { form_id: formId, cookie: cookie, grade: grade })
      .then(res => {
        console.log(res);
        console.log(res.data);

        if (res.data.status === 200) {
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
        else {
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
      <h2><u>Search Forms by Roll Number</u></h2>
      <input
        type='text'
        placeholder='Enter Roll Number'
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleViewAll}>View All</button>
      {forms && forms.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '1rem', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Sr No.</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Project Title</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Students</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>RollNumber</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Supervisor</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Category</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Course Code</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Semester</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Grade</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form, index) => (
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.studentName}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.studentRollNumber}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.studentEmail}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.supervisorName}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.category}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.courseCode}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.semester}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{form.grade}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  {(form.grade === 'X' || form.grade === 'NA') && (
                    <button className='btn btn-primary' onClick={() => handleGrade(form.id, 'S')}>S</button>
                  )}

                  {(form.grade === 'X' || form.grade === 'NA') && (
                    <button className='btn btn-danger' onClick={() => handleGrade(form.id, 'U')}>U</button>
                  )}

                  {(form.grade === 'X' || form.grade === 'NA') && (
                    <button className='btn btn-danger' onClick={() => handleGrade(form.id, 'X')}>X</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Snackbar prop={notify} />
    </div>
  );
};

export default SearchFormByRollNumber;
