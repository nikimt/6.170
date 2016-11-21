import { Component } from 'react';
import React from 'react';
import { IndexLink, Link, withRouter } from 'react-router';

class NavBar extends Component {
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
            <nav className='navbar navbar-default navbar-fixed-top' id='main-navbar'>
                <div className='container'>
                    <div className='navbar-header'>
                        <IndexLink to='/' className='navbar-brand'>Fritter</IndexLink>
                    </div>
                    <form className='navbar-form navbar-right'>
                        <div className='input-group'>
                            <input type='text'
                                   className='form-control'
                                   placeholder='Find User'
                                   value={this.state.userSearchText}
                                   onChange={this.updateSearchText} />
                            <div className='input-group-btn'>
                                <button className='btn btn-default'
                                        type='button'
                                        onClick={()=>{this.findUser(this.state.userSearchText);}}>
                                    <i className='glyphicon glyphicon-search' />
                                </button>
                            </div>
                        </div>
                    </form>
                    <ul className='nav navbar-nav navbar-right'>
                        <li>
                            <Link to='/users'><i className="glyphicon glyphicon-globe" /></Link>
                        </li>
                        { currentUserItem }
                        { logoutItem }
                    </ul>
                </div>
            </nav>
        )
    }
}

NavBar.propTypes = {
    currentUser : React.PropTypes.any,
    logoutCallback : React.PropTypes.func,
    findUserCallback : React.PropTypes.func
};

export default withRouter(NavBar);