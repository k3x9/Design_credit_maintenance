// SearchFormByCourseCode.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Snackbar from "../components/snack_bar/toast";

const SearchFormByCourseCode = () => {
    const departmentCourseCodes = {
      CSE: ['CSN1020', 'CSN2020', 'CSN3020'],
      EE: ['EEN1010', 'EEN2020', 'EEN3010'],
      ME: ['MEN1010', 'MEN2010', 'MEN3010'],
      CI: ['CIN1010', 'CIN2010', 'CIN3010'],
      CH: ['CHN1010', 'CHN2010', 'CHN3010'],
      ES: ['ESN1010', 'ESN2010', 'ESN3010'],
      BB: ['BBN1010', 'BBN2010', 'BBN3010'],
      MT: ['MTN1010', 'MTN2010', 'MTN3010'],
  };
  const [forms, setForms] = useState([]);
  const [dept, setDept] = useState('CSE');
  const cookie = localStorage.getItem('imp_cookie');
  const getUserDepartment = async () => {
    try {
      const res = await axios.post('https://dcm-backend.vercel.app/get_user_department/', { cookie: cookie });
      console.log(res);
      console.log(res.data);
      setDept(res.data.department); // Set the department in state
    } catch (err) {
      console.log(err);
    }
  }
  const [courseCode, setCourseCode] = useState(departmentCourseCodes[dept][0] || '');
    const [notify, setNotify] = React.useState({
        open: false,
        message: "",
        severity: "success",
        handleClose: () => {
        setNotify((prev) => ({ ...prev, open: false }));
        },
    });

  
    const fetchFormsByCourseCode = async () => {
        try {
            axios.post('https://dcm-backend.vercel.app/get_forms_by_course_code/', { course_code: courseCode, cookie: cookie })
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

    useEffect(() => {
        const fetchData = async () => {
          await getUserDepartment();
        };
    
        fetchData();
    }, []);
        
    const handleSearch = async () => {
        if (courseCode.trim() === '') {
        setNotify({
            open: true,
            message: 'Please enter a course code.',
            severity: 'error',
            handleClose: () => {
            setNotify((prev) => ({ ...prev, open: false }));
            },
        });
        } else {
        fetchFormsByCourseCode();
        }
    };

    const handleGrade = async (formId, grade) => {
        axios.post('https://dcm-backend.vercel.app/grade_given/', { form_id: formId, cookie: cookie, grade: grade })
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

            fetchFormsByCourseCode();
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

    const handleViewAll = async () => {
      try {
        window.location.href = '/view-all-forms';
      } catch (error) {
        console.log(error);
      }
    };

    return (
        <div className='container-search'>
          <h2><u>Search Forms by Course Code</u></h2>
          {dept && (
            <>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              >
                {departmentCourseCodes[dept].map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
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
                      <tr key={form.id}>
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
            </>
          )}
          <Snackbar prop={notify} />
        </div>
      );
      
};

export default SearchFormByCourseCode;
