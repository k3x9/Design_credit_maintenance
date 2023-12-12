import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from "../components/snack_bar/toast";

const ProjectsForApproval = () => {
  const [forms, setForms] = useState([]);
  const cookie = localStorage.getItem('imp_cookie')
  const [notify, setNotify] = React.useState({
    open: false,
    message: "",
    severity: "success",
    handleClose: () => {
      setNotify((prev) => ({ ...prev, open: false }));
    },
  });

  const fetchPendingForms = async () => {
    try{
        axios.post('http://localhost:8000/get_forms_super/', {cookie: cookie})
        .then(res => {
            console.log(res);
            console.log(res.data);
            setForms(res.data.forms);
        }).catch(err => {
            console.log(err);
        }
        )
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingForms();
  }, []);

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
        fetchPendingForms();
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


//   const handleApprove = async (formId) => {
//     axios.post('http://localhost:8000/approve_form_super/', {form_id: formId, cookie: cookie})
//     .then(res => {
//         console.log(res);
//         console.log(res.data);

//         if (res.data.status === 200){
//           setNotify({
//             open: true,
//             message: res.data.message,
//             severity: "success",
//             handleClose: () => {
//               setNotify((prev) => ({ ...prev, open: false }));
//             },
//           });
//           fetchPendingForms();
//         }
//         else{
//           setNotify({
//             open: true,
//             message: res.data.message,
//             severity: "error",
//             handleClose: () => {
//               setNotify((prev) => ({ ...prev, open: false }));
//             },
//           });
//         }
//     }).catch(err => {
//         console.log(err);
//         setNotify({
//           open: true,
//           message: "Server is probably down",
//           severity: "error",
//           handleClose: () => {
//             setNotify((prev) => ({ ...prev, open: false }));
//           },
//         });
//     }
//     )
//   };

  return (
    <div className='container-btn'>
      <h2>Projects for Grade</h2>
      {forms.map((form) => (
        <div key={form.id}>
          <h3>{form.title}</h3>
          <p>Description: {form.description}</p>
          <p>Students: {form.studentName}</p>
          <p>RollNumber: {form.studentRollNumber}</p>
          <button className='btn btn-primary' onClick={() => handleGrade(form.id,'S')}>
            S
          </button>
          <button className='btn btn-danger' onClick={() => handleGrade(form.id,'U')}>
            U
          </button>
          <button className='btn btn-danger' onClick={() => handleGrade(form.id,'X')}>
            X
          </button>
          <hr />
        </div>
      ))}
      <Snackbar prop={notify} />
    </div>
  );
};

export default ProjectsForApproval;
