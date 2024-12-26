import React from 'react';
import '../styles/Home.css'

const ProductList = ({ 
  products, 
  productImagesArray, 
  searchQuery, 
  handleAddToCart, 
  openImagePopup, 
  bouncingImageId
}) => {
  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.productid.toString().includes(searchQuery)
  );

  return (
    <div className='container'>
     <div className='row'>
     <div className='col-md-8'>
     <h2 className='text-center p-5 text-lg-center'>Available Products</h2>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.productid} className="product-card">
              <div className="product-images">
                <h3>{product.productname}</h3>
                {productImagesArray[product.productid] && productImagesArray[product.productid].length > 0 ? (
                  productImagesArray[product.productid].map((image, index) => (
                    <img
                      key={index}
                      src={image || 'default-image.jpg'}
                      alt={`${product.productname}-image-${index}`}
                      className={`product-image ${bouncingImageId === product.productid ? 'bounce-animation' : ''}`}
                      onClick={() => openImagePopup(image)}
                    />
                  ))
                ) : (
                  <img
                    src="default-image.jpg"
                    alt={product.productname}
                    className={`product-image ${bouncingImageId === product.productid ? 'bounce-animation' : ''}`}
                    onClick={() => openImagePopup('default-image.jpg')}
                  />
                )}
              </div>

              <p><b>Description : </b>{product.productdescription}</p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products found matching your search criteria.</p>
        )}
      </div>
      </div>
      <div className='col-md-4'>
        <div className='stickySidebar'>
        <img src='/assets/image/homeimg.jpg' />
        </div>
      </div>
     </div>
     
    </div>
  );
};

export default ProductList;