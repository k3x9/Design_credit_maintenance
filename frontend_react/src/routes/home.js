// Home.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SideBar from './SideBar';
import Form from './Form';
import ProjectsForApproval from './Projects For Approval';
import SuperProjectsForGrade from './Super Project Grade';
import SearchForms from './SearchForms';
import axios from 'axios';

const Home = () => {

  const [userType, setUserType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Home'); // Default category
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserType = localStorage.getItem('user_type');
        const storedCookie = localStorage.getItem('imp_cookie');
        console.log(storedCookie);
        const response = await axios.post('http://localhost:8000/check_cookie/', { cookie: storedCookie });

        if (response.data.status === 400) {
          window.location.href = '/login';
        }

        setUserType(storedUserType);
      } catch (error) {
        console.error('Error checking the cookie:', error);
        window.location.href = '/login';
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box
        sx={{
          height: { sx: 'auto', md: '100vh' },
          borderRight: '3px solid #3d3d3d',
          px: { sx: 0, md: 2 },
        }}
      >
        <SideBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          userType={userType}
        />
      </Box>
      <Box
      //align left
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          
        }}
      >

        {selectedCategory === 'Home' ? (
          <input
          type="text"
          value="Hii"
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '200px',
          }}
        />
        ): selectedCategory === 'Form' ? (
          <Form />
        ): selectedCategory === 'Projects for Approval' && userType === 'supervisor' ? (
          <ProjectsForApproval />  
        ): selectedCategory === 'Projects for Grade' && userType === 'faculty_advisor' ? (
          <SuperProjectsForGrade />  
        ): selectedCategory === 'Search' ? (
          <SearchForms />
        ): null
        }

      </Box>
    </Box>
  );
};

export default Home;