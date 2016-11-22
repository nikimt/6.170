import { Component } from 'react';
import React from 'react';
import { IndexLink, Link, withRouter } from 'react-router';

class Board extends Component {
    constructor(props){
        super(props);
        this.updateSearchText = this.updateSearchText.bind(this);
        this.state = {
            userSearchText : ''
        };
        this.defaultProps = {
            currentUser : 'Not Logged In'
        };
        this.findUser = this.findUser.bind(this);
    }

    updateSearchText(event){
        this.setState({
            userSearchText : event.target.value
        })
    }

    findUser(){
        this.props.router.push(`/users/${this.state.userSearchText}`);
        this.setState({
            userSearchText : ''
        });
    }

    render(){
        var currentUserItem = this.props.currentUser === undefined ? null : (
            <li>
                <Link to={'/users/'+this.props.currentUser}>{this.props.currentUser}</Link>
            </li>
        );
        var logoutItem = this.props.currentUser === undefined ? null : (
            <li>
                <a onClick={this.props.logout}>Log Out</a>
            </li>
        );
        return (
            <div class="ui menu secondary pointing inverted fixed top sticky main-header">

                <img class="logo" src="../images/logo long.jpg"></img>
                <a class="toc item">
                    <i class="sidebar icon"></i>
                </a>
                <div class="right menu">
                    <a class="item">code00</a>
                </div>
            </div>

            <div class="ui text container">
            </div>
        )
    }
}

Board.propTypes = {
    currentUser : React.PropTypes.any,
    logoutCallback : React.PropTypes.func,
    findUserCallback : React.PropTypes.func
};

export default withRouter(Board);