import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="notFound">
            <h1><span className="red">404!</span> <br />Page Not Found</h1>
            <h3>Your money is not here...</h3>
            <Link to="/"><h3>Go Back</h3></Link>
        </div>
    )
}

export default NotFound;