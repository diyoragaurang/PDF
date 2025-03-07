import React from 'react';

const Footer = ({ companyInfo }) => {
  return (
    <div className="footer">
      <p>{companyInfo.address}</p>
      <p>Phone: {companyInfo.phone} | Email: {companyInfo.email}</p>
      <p>© {new Date().getFullYear()} {companyInfo.name}</p>
    </div>
  );
};

export default Footer;