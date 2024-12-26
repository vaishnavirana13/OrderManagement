import React, { forwardRef } from 'react';
import '../styles/Home.css';

const Cart = forwardRef(({ 
  cart, 
  productImagesArray, 
  handleIncrement, 
  handleDecrement, 
  handleDeleteFromCart, 
  handleProceed 
}, ref) => {

  return (
    <div className='cart-outer'>
      <div className='container ' ref={ref}>
      <h2>Cart</h2>
      {cart.length > 0 ? (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Date Added</th>
                <th>Order Description</th>
                <th>Product Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.productid}>
                  <td>{item.productid}</td>
                  <td>{item.productname}</td>
                  <td className='quantdata'>
                    <button className='incredecre' onClick={() => handleDecrement(item.productid)}>-</button>
                    {item.quantity}
                    <button className='incredecre' onClick={() => handleIncrement(item.productid)}>+</button>
                  </td>
                  <td>{new Date(item.dateAdded).toLocaleString()}</td>
                  <td>{item.orderDescription}</td>
                  <td>
                    <div className="image-stack">
                      {Array.from({ length: Math.min(item.quantity, 3) }).map((_, index) => (
                        <img
                          key={index}
                          src={productImagesArray[item.productid][0]}
                          alt={`product-image-${index}`}
                          className="stacked-image"
                        />
                      ))}
                      {item.quantity > 3 && (
                        <div className="extra-images">+{item.quantity - 3}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteFromCart(item.productid)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='orderSummaryBtn'>
            <button onClick={handleProceed} className="proceed-button">
              Proceed to Order Summary
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty. Add products to see them here.</p>
      )}
    </div>
    </div>
  );
});

export default Cart;
