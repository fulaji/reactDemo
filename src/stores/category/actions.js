import { _getCategory, _deleteCategory } from "./services";
import { 
	CATEGORY_SET_DATA
} from "./constants";
export function categorySetData(data) {
	return {
		type: CATEGORY_SET_DATA,
		payload: data
	};
}

export const getCategory = () => (dispatch) => {
	return new Promise((resolve, reject) => {
		_getCategory().then(async (res) => {
            dispatch(categorySetData(res.data));
			resolve(res)
		}).catch((err) => {
			reject(err)
		}).finally(() => {
		})
	})
};


export const deleteCategory = (id) => (dispatch) => {
	return new Promise((resolve, reject) => {
		_deleteCategory(id).then(async (res) => {
			dispatch(getCategory());
			resolve(res)
		}).catch((err) => {
			reject(err)
		}).finally(() => {
		})
	})
}