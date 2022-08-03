import {
  USER_LOADING,
  USER_SET_DATA,
  USER_SET_PAGE,
  USER_SET_LIMIT,
  USER_SET_ALL_USERS,
  USER_SET_DETAILS
} from "./constants";
import { _fetchAllUsers, _createUser, _fetchUsers, _searchUsers, _fetchUserDetails, _editUser } from "./services";
/* Login actions */
export function userSetLoading(loading) {
  return {
    type: USER_LOADING,
    payload: loading,
  };
}
export function userSetAllUsers(params) {
	return {
	  type: USER_SET_ALL_USERS,
	  payload: params,
	};
  }
export function userSetData(params) {
  return {
    type: USER_SET_DATA,
    payload: params,
  };
}
export function userSetPage(data) {
	return {
		type: USER_SET_PAGE,
		payload: data
	};
}
export const userSetLimit = (data) => (dispatch, getState) => {
	dispatch({
		type: USER_SET_LIMIT,
		payload: data
	});
	dispatch(fetchUsers({limit: data, offset: 0}))
}
export function userSetDetails(params) {
	return {
	  type: USER_SET_DETAILS,
	  payload: params,
	};
  }
export const fetchUsers = (params) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(userSetLoading(true));
		_fetchUsers(params, token).then((resp)=>{
			if(Array.isArray(resp.users)){
				dispatch(userSetData(resp));
				resolve(resp);
			}else{
				resolve([]);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(userSetLoading(false));
		})
	})
};

export const fetchAllUsers = () => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(userSetLoading(true));
		_fetchAllUsers(token).then(async (res) => {
			if(Array.isArray(res.users)){
				await dispatch(userSetAllUsers(res.users));
			}
			resolve(res)
		}).catch((err) => {
			reject(err)
		}).finally(() => {
			dispatch(userSetLoading(false));
		})
	})
};
export const createUser = (formData) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(userSetLoading(true));
		_createUser(formData, token).then(async (res) => {
			resolve(res)
		}).catch((err) => {
			reject(err)
		}).finally(() => {
			dispatch(userSetLoading(false));
		})
	})
};
export const searchUsers = (searchKey) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(userSetLoading(true));
		_searchUsers(searchKey, token).then((resp)=>{
			if(Array.isArray(resp.users)){
				dispatch(userSetData(resp));
				resolve(resp);
			}else{
				resolve([]);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(userSetLoading(false));
		})
	})
};
export const fetchUserDetails = (userid) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(userSetLoading(true));
		_fetchUserDetails(userid, token).then((resp)=>{
			dispatch(userSetDetails(resp));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(userSetLoading(false));
		})
	})
};
export const editUser = (formData) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(userSetLoading(true));
		_editUser(formData, token).then((resp)=>{
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(userSetLoading(false));
		})
	})
};