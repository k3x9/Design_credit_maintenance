// Home.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SideBar from './SideBar';
import Form from './Form';
import ProjectsForApproval from './Projects For Approval';

const Home = () => {
  const [userType, setUserType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Home'); // Default category

  useEffect(() => {
    // Fetch user_type from local storage
    const storedUserType = localStorage.getItem('user_type');
    setUserType(storedUserType);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box
        sx={{
          height: { sx: 'auto', md: '92vh' },
          borderRight: '1px solid #3d3d3d',
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
        ): selectedCategory === 'Projects For Approval' ? (
          <ProjectsForApproval />  
        ): null
        }

      </Box>
    </Box>
  );
};

export default Home;