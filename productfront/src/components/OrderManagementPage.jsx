import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderManagementPage = () => {
  const location = useLocation();
  const { cart, customerDetails } = location.state || { cart: [], customerDetails: {} };

  return (
    <div className="order-management-container">
      <h1>Order Management</h1>
      
      {/* Display customer details */}
      <div className="customer-details">
        {customerDetails && customerDetails.name && (
          <>
            <h2>Customer Details</h2>
            <p><strong>Name:</strong> {customerDetails.name}</p>
            <p><strong>Email:</strong> {customerDetails.email}</p>
            <p><strong>Customer ID:</strong> {customerDetails.id}</p>
          </>
        )}
        {!customerDetails.name && <p>No customer details available.</p>}
      </div>

      <h2>Ordered Items</h2>

      {cart.length > 0 ? (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Date Added</th>
              <th>Order Description</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.productid}>
                <td>{item.productid}</td>
                <td>{item.productname}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.dateAdded).toLocaleString()}</td>
                <td>{item.orderDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Your cart is empty. Add products to see them here.</p>
      )}
    </div>
  );
};

export default OrderManagementPage;
