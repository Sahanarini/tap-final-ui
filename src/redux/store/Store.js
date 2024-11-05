import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import axios from 'axios';

// Initial state
const initialState = {
  approvers: [],
  workflows: [], // Add workflows array to the state
  loading: true,
  error: null,
};

// Action types
const FETCH_APPROVERS_SUCCESS = 'FETCH_APPROVERS_SUCCESS';
const FETCH_APPROVERS_ERROR = 'FETCH_APPROVERS_ERROR';
const FETCH_WORKFLOWS_SUCCESS = 'FETCH_WORKFLOWS_SUCCESS';
const FETCH_WORKFLOWS_ERROR = 'FETCH_WORKFLOWS_ERROR';

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APPROVERS_SUCCESS:
      return {
        ...state,
        approvers: action.payload,
        loading: false,
      };
    case FETCH_APPROVERS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case FETCH_WORKFLOWS_SUCCESS:
      return {
        ...state,
        workflows: action.payload, // Add workflow data to state
        loading: false,
      };
    case FETCH_WORKFLOWS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Async action creator for fetching approvers
const fetchApprovers = () => {
  return (dispatch) => {
    axios.get('http://localhost:4000/approvers') // Update with your JSON server URL
      .then(response => {
        dispatch({ type: FETCH_APPROVERS_SUCCESS, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: FETCH_APPROVERS_ERROR, payload: error.message });
      });
  };
};

// Async action creator for fetching workflows
const fetchWorkflows = () => {
  return (dispatch) => {
    axios.get('http://localhost:4000/workflow') // Update with your JSON server URL
      .then(response => {
        dispatch({ type: FETCH_WORKFLOWS_SUCCESS, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: FETCH_WORKFLOWS_ERROR, payload: error.message });
      });
  };
};

// Create store with thunk middleware
const store = createStore(reducer, applyMiddleware(thunk));

// Export actions
export { fetchApprovers, fetchWorkflows };
export default store;