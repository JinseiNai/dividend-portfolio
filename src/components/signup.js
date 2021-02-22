import React from 'react';
import firebase from '../firebase';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            displayName: '',
            uid: ''
        };
    }
    // Sign up function
    onSignup = (email,password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            this.setState({uid: firebase.auth().currentUser.uid});
            this.newDisplayName();
            this.newUserPortfolio();
            console.log(this.state.displayName, this.state.uid)
        }).catch(error => console.error(error));
    }

    // Create user display name
    newDisplayName = () => {
        firebase.auth().currentUser.updateProfile({
            displayName: this.state.displayName
        })
    }

    // Firestore database
    newUserPortfolio = () => {
        const db = firebase.firestore();
        db.collection('users').doc(this.state.uid).set({
            userId: this.state.uid,
            displayName: this.state.displayName,
            email: this.state.email
        })
    }

    handleSignup = (e) => {
        e.preventDefault();
        this.onSignup(this.state.email, this.state.password);
    }

    render() {
        return (
            <form className="signup-form" onSubmit={this.handleSignup}>
                <h3>Sign Up</h3>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" onChange={e => this.setState({displayName: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" onChange={e => this.setState({ email: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" onChange={e => this.setState({ password: e.target.value })} required />
                </div>
                <button type="submit" disabled={ !this.state.email && !this.state.password }>Sign Up</button>
            </form>
        )
    }
}

export default SignUp;