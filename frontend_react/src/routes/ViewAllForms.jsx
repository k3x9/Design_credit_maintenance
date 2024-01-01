import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataTable = () => {
  const cookie = localStorage.getItem('imp_cookie');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://dcm-backend.vercel.app/get_all/', { cookie });
        console.log(response);
        if(response.data.status === 400) {
          window.location.href = '/login';
        }
        setData(response.data.forms);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [cookie]);

  return (
    <div>
      <h2>Data Table</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '5px' }}>Sr No.</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Roll Number</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course No. Registered this semester</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category registered this semester</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>No. of Credits Completed so far</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Course Code of the design credit course completed</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits in Category 1</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits in Category 2</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits in Category 3</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits in Category 4</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits in Category 5</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits in Category 6</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '5px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', whiteSpace: 'nowrap' }}>{row.Name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.RollNumber}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.CourseNumber}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.Category}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.CreditsCompleted}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{row.CourseCodeCompleted}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.Category1}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.Category2}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.Category3}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.Category4}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.Category5}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.Category6}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
