import React from 'react';
import firebase from '../firebase';

class AddStockForm extends React.Component {
    constructor(props) {
        super(props);
        this.reload = props;
        this.state = {
            ticker: '',
            price: '',
            quantity: ''
        }
    }
    // On Click
    handleAddStock = (e) => {
        e.preventDefault();
        this.addStock();
        this.clearInput();
    }
    // Add data to firebase
    addStock = () => {
        const docId = firebase.auth().currentUser.uid;
        const db = firebase.firestore().collection('users');
        db.doc(docId).collection('stocks').doc(this.state.ticker.toUpperCase()).set({
            ticker: this.state.ticker.toUpperCase(),
            price: this.state.price,
            quantity: this.state.quantity
        })
        console.log('stock added');
        // Reload user stocks
        this.props.getUserStocks();
    }
    // Clear form values
    clearInput = () => {
        document.getElementById('stock-form').reset();
    }
    render() {
        return (
            <form onSubmit={this.handleAddStock} id="stock-form">
                <div className="addStock">
                    <label>Ticker Symbol:</label>
                    <input id="ticker-input" type="text" maxLength="8" onChange={e => this.setState({ticker: e.target.value})} required />
                </div>
                <div className="addStock">
                    <label>Avg. Buy Price:</label>
                    <input id="price-input" type="number" step="0.01" min="0" maxLength="12" onChange={e => this.setState({price: e.target.value})} required />
                </div>
                <div className="addStock">
                    <label>Quantity:</label>
                    <input id="quantity-input" type="number" maxLength="10" onChange={e => this.setState({quantity: e.target.value})} required />
                </div>
                <button className="btn btn-success" onClick={this.handleAddStock} type="submit">Add Stock</button>
            </form>
        )
    }
}

export default AddStockForm;