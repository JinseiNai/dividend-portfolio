import React from 'react';
import firebase from '../firebase';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }
    // Login Authentication
    onLogin = (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(error => console.error(error));
    }
    handleLogin = (e) => {
        e.preventDefault();
        this.onLogin(this.state.email, this.state.password);
        document.getElementById("login_email").value = '';
        document.getElementById("login_password").value = '';
    }
    render() {
        return(
            <form className="login-form" onSubmit={this.handleLogin}>
                <h3>Log In</h3>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" id="login_email" onChange={e => this.setState({ email: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" id="login_password" onChange={e => this.setState({ password: e.target.value })} />
                </div>
                <button type="submit" disabled={ !this.state.email && !this.state.password }>Login</button>
            </form>
        )
    }
}

export default Login;