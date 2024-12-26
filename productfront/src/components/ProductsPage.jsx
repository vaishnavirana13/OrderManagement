// ProductsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductsPage = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Available Products</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.productid}>
                <td>{product.productname}</td>
                <td>{product.productdescription}</td>
                <td>
                  <button onClick={() => onAddToCart(product)}>Add to Cart</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
