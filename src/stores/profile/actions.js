import {
  PROFILE_LOADING,
  PROFILE_SET_PROFILE,
} from "./constants";
import { _fethProfile } from "./services";
import {loginRemoveToken} from "../auth/actions";

export function profileSetLoading(loading) {
  return {
    type: PROFILE_LOADING,
    payload: loading,
  };
}
export function profileSetData(params) {
  return {
    type: PROFILE_SET_PROFILE,
    payload: params,
  };
}
export const fethProfile = () => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(profileSetLoading(true));
		_fethProfile(token).then(async (res) => {
			if(res.profile){
				await dispatch(profileSetData(res.profile));
			}
			resolve(res)
		}).catch((err) => {
			if(err?.response?.status === 401){
                dispatch(loginRemoveToken());
            }
			reject(err)
		}).finally(() => {
			dispatch(profileSetLoading(false));
		})
	})
};