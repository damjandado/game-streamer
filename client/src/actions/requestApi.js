import axios from 'axios';
import twitchAPI from '../config/keys';
import fetchRequest from './fetchRequest';
import fetchSuccess from './fetchSuccess';
import fetchFailure from './fetchFailure';

const requestApi = function () {
  return (dispatch) => {
    //API request
    axios.get(`https://api.twitch.tv/kraken/streams/featured?&client_id=${twitchAPI}`)
      .then(response => {
        const streams = response.data.featured.map(function(feat) {
          return feat.stream;
        });
        //dispatch FetchSuccess, order 2
        dispatch(fetchSuccess(streams))
      })
      .catch(e => {
        //dispatch FetchFailure, order 3
        dispatch(fetchFailure(e))
      });

    //dispatch FetchRequest, order 1
    dispatch(fetchRequest())
  }
}

export default requestApi
