import { Component } from 'react';
import React from 'react';

export default class Board extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
            <div className="ui menu secondary pointing inverted fixed top sticky main-header">

                <img className="logo" src="../images/logo long.jpg"></img>
                <a className="toc item">
                    <i className="sidebar icon"></i>
                </a>
                <div className="right menu">
                    <a className="item">code00</a>
                </div>
            </div>

            <div className="ui text container board-ideas">
                { this.props.ideas.map((idea) => { return <Idea idea={idea}/>})}
            </div>

            <div className="circular ui icon button add-button float right">
                <i class="icon plus"></i>
            </div>
            </div>
        )
    }
}

Board.propTypes = {
    ideas : React.PropTypes.arrayOf(React.PropTypes.shape({
        content: React.PropTypes.string.isRequired,
    })).isRequired
};
