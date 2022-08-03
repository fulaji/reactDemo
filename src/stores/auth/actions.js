import {
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_REMOVE_TOKEN
} from "./constants";
import { loginWithPassword } from "./services";
/* Login actions */
export function loginSetLoading(loading) {
  return {
    type: LOGIN_LOADING,
    payload: loading,
  };
}
export function loginSetToken(params) {
  return {
    type: LOGIN_SUCCESS,
    payload: params,
  };
}
export function loginRemoveToken() {
	return {
	  type: LOGIN_REMOVE_TOKEN,
	};
  }
export const checkLogin = (formData) => (dispatch) => {
	return new Promise((resolve, reject) => {
		dispatch(loginSetLoading(true));
		loginWithPassword(formData).then(async (res) => {
			await dispatch(loginSetToken(res));
			resolve(res)
		}).catch((err) => {
			reject(err)
		}).finally(() => {
			dispatch(loginSetLoading(false));
		})
	})
};
