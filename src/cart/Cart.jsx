import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./cart.css";

const Cart = ({
  cartItems,
  totalPrice,
  handleRemoveFromCart,
  handleClearCart,
  handlePurchase,
}) => {
  return (
    <div className="cart-container">
      {cartItems.length === 0 ? (
        <p className="empty-cart">No movies in cart.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map(({ id, title, price }) => (
            <li key={id} className="cart-item">
              <span>
                {title} - ${price}
              </span>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFromCart(id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="total-price">
            <p>Total: ${totalPrice.toFixed(2)}</p>
          </div>

          <div className="button-container">
            <button className="purchase-btn" onClick={handlePurchase}>
              Purchase
            </button>
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
