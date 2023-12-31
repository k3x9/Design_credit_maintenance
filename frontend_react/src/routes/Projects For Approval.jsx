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
    try {
      axios.post('https://dcm-backend.vercel.app/get_forms/', { cookie: cookie })
        .then(res => {
          console.log(res);
          console.log(res.data);
          setForms(res.data.forms);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingForms();
  }, []);

  const handleReject = async (formId) => {
    axios.post('https://dcm-backend.vercel.app/reject_form/', { form_id: formId, cookie: cookie })
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
          fetchPendingForms();
        } else {
          setNotify({
            open: true,
            message: res.data.message,
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
  };

  const handleApprove = async (formId) => {
    axios.post('https://dcm-backend.vercel.app/approve_form/', { form_id: formId, cookie: cookie })
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
          fetchPendingForms();
        } else {
          setNotify({
            open: true,
            message: res.data.message,
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
  };

  return (
    <div className='container-btn'>
      <h2><u>Projects for Approval</u></h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sr No</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Students</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Roll Number</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form, index) => (
            <tr key={form.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{form.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{form.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{form.studentName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{form.studentRollNumber}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => handleApprove(form.id)}>Approve</button>
                <button onClick={() => handleReject(form.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Snackbar prop={notify} />
    </div>
  );
};

export default ProjectsForApproval;
