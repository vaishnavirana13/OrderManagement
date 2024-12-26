import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './homepage/Header';
import ProductList from './homepage/ProductList';
import Cart from './homepage/Cart';
import './styles/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    id: '',
  });
  const [bouncingImageId, setBouncingImageId] = useState(null);
  const navigate = useNavigate();
  const cartRef = useRef(null); // Create a ref for the Cart component

  const productImagesArray = {
    1: ["/assets/image/laptop1.jpg"],
    2: ["/assets/image/laptop2.jpg"],
    3: ["/assets/image/carimage.jpg"],
    4: ["/assets/image/bikeimage.jpg"],
  };

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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    const currentDate = new Date().toISOString();
    const orderDescription = `Customer: ${customerDetails.name}, Email: ${customerDetails.email}, Product: ${product.productname}`;

    setBouncingImageId(product.productid);
    setTimeout(() => setBouncingImageId(null), 600);

    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.productid === product.productid);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productid === product.productid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
          dateAdded: currentDate,
          orderDescription,
        },
      ];
    });

    // Scroll to Cart after adding to cart
    cartRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productid !== productId));
  };

  const handleIncrement = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productid === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrement = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productid === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleProceed = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add products to your cart.");
      return;
    }

    const orderDetails = cart.map((item) => ({
      orderDescription: item.orderDescription,
      createdAt: item.dateAdded,
      productId: item.productid,
      quantity: item.quantity,
      customerId: customerDetails.id,
    }));

    try {
      await Promise.all(orderDetails.map(async (order) => {
        await axios.post('http://localhost:4000/api/orders', order);
      }));

      setCart([]);
      setCustomerDetails({
        name: '',
        email: '',
        id: '',
      });

      localStorage.removeItem('cart');

      navigate('/order-summary', { state: { cart } });
    } catch (error) {
      console.error('Error proceeding with the order:', error);
    }
  };

  return (
    <div className="home-outer">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={(e) => setSearchQuery(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <ProductList
        products={products}
        productImagesArray={productImagesArray}
        searchQuery={searchQuery}
        handleAddToCart={handleAddToCart}
        openImagePopup={(image) => console.log('Open popup for', image)} // Replace with your logic
        bouncingImageId={bouncingImageId}
      />
      <Cart
        cart={cart}
        productImagesArray={productImagesArray}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleDeleteFromCart={handleDeleteFromCart}
        handleProceed={handleProceed}
        ref={cartRef} // Pass the ref to the Cart component
      />
    </div>
  );
};

export default Home;
