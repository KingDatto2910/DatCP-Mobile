import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../shared/baseUrl";

// leaders
export const fetchLeaders = () => (dispatch) => {
  dispatch(leadersLoading());
  return fetch(baseUrl + "leaders")
    .then((response) => {
      if (!response.ok)
        throw Error("Error " + response.status + ": " + response.statusText);
      else return response.json();
    })
    .then((leaders) => dispatch(addLeaders(leaders)))
    .catch((error) => dispatch(leadersFailed(error.message)));
};
const leadersLoading = () => ({
  type: ActionTypes.LEADERS_LOADING,
});
const leadersFailed = (errmess) => ({
  type: ActionTypes.LEADERS_FAILED,
  payload: errmess,
});
const addLeaders = (leaders) => ({
  type: ActionTypes.ADD_LEADERS,
  payload: leaders,
});
