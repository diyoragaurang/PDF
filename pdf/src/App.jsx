import React, { useState, useEffect } from 'react';
import './App.css';
import Invoice from './components/Invoice';

// Define tax rates for different categories
const TAX_CATEGORIES = [
  { id: 'default', name: 'Default', rate: 18 },
  { id: 'food', name: 'Food', rate: 10 },
  { id: 'electronics', name: 'Electronics', rate: 15 },
  { id: 'clothing', name: 'Clothing', rate: 12 },
  { id: 'services', name: 'Services', rate: 18 },
  { id: 'books', name: 'Books', rate: 5 }
];

function App() {
  const [invoiceData, setInvoiceData] = useState({
    company: {
      name: "GP INFOSYS",
      logo: "./src/logo.png",
      address: "Office 201,202 2nd Foor, Hardik Complex,Nr. White Rose Hotel, / Honda SHow RoomVitthalwadi, Bhavnagar",
      phone: ": 0278 2513501/+91 9601272586",
      email: "gpsoftech@gmail.com"
    },
    invoiceNumber: "INV-2025-001",
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    client: {
      name: "",
      address: "",
      email: ""
    },
    items: [],
    taxRate: 18, // Default tax rate 
    notes: "Payment is due within 30 days. Thank you for your business.",
    terms: "Net 30"
  });

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    category: "default",
    taxRate: 18 // Default tax rate
  });

  const [clientInfo, setClientInfo] = useState({
    name: "",
    address: "",
    email: ""
  });

  useEffect(() => {
    // Calculation is now done in the Invoice component
    // This effect is left for future enhancements or to update other parts of the state
  }, [invoiceData.items]);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientInfo({
      ...clientInfo,
      [name]: value
    });
  };

  const updateClientInfo = (e) => {
    e.preventDefault();
    setInvoiceData({
      ...invoiceData,
      client: clientInfo
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Find the tax rate for the selected category
      const category = TAX_CATEGORIES.find(cat => cat.id === value);
      setNewItem({
        ...newItem,
        category: value,
        taxRate: category ? category.rate : 18 // Set tax rate based on category
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value
      });
    }
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name) return;
    
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { ...newItem }]
    });
    
    setNewItem({
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      category: "default",
      taxRate: 18
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...invoiceData.items];
    updatedItems.splice(index, 1);
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems
    });
  };

  const editItem = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    
    if (field === 'category') {
      // Find the tax rate for the selected category
      const category = TAX_CATEGORIES.find(cat => cat.id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        category: value,
        taxRate: category ? category.rate : 18
      };
    } else {
      // Convert to number if the field is quantity or unitPrice
      if (field === 'quantity' || field === 'unitPrice') {
        value = parseFloat(value) || 0;
      }
      
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
    }
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems
    });
  };

  // Handle default tax rate change
  const handleTaxRateChange = (e) => {
    const taxRate = parseFloat(e.target.value) || 0;
    setInvoiceData({
      ...invoiceData,
      taxRate
    });
  };

  // Calculate the invoice totals for display in the form
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    
    invoiceData.items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;
      totalTax += (itemSubtotal * (item.taxRate || invoiceData.taxRate)) / 100;
    });
    
    return {
      subtotal,
      tax: totalTax,
      total: subtotal + totalTax
    };
  };

  const totals = calculateTotals();

  return (
    <div className="app">
      <h1 className='header'>Invoice Generator</h1>
      
      <div className="invoice-form-container">
        <div className="invoice-form">
          <h2>Client Information</h2>
          <form onSubmit={updateClientInfo}>
            <div className="form-group">
              <label htmlFor="name">Client Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={clientInfo.name}
                onChange={handleClientChange}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Client Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={clientInfo.address}
                onChange={handleClientChange}
                placeholder="Enter client address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Client Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={clientInfo.email}
                onChange={handleClientChange}
                placeholder="Enter client email"
              />
            </div>
            
            <button type="submit" className="update-btn">Update Client Info</button>
          </form>
        </div>
        
        <div className="invoice-form">
          <h2>Add Invoice Item</h2>
          <form onSubmit={addItem}>
            <div className="form-group">
              <label htmlFor="itemName">Item Name:</label>
              <input
                type="text"
                id="itemName"
                name="name"
                value={newItem.name}
                onChange={handleItemChange}
                placeholder="Enter item name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleItemChange}
                placeholder="Enter description"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  step="1"
                  value={newItem.quantity}
                  onChange={handleItemChange}
                  required
                />
              </div>
              
              <div className="form-group half">
                <label htmlFor="unitPrice">Unit Price:</label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  min="0"
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={handleItemChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={newItem.category}
                onChange={handleItemChange}
              >
                {TAX_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.rate}% tax)
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="add-item-btn">Add Item</button>
          </form>
        </div>
        
        <div className="invoice-form">
          <h2>Invoice Items</h2>
          {invoiceData.items.length === 0 ? (
            <p>No items added yet. Use the form above to add items.</p>
          ) : (
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Tax Rate</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => {
                  const itemTotal = item.quantity * item.unitPrice;
                  const itemTax = (itemTotal * (item.taxRate || invoiceData.taxRate)) / 100;
                  const itemTotalWithTax = itemTotal + itemTax;
                  
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => editItem(index, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => editItem(index, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => editItem(index, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => editItem(index, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={item.category || 'default'}
                          onChange={(e) => editItem(index, 'category', e.target.value)}
                        >
                          {TAX_CATEGORIES.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{item.taxRate || invoiceData.taxRate}%</td>
                      <td>₹{itemTotalWithTax.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => removeItem(index)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          <div className="totals-section">
            <div className="form-group">
              <label htmlFor="taxRate">Default Tax Rate (%):</label>
              <input
                type="number"
                id="taxRate"
                min="0"
                max="100"
                step="0.1"
                value={invoiceData.taxRate}
                onChange={handleTaxRateChange}
              />
              <p className="help-text">This is the default tax rate for items without a specific category.</p>
            </div>
            
            <div className="totals">
              <p><strong>Subtotal:</strong> ₹{totals.subtotal.toFixed(2)}</p>
              <p><strong>Total Tax:</strong> ₹{totals.tax.toFixed(2)}</p>
              <p className="total"><strong>Total:</strong> ₹{totals.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="invoice-preview">
        <h2>Invoice Preview</h2>
        <Invoice invoiceData={invoiceData} />
      </div>
    </div>
  );
}

export default App;