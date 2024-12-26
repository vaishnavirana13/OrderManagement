import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import './styles/OrderSummary.css';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  // Retrieve the cart from the location state
  const { cart } = location.state || { cart: [] };

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId); // Deselect if already selected
      } else {
        return [...prevSelected, productId]; // Select the product
      }
    });
  };

  // Handle cancel order
  const handleCancel = () => {
    navigate('/'); // Navigate back to home
  };

  // Handle submit order
  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      setShowPopup(true); // Show popup if no products are selected
      return;
    }

    try {
      setOrderSubmitted(false); // Reset submission state
      const orderDescription = 'New Order'; // Or generate dynamically if needed
      const createdAt = new Date().toISOString(); // Use current date/time as createdAt

      // Loop over the selected products and submit the data for each product
      for (let productId of selectedProducts) {
        const product = cart.find((item) => item.productid === productId);
        if (product) {
          const { productid, productname, quantity, productdescription } = product;

          const response = await axios.post('http://localhost:4000/api/orders', {
            orderDescription,
            createdAt,
            productId: productid,
            quantity,
            productName: productname,
            productDescription: productdescription,
          });

          console.log('Order submitted successfully:', response.data);
        }
      }

      setOrderSubmitted(true); // Set submission success state
      setTimeout(() => {
        alert('Order submitted successfully!');
        navigate('/'); // Redirect to the order-management page after successful submission
      }, 1000);
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('There was an error submitting the order.');
    }
  };

  // Handle close of the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="order-summary-container">
      <h1>New Orders</h1>

      {orderSubmitted && <p className="success-message">Order Submitted!</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Display selected items' details */}
      {selectedProducts.length > 0 ? (
        <div className="selected-products">
          <h2>Selected Items</h2>
          {selectedProducts.map((productId) => {
            const product = cart.find((item) => item.productid === productId);
            return (
              product && (
                <div key={product.productid} className="product-details">
                  <h3>{product.productname}</h3>
                  <p><strong>Description:</strong> {product.productdescription}</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                </div>
              )
            );
          })}
        </div>
      ) : (
        <p>Please select products to order.</p>
      )}

      {/* List all products with option to select/deselect */}
      <h2>Select Products</h2>
      {cart.length > 0 ? (
        <div className="product-list product-listitem">
          {cart.map((product) => (
            <div key={product.productid} className="product-card prodDes">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.productid)}
                onChange={() => handleSelectProduct(product.productid)}
              />
              <h3>{product.productname}</h3>
              <p>{product.productdescription}</p>
            </div>
          ))}
        </div>
        
      ) : (
        <p>No products in your cart.</p>
      )}
    
    <div className="order-actions">
  <button onClick={handleCancel} className="cancel-button">
    Cancel
  </button>
  <button onClick={handleSubmit} className="submit-button">
    Submit Order
  </button>
</div>


      {/* Sidebar with images */}
      <div className="sidebar">
        {selectedProducts.length === 0 ? (
          <img
            src="/assets/image/selectfirst.jpg" // Image for no product selected
            alt="No product selected"
            className="sidebar-image"
          />
        ) : (
          <img
            src="/assets/image/productselected.jpg" // Image for product selected
            alt="Product selected"
            className="sidebar-image"
          />
        )}
      </div>

      {/* Popup for no item selected */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <img 
              src="/assets/image/oppsi.png" // Replace with the actual image URL
              alt="No items selected"
              className="popup-image"
            />
            <p>Please select at least one item to proceed with the order.</p>
            <button onClick={closePopup} className="close-popup-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
