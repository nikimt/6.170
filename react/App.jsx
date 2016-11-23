import Services from '../services';
import NavBar from './Elements/Navbar.jsx';
import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';
import ideaServices from '../services/ideaServices';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            ideas : [{
                content : "I'm a test idea hardcoded in App.jsx, don't mind me."
            }]
        };
        this.updateIdeas = this.updateIdeas.bind(this);
        this.addIdea = this.addIdea.bind(this);
        this.fetchAllIdeas = this.fetchAllIdeas.bind(this);
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

    updateIdeas(request){
        request.then((response) => {
            this.setState({
                ideas : response.content.ideas
            })
        }).catch((err) => {
            alert("There was an error updating ideas: ", err);
        })
    }

    addIdea(idea){
      this.setState((prevState) => {
        prevState.ideas.unshift(idea);
        return prevState;
      });
    }

    fetchAllIdeas(boardID){
        ideaServices.getIdeasByBoard(boardID).then((resp) => {
            this.setState((prevState) => {
                prevState.ideas = resp.content.ideas;
                return prevState;
            });
        });
    }

    render(){
        return (
            <div id='reactRoot'>
                <div id='page-content'>
                    {React.cloneElement(this.props.children, {
                        services : Services,
                        ideas : this.state.ideas,
                        updateIdeas : this.updateIdeas,
                        addIdea: this.addIdea,
                        fetchAllIdeas: this.fetchAllIdeas
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