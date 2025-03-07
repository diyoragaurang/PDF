import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PDFDownloader = () => {

  const [userData, setUserData] = useState({
    name: "Gaurang Diyora",
    email: "gp24@gmail.com",
    age: 20,
    location: "New York",
    subscription: "Premium"
  });

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("User Information", 14, 22);

    const date = new Date().toLocaleDateString();
    doc.setFontSize(11);
    doc.text(`Generated on: ${date}`, 14, 30);

    const tableColumn = ["Field", "Value"];
    const tableRows = Object.entries(userData).map(([key, value]) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return [formattedKey, value.toString()];
    });

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('user-information.pdf');
  };

  return (
    <div className="pdf-container">
      <h2>User Information</h2>

      <div className="data-preview">
        <table>
          <tbody>
            {Object.entries(userData).map(([key, value]) => (
              <tr key={key}>
                <td className="label">{key.charAt(0).toUpperCase() + key.slice(1)}:</td>
                <td>{value.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="download-btn"
        onClick={generatePDF}
      >
        Download PDF
      </button>
    </div>
  );
};

export default PDFDownloader;