import React from 'react';
import graph from '../images/graph.jpeg';

const Home = (props) => {
    return (
        <div className="home">
            <h3>Welcome {props.user}</h3>
            <img src={graph} alt="stock graph" />
            <h6>Watch your money compound and grow!</h6>
        </div>
    )
}

export default Home;