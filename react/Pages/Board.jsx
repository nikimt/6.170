import { Component } from 'react';
import React from 'react';
// import { IndexLink, Link, withRouter } from 'react-router';

export default class Board extends Component {
    constructor(props){
        super(props);
    }

    render(){
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

            <div class="ui text container board-ideas">
                { this.props.ideas.map((idea) => { return <Idea idea={idea}/>})}
            </div>
        )
    }
}

Board.propTypes = {
    ideas : React.PropTypes.arrayOf(React.PropTypes.shape({
        content: React.PropTypes.string.isRequired,
    })).isRequired
};
