import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './InvoiceStyles.css';

const Invoice = ({ invoiceData }) => {
  const invoiceRef = useRef(null);

  // Calculate item-specific tax and amount
  const calculateItemTax = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = (subtotal * (item.taxRate || invoiceData.taxRate)) / 100;
    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount
    };
  };

  // Calculate totals for the entire invoice
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    invoiceData.items.forEach(item => {
      const calculation = calculateItemTax(item);
      subtotal += calculation.subtotal;
      totalTax += calculation.taxAmount;
    });

    return {
      subtotal,
      tax: totalTax,
      total: subtotal + totalTax
    };
  };

  const totals = calculateTotals();

  const generatePDF = async () => {
    // Create PDF from the styled HTML content
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div className="invoice-container">
      <div className="invoice-content" ref={invoiceRef}>
        <div className="invoice-header">
          <h1 className="company-name">{invoiceData.company.name}</h1>
          <p className="company-address">{invoiceData.company.address}</p>
          <p className="company-contact">Phone: {invoiceData.company.phone} | Email: {invoiceData.company.email}</p>
        </div>
        
        <div className="invoice-info">
          <div className="invoice-number">
            <h2>Invoice #{invoiceData.invoiceNumber}</h2>
            <p>Date: {invoiceData.date}</p>
            <p>Due Date: {invoiceData.dueDate}</p>
          </div>
          
          <div className="client-info">
            <h3>Bill To:</h3>
            <p>{invoiceData.client.name || 'N/A'}</p>
            <p>{invoiceData.client.address || 'N/A'}</p>
            <p>{invoiceData.client.email || 'N/A'}</p>
          </div>
        </div>
        
        <div className="invoice-items">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Tax Rate</th>
                <th>Tax Amount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => {
                const calculation = calculateItemTax(item);
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unitPrice.toFixed(2)}</td>
                    <td>{item.taxRate || invoiceData.taxRate}%</td>
                    <td>₹{calculation.taxAmount.toFixed(2)}</td>
                    <td>₹{calculation.total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="invoice-summary">
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Total Tax:</span>
            <span>₹{totals.tax.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="invoice-footer">
          <p className="thank-you">Thank you for your business!</p>
          <p className="terms">Terms and Conditions: {invoiceData.terms}</p>
        </div>
      </div>
      
      <button className="generate-pdf-btn" onClick={generatePDF}>
        Download Invoice PDF
      </button>
    </div>
  );
};

export default Invoice;