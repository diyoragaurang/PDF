import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Header from './Header';
import Footer from './Footer';


const Invoice = ({ invoiceData }) => {
  const invoiceRef = useRef(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(40);
    doc.text(invoiceData.company.name, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(invoiceData.company.address, 105, 30, { align: 'center' });
    doc.text(`Phone: ${invoiceData.company.phone} | Email: ${invoiceData.company.email}`, 105, 35, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Invoice #${invoiceData.invoiceNumber}`, 20, 50);
    doc.setFontSize(10);
    doc.text(`Date: ${invoiceData.date}`, 20, 55);
    doc.text(`Due Date: ${invoiceData.dueDate}`, 20, 60);
    
    doc.text(`Bill To:`, 140, 50);
    doc.text(`${invoiceData.client.name || 'N/A'}`, 140, 55);
    doc.text(`${invoiceData.client.address || 'N/A'}`, 140, 60);
    doc.text(`${invoiceData.client.email || 'N/A'}`, 140, 65);
    
    const tableColumn = ["Item", "Description", "Quantity", "Unit Price", "Amount"];
    const tableRows = [];
    
    invoiceData.items.forEach(item => {
      const amount = item.quantity * item.unitPrice;
      const itemData = [
        item.name,
        item.description,
        item.quantity,
        `₹${item.unitPrice.toFixed(2)}`,
        `₹${amount.toFixed(2)}`
      ];
      tableRows.push(itemData);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 85;
    
    doc.text(`Subtotal: ₹${invoiceData.subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`Tax (${invoiceData.taxRate}%): ₹${invoiceData.tax.toFixed(2)}`, 140, finalY + 5);
    doc.text(`Total: ₹${invoiceData.total.toFixed(2)}`, 140, finalY + 10);
    
    doc.setFontSize(8);
    doc.text(`Thank you for your business!`, 105, finalY + 30, { align: 'center' });
    doc.text(`Terms and Conditions: ${invoiceData.terms}`, 105, finalY + 35, { align: 'center' });
    
    doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div>
      <div ref={invoiceRef} className="invoice-container">
        <Header 
          companyName={invoiceData.company.name} 
          logo={invoiceData.company.logo} 
        />
        
        <div className="invoice-details">
          <h2>Invoice #{invoiceData.invoiceNumber}</h2>
          <div className="invoice-meta">
            <div>
              <p><strong>Date:</strong> {invoiceData.date}</p>
              <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
            </div>
            <div className="client-info">
              <h3>Bill To:</h3>
              <p>{invoiceData.client.name || 'N/A'}</p>
              <p>{invoiceData.client.address || 'N/A'}</p>
              <p>{invoiceData.client.email || 'N/A'}</p>
            </div>
          </div>
          
          <table className="invoice-items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-items">No items added yet</td>
                </tr>
              ) : (
                invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unitPrice.toFixed(2)}</td>
                    <td>₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Subtotal</td>
                <td>₹{invoiceData.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="4">Tax ({invoiceData.taxRate}%)</td>
                <td>₹{invoiceData.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="4"><strong>Total</strong></td>
                <td><strong>₹{invoiceData.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div className="invoice-notes">
            <p><strong>Notes:</strong> {invoiceData.notes}</p>
            <p><strong>Terms:</strong> {invoiceData.terms}</p>
          </div>
        </div>
        
        <Footer companyInfo={invoiceData.company} />
      </div>
      
      <button onClick={generatePDF} className="download-btn">
        Download PDF
      </button>
    </div>
  );
};

export default Invoice;