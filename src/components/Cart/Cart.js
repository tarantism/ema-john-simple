import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = (props) => {
    const cart = props.cart;
    console.log(cart);
    // const totalPrice = cart.reduce((total, prd) => total + prd.price, 0);
    let totalPrice = 0;
    for(let i = 0; i < cart.length; i++) {
        const product = cart[i];
        totalPrice =totalPrice + product.price;
    }

    let shipping = 0;
    if (totalPrice > 35){
        shipping = 0;
    }
    else if (totalPrice > 15){
        shipping =4.99
    }
    else if (totalPrice > 0){
        shipping = 12.99;
    }

    const tax = totalPrice / 10;
    const grandTotal = totalPrice + shipping + tax;

    const formatNumber = num => {
        const precision = num.toFixed(2);
        return Number(precision);
    }
    
    return (
        <div>
            <h4>Order Summary</h4>
            <p>Items ordered: {cart.length}</p>
            <p>Product Price: {formatNumber(totalPrice)}</p>
            <p><small>Shipping Cost: {shipping}</small></p>
            <p><small>Tax + VAT: {formatNumber(tax)}</small></p>
            <p>Total price: {formatNumber(grandTotal)}</p>
            <br/>
            <Link to="/review">
            <button className="main-button">Review Order</button>
            </Link>
        </div>
    );
};

export default Cart;