import React from 'react';
import { Link } from 'react-router-dom';
import alphavantage from 'alphavantage';
import firebase from '../firebase';

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockTicker: 'No Data',
            stockName: 'No Data',
            lastDate: 'No Data',
            lastClose: 'No Data',
            buyPrice: 'No Data',
            quantity: '0.00',
            frequency: 'No Data',
            amount: '0.00',
            payDate: 'No Data',
            exDate: 'No Data',
            uid: ''
        }
        this.alpha = alphavantage({ key: 'CHXXAK02QJFV0815' });
        this.db = firebase.firestore();
    }
    // on load
    componentDidMount = () => {
        this.authListener();
        this.getStock();
    }
    // check what stock to load
    getStock = () => {
        // get stock from url path
        let stockPath = window.location.pathname;
        let ticker = stockPath.split('/stock/').pop();
        this.setState({ stockTicker: ticker.toUpperCase() });
        this.alphaVantage(ticker);
        this.iexCloud(ticker)
        
        
    }
    // using Alpha Vantage to get stock info
    alphaVantage = (symbol) => {
        this.alpha.data.daily_adjusted(symbol).then(data => {
            this.setState({ lastDate: data["Meta Data"]["3. Last Refreshed"] });
            this.setState({ lastClose: data["Time Series (Daily)"][this.state.lastDate]["4. close"] });
        })
    }
    // get dividend info from IEX Cloud api
    iexCloud = (symbol) => {
        // Set link to cloud or sandbox
        // Live api key
        const api_token = process.env.REACT_APP_LIVE_STOCK_API;
        // Sandbox api key
        //const api_token = process.env.REACT_APP_TEST_STOCK_API;
        const iex_api = `https://cloud.iexapis.com/stable/stock/${symbol}/dividends/1m?token=${api_token}`;

        fetch(iex_api)
        .then(res => res.json())
        .then(data => {
            if(data.length !== 0) {
                this.setState({
                    frequency: data[0].frequency,
                    exDate: data[0].exDate,
                    payDate: data[0].paymentDate,
                    amount: data[0].amount
                });
            }
        })
    }
    // check user authentication
    authListener = () => {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ uid: user.uid });
            this.getUserInfo();
        })
      }
    // retrieve user info from firebase
    getUserInfo = () => {
        // db = firebase.firestore();
        this.db.collection('users').doc(this.state.uid).collection('stocks').doc(this.state.stockTicker).get().then(snap => {
            this.setState({
                buyPrice: snap.data().price,
                quantity: snap.data().quantity
            });
        })
    }
    // edit stock data in firebase
    editStock = (e) => {
        e.preventDefault();
        this.db.collection('users').doc(this.state.uid).collection('stocks').doc(this.state.stockTicker).set({
            ticker: this.state.stockTicker,
            price: document.getElementById('newPrice').value,
            quantity: document.getElementById('newQuantity').value
        }).then(() => {
            document.getElementById('newPrice').value = '';
            document.getElementById('newQuantity').value = '';
        })
    }
    // delete stock from firebase
    deleteStock = () => {
        this.db.collection('users').doc(this.state.uid).collection('stocks').doc(this.state.stockTicker).delete().then(() => {
            console.log('stock deleted');
        })
    }
    render() {
        return (
            <div>
                <div className="stock-name-delete">
                    <h3>{this.state.stockTicker}</h3>
                    <Link to="/portfolio" className="btn btn-danger" onClick={this.deleteStock}>DELETE</Link>
                </div>
                <form id="edit-stock" onSubmit={this.editStock}>
                    <div className="editStock">
                        <label>Quantity:</label>
                        <input id="newQuantity" type="number" maxLength="10" />
                    </div>
                    <div className="editStock">
                        <label>Avg. Buy Price:</label>
                        <input id="newPrice" type="number" step="0.01" min="0" maxLength="12" />
                    </div>
                    <button className="btn btn-success" type="submit" onClick={this.componentDidMount}>Update</button>
                </form>
                <div className="stock-info">
                    <div className="">
                        <div className="info">
                            <p>Ex-Date</p>
                            <p>{this.state.exDate}</p>
                        </div>
                        <div className="info">
                            <p>Payment Date</p>
                            <p>{this.state.payDate}</p>
                        </div>
                        <div className="info">
                            <p>Frequency</p>
                            <p>{this.state.frequency}</p>
                        </div>
                        <div className="info">
                            <p>Amount</p>
                            <p>${this.state.amount}</p>
                        </div>
                    </div>
                    <div className="">
                        <div className="info">
                            <p>Market Value</p>
                            <p>${(Math.round(((this.state.lastClose) * (this.state.quantity)) * 100) / 100).toFixed(2)}</p>
                        </div>
                        <div className="info">
                            <p>Last Stock Date</p>
                            <p>{this.state.lastDate}</p>
                        </div>
                        <div className="info">
                            <p>Last Closing Price</p>
                            <p>${(Math.round((this.state.lastClose) * 100) / 100).toFixed(2)}</p>
                        </div>
                        <div className="info">
                            <p>Total Return</p>
                            <p>${(Math.round((((this.state.lastClose) * (this.state.quantity)) - ((this.state.buyPrice) * (this.state.quantity))) * 100) / 100).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="">
                        <div className="info">
                            <p>Average Cost</p>
                            <p>${this.state.buyPrice}</p>
                        </div>
                        <div className="info">
                            <p>Shares</p>
                            <p>{this.state.quantity}</p>
                        </div>
                        <div className="info">
                            <p>Next Estimated Dividend</p>
                            <p>~${(Math.round(((this.state.quantity) * (this.state.amount)) * 100) / 100).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Stock;