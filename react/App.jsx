import Services from '../services';
import NavBar from './Elements/Navbar.jsx';
import { Component } from 'react';
import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';
import tweetServices from '../services/tweetServices';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            user : undefined,
            tweets : [{
                creator : 'test',
                content : "I'm a test tweet hardcoded in App.jsx, don't mind me.",
                date : moment()
            }]
        };
        this.updateTweets = this.updateTweets.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.logout = this.logout.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.addTweet = this.addTweet.bind(this);
        this.fetchAllTweets = this.fetchAllTweets.bind(this);
    }

    componentWillMount(){
        Services.user.getCurrentUser()
            .then((res) => {
                if (res.content.loggedIn) {
                    this.setState((prevState) => {
                        prevState.user = res.content.user;
                        return prevState;
                    })
                }
            });
    }

    updateTweets(request){
        request.then((response) => {
            this.setState({
                tweets : response.content.tweets
            })
        }).catch((err) => {
            alert("There was an error updating tweets: ", err);
        })
    }

    addTweet(tweet){
      this.setState((prevState) => {
        prevState.tweets.unshift(tweet);
        return prevState;
      });
    }

    fetchAllTweets(username){
      if(username){
        tweetServices.getTweetsByUser(this.state.user).then((resp) => {
          this.setState((prevState) => {
            prevState.tweets = resp.content.tweets;
            return prevState;
          });
        });
      } else {
        tweetServices.getAllTweets().then((resp) => {
          this.setState((prevState) => {
            prevState.tweets = resp.content.tweets;
            return prevState;
          });
        });
      }
    }

    loginUser(username, password){
        Services.user.login(username, password)
            .then((res) => {
                if (res.success){
                    this.setState((prevState) => {
                        prevState.user = res.content.user;
                        return prevState;
                    });
                    this.props.router.push('/');
                }
            }).catch((err) => {
                console.log("Login err: ", err.error.err);
            });
    }

    logout(){
        Services.user.logout().then((res) => {
            if (res.success){
                this.setState((prevState) => {
                    prevState.user = 'Not Logged In';
                    return prevState;
                });
                this.props.router.push('/signin');
            }
        });
    }

    registerUser(username, password){
        Services.user.register(username, password).then((res) => {
            if (res.success){
                this.loginUser(username, password);
            } else {
                console.log("Error on register user: ",res.err)
            }
        });
    }

    render(){
        return (
            <div id='reactRoot'>
                <NavBar
                    currentUser={this.state.user}
                    logout={this.logout}
                    services ={Services}
                    />
                <div id='page-content'>
                    {React.cloneElement(this.props.children, {
                        services : Services,
                        user : this.state.user,
                        tweets : this.state.tweets,
                        updateTweets : this.updateTweets,
                        loginUser : this.loginUser,
                        registerUser : this.registerUser,
                        addTweet: this.addTweet,
                        fetchAllTweets: this.fetchAllTweets,
                    })}
                </div>
            </div>
        );
    }
};

App.propTypes = {
    children : React.PropTypes.any.isRequired
};

export default withRouter(App);