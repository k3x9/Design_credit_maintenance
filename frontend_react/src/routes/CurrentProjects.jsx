import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const cookie = localStorage.getItem('imp_cookie');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post('https://dcm-backend.vercel.app/supervisor_projects/', { cookie: cookie });
        console.log(response.data);
        setProjects(response.data.forms || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, [cookie]);

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
    <div className='container-projects'>
      <h2>All Projects</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '1rem', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Sr No.</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Project Title</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Student</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Roll Number</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{index+1}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{project.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{project.student}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{project.roll_number}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{project.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  {project.supervisor_approval === false && (
                    <div>
                      <button onClick={() => handleApprove(project.form_id)}>Approve</button>
                      <button onClick={() => handleReject(project.form_id)}>Reject</button>
                    </div>
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Projects;
