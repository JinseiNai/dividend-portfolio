import React from 'react';
import { Link } from 'react-router-dom';

class LogoutBtn extends React.Component {
    handleLogout = (e) => {
        e.preventDefault();
        this.props.onLogout();
    }
    render() {
        return(
           <Link to="/" className="nav-btn" onClick={this.handleLogout}>Logout</Link>
        )
    }
}

export default LogoutBtn;