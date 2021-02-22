import React from 'react';
import firebase from '../firebase';
import AddStockForm from './add_stock_form';

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticker: 'No Data',
            buyPrice: 'No Data',
            quantity: '0.00',
            amount: '0.00',
            exDate: 'No Data',
            payDate: 'No Data',
            frequency: 'No Data',
            // Live api key
            api_token: process.env.REACT_APP_LIVE_STOCK_API,
            // Sandbox api key
            // api_token: process.env.REACT_APP_TEST_STOCK_API,
            // uid: firebase.auth().currentUser.uid
            uid: ''
        }
    }
    // read db for user info and stocks
    getUserStocks = () => {
        this.clearTable();
        const db = firebase.firestore();
        db.collection('users').doc(this.state.uid).collection('stocks').get().then((snap) => {
            for (let i=0; i<snap.docs.length; i++) {
                // Set link to cloud or sandbox
                const iex_api = `https://cloud.iexapis.com/stable/stock/${snap.docs[i].data().ticker}/dividends/1m?token=${this.state.api_token}`;

                fetch(iex_api)
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        ticker: snap.docs[i].data().ticker,
                        buyPrice: snap.docs[i].data().price,
                        quantity: snap.docs[i].data().quantity
                    })
                    if(data.length !== 0) {
                        this.setState({ 
                            exDate: data[0].exDate,
                            payDate: data[0].paymentDate,
                            amount: data[0].amount,
                            frequency: data[0].frequency
                        });
                    }
                }).then(() => {
                    this.createTable();
                })
            }
        })
    }
    createTable = () => {
        let tableRef = document.getElementById('user-stocks');
        let newRow = tableRef.insertRow();
        let tickerCell = newRow.insertCell(0);
        let quantityCell = newRow.insertCell(1);
        let exDateCell = newRow.insertCell(2);
        let payDateCell = newRow.insertCell(3);
        let amountCell = newRow.insertCell(4);
        let frequencyCell = newRow.insertCell(5);
        let incomeCell = newRow.insertCell(6);
        let createA = document.createElement('a');
        createA.setAttribute('href', `/stock/${this.state.ticker.toLowerCase()}`);
        createA.innerHTML = this.state.ticker;

        tickerCell.appendChild(createA);
        quantityCell.innerHTML = this.state.quantity;
        exDateCell.innerHTML = this.state.exDate;
        payDateCell.innerHTML = this.state.payDate;
        amountCell.innerHTML = ('$' + (Math.round(this.state.amount * 100) / 100).toFixed(2));
        frequencyCell.innerHTML = this.state.frequency;
        incomeCell.innerHTML = ('~$' + (Math.round((this.state.quantity * this.state.amount )* 100) / 100).toFixed(2));
    }
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({ uid: user.uid });
                this.getUserStocks();
            }
        })
    }
    // Clear all elements from table
    clearTable = () => {
        document.getElementById('user-stocks').innerHTML = '';
    }
    render() {
        return (
            <div>
                <AddStockForm getUserStocks={this.getUserStocks} />
                <div className="scrollTable">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                <td>Ticker Symbol</td>
                                <td>Quantity</td>
                                <td>Ex-Date</td>
                                <td>Payment Date</td>
                                <td>Amount per Share</td>
                                <td>Frequency</td>
                                <td>Expected Income</td>
                            </tr>
                        </thead>
                        <tbody id="user-stocks">

                        </tbody>
                    </table>
                </div>
                <div id="no-stocks-msg"></div>
                <div className="disclaimer text-muted">
                    <p><em>*Using free version on API, amount of stocks displayed may vary</em></p>
                </div>
            </div>
        )
    }
}

export default Portfolio;