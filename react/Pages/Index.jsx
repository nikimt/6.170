import { Component, PropTypes } from 'react';
import React from 'react';
// import TweetFeed from '../Elements/TweetFeed.jsx';
// import TweetForm from '../Elements/TweetForm.jsx';


class Global extends Component {
    constructor(props){
        super(props);
        this.defaultProps = {
            tweets : []
        }
        this.deleteTweet = this.deleteTweetFeed.bind(this);
    }

    componentWillMount(){
        // Call the "fetchAllTweets" service to update
        // this.props.tweets with fresh data
        var request = this.props.services.tweet.getAllTweets();
        this.props.updateTweets(request);
    }

    deleteTweetFeed(tweet_id){
      tweetServices.deleteTweetFeed(tweet_id).then((resp) => {
          this.props.fetchAllTweets(false);
      });
    }

    render(){
        return (
            <div className='container'>
                <div className='col-md-3' id='namebox'>
                    <h1>Global Tweets</h1>
                </div>
                <div className='col-md-6'>
                    <TweetForm onSubmit={this.props.addTweet}/>
                    <TweetFeed tweets={this.props.tweets} deleteTweet={this.deleteTweet} />
                </div>
            </div>
        )
    }
}

Global.propTypes = {
    tweets : PropTypes.arrayOf(React.PropTypes.shape({
        creator : PropTypes.string.isRequired,
        content : PropTypes.string.isRequired,
        date : PropTypes.any.isRequired
    }))
};

export default Global;