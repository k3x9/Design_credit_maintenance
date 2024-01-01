// SideBar.jsx

import React from 'react';
import { Stack } from '@mui/material';
import { categories } from '../utils/constants';

const SideBar = ({ selectedCategory, setSelectedCategory, userType }) => {
  const visibleCategories = categories.filter(category => {
    if (userType === 'student') {
      return ['Home', 'Form', 'Projects'].includes(category.name);
    } else if (userType === 'supervisor') {
      return ['Home', 'Projects for Approval', 'Projects'].includes(category.name);
    }
    else if (userType === 'faculty_advisor'){
        return ['Home', 'Search by Roll number', 'Search by Course Code', 'Projects for Grade'].includes(category.name);
    }
    return false;
  });

  return (
    <Stack>
      {visibleCategories.map(category => (
        <button
          className="category-btn"
          onClick={() => setSelectedCategory(category.name)}
          style={{
            background: category.name === selectedCategory && '#FC1503',
            color: 'black',
          }}
          key={category.name}
        >
          <span style={{ color: category.name === selectedCategory ? 'black' : 'red', marginRight: '100px' }}>
            {category.icon}
          </span>
          <span style={{ opacity: category.name === selectedCategory ? '1' : '0.8' }}>
            {category.name}
          </span>
        </button>
      ))}
    </Stack>
  );
};

export default SideBar;
