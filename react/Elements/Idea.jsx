import { Component, PropTypes } from 'react';
import React from 'react';
import ideaServices from '../../services/ideaServices';


export default class Idea extends Component {
    constructor(props){
        super(props);
        this.defaultProps = {
            text : null,
        }
    }

    render(){
        return (
            <div className='idea'>
                
            </div>
        )
    }
}

Idea.propTypes = {
    idea : React.PropTypes.shape({
        content : PropTypes.string.isRequired
    })).isRequired
};
