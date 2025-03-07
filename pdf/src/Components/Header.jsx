import React from 'react';

const Header = ({ companyName, logo }) => {
  return (
    <div className="header">
      {logo && <img src={logo} alt="Company Logo" width="100" />}
      <h1>{companyName || 'Your Company Name'}</h1>
    </div>
  );
};

export default Header;