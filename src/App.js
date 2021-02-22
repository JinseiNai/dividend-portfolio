import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
// import './App.css';
import './css/main.css';
import firebase from './firebase';
import Header from './components/header';
import Login from './components/login';
import SignUp from './components/signup';
import LogoutBtn from './components/buttons/logout_btn';
import LoginBtn from './components/buttons/login_btn';
import SignupBtn from './components/buttons/signup_btn';
import PortfolioBtn from './components/buttons/portfolioBtn';
import HomeBtn from './components/buttons/homeBtn';
import DisplayBtn from './components/buttons/displayBtn';
import Home from './components/home';
import DisplayPage from './components/displaypage';
import Portfolio from './components/portfolio';
import Stock from './components/stock';
import Footer from './components/footer';
import NotFound from './components/notfound';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      uid: '',
      displayName: ''
    };
  }
  // On render, check authorize
  componentDidMount = () => {
    this.authListener();
  }
  // listen to state of user
  authListener = () => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({ user: user, uid: user.uid, displayName: user.displayName });
      } else {
        this.setState({ user: null });
      }
    })
  }
  // Logout function
  onLogout = () => {
    firebase.auth().signOut().catch(error => console.error(error));
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="card-header">
            <div className="container">
              <Header/>
              <nav>
                <ul className="nav-list">
                  {this.state.user ? 
                    (<>
                      <li className="nav-item"><HomeBtn /></li>
                      <li className="nav-item"><PortfolioBtn /></li>
                      <li className="nav-item"><LogoutBtn onLogout={this.onLogout}/></li>
                    </>) : 
                    (<>
                      <li className="nav-item"><DisplayBtn /></li>
                      <li className="nav-item"><LoginBtn /></li>
                      <li className="nav-item"><SignupBtn /></li>
                    </>)}
                </ul>
              </nav>
            </div>
          </header>
          <div className="card-body container">
            <Switch>
                <Route exact path="/" component={DisplayPage} />
                <Route path="/home" render={() => 
                (this.state.user ? (<Home user={this.state.displayName}/>) : (<Redirect to="/login" />))} />
                <Route path="/login" render={() => 
                (!this.state.user ? (<Login />) : (<Redirect to="/home" />))} />
                <Route path="/signup" render={() => 
                (this.state.user ? (<Redirect to="/home" />) : <SignUp />)} />
                <Route path="/portfolio" render={() => 
                (this.state.user ? (<Portfolio />) : (<Redirect to="/login" />))} />
                <Route path="/stock" render={() => 
                (this.state.user ? (<Stock />) : (<Redirect to="/login" />))} />
                <Route component={NotFound} />
            </Switch>
          </div>
        </div>
        <footer className="card-footer text-muted align-items-end">
          <Footer />
        </footer>
      </Router>
    )
  }
}

export default App;
