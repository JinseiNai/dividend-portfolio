import React from 'react';
import cash from '../images/cash.jpg';

const DisplayPage = () => {
    return (
        <div className="display">
            <img src={cash} alt="cash" />
            <div className="display-text container">
                <h3>Track Your Dividends</h3>
                <ol className="track-steps">
                    <li>Create account</li>
                    <li>Add stocks to portfolio</li>
                    <li>View portfolio</li>
                </ol>
                <h5>Don't Own Stocks?</h5>
                <p>Start Today, get <b>1 FREE</b> stock!</p>
                <p>Free brokerage account with <a href="https://join.robinhood.com/calvinw313" target="_blank" rel="noopener noreferrer"><span className="robinhood">Robinhood</span></a></p>
            </div>
        </div>
    )
}

export default DisplayPage;