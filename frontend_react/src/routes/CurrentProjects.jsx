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

  return (
    <div className='container-projects'>
      <h2>All Projects</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '1rem', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Sr No.</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Project Title</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Student</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{index+1}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{project.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{project.student}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{project.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Projects;
