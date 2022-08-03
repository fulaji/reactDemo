import { 
	PROPERTIES_LOADING, 
	PROPERTIES_SET_DATA, 
	PROPERTIES_SET_PAGE, 
	PROPERTIES_CHANGE_SORTING_ORDER,
	PROPERTIES_SET_SELECTED_PROPERTIES,
	PROPERTIES_SET_DETAILS,
	PROPERTIES_REMOVE_PROPERTY,
	PROPERTIES_UPDATE_PROPERTY,
	PROPERTIES_SET_LIMIT,
	PROPERTIES_SET_ACTIVITIES,
	PROPERTIES_SET_APPOINTMENT,
	PROPERTIES_REMOVE_APPOINTMENT,
	PROPERTIES_SET_LOCATION_PREDICTION 
} from "./constants";
import { 
	_fetchProperties, 
	_fetchMediaDetail,
	_importProperties, 
	_searchProperties, 
	_fetchPropertyDetails, 
	_fetchPropertyDetail,
	_deleteProperty, 
	_updateProperty, 
	_deleteBulkProperty,
	_createActivity,
	_fetchActivities,
	_deleteActivity ,
	_updateActivity,
	_createAppointment,
	_fetchAppointments,
	_updateAppointment,
	_deleteAppointment,
	_fetchLocationDetails,
	_fetchLocationPredictions,
	_createProperty
} from "./services";

export function propertySetLoading(loading) {
	return {
		type: PROPERTIES_LOADING,
		payload: loading
	};
}
export function propertySetData(params) {
	return {
		type: PROPERTIES_SET_DATA,
		payload: params
	};
}
export function propertySetDetails(data) {
	return {
		type: PROPERTIES_SET_DETAILS,
		payload: data
	};
}
export function propertySetPage(data) {
	return {
		type: PROPERTIES_SET_PAGE,
		payload: data
	};
}
export function propertyChangeSortingOrder(data) {
	return {
		type: PROPERTIES_CHANGE_SORTING_ORDER,
		payload: data
	};
}
export function propertySetSelectedProperties(data) {
	return {
		type: PROPERTIES_SET_SELECTED_PROPERTIES,
		payload: data
	};
}
export function propertyRemoveProperty(id) {
	return {
		type: PROPERTIES_REMOVE_PROPERTY,
		payload: id
	};
}
export function propertyUpdateProperty(data) {
	return {
		type: PROPERTIES_UPDATE_PROPERTY,
		payload: data
	};
}
export const propertySetLimit = (data) => (dispatch, getState) => {
	dispatch({
		type: PROPERTIES_SET_LIMIT,
		payload: data
	});
	dispatch(fetchProperties({limit: data, offset: 0}))
}
export function propertySetActivities(params) {
	return {
		type: PROPERTIES_SET_ACTIVITIES,
		payload: params
	};
}
export function propertySetAppointments(params) {
	return {
		type: PROPERTIES_SET_APPOINTMENT,
		payload: params
	};
}
export function propertyRemoveAppointment(params) {
	return {
		type: PROPERTIES_REMOVE_APPOINTMENT,
		payload: params
	};
}
export const setLocationPredictions = (predictions) => ({
	type: PROPERTIES_SET_LOCATION_PREDICTION,
	payload: predictions,
});
export const fetchProperties = (params) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		const {tableHeaders} = getState().properties;
		let filters = [];
		tableHeaders.map(header =>{
			if(header.sortingOrder === "asc" || header.sortingOrder === "desc"){
				filters.push({field: header.field, order: header.sortingOrder});
			}
		})
		params = {...params, sortingOrders: JSON.stringify(filters)}
		dispatch(propertySetLoading(true));
		_fetchProperties(params, token).then((resp)=>{
			if(Array.isArray(resp.properties)){
				dispatch(propertySetData(resp));
				resolve(resp);
			}else{
				resolve([]);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(propertySetLoading(false));
		})
	})
};
export const importProperties = (formData) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		const {limit, offset} = getState().properties;
		dispatch(propertySetLoading(true));
		_importProperties(formData, token).then((resp)=>{
			dispatch(fetchProperties({limit, offset}));
			resolve(true);
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(propertySetLoading(false));
		})
	})
};
export const searchProperties = (searchKey) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(propertySetLoading(true));
		_searchProperties(searchKey, token).then((resp)=>{
			if(Array.isArray(resp.properties)){
				dispatch(propertySetData(resp));
				resolve(resp);
			}else{
				resolve([]);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(propertySetLoading(false));
		})
	})
};
export const fetchPropertyDetails = (id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(propertySetLoading(true));
		_fetchPropertyDetails(id, token).then((resp)=>{
			if(typeof resp.property === "object"){
				dispatch(propertySetDetails(resp.property));
				resolve(resp.property);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(propertySetLoading(false));
		})
	})
};

export const fetchPropertyDetail = () => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(propertySetLoading(true));
		_fetchPropertyDetail(token).then((resp)=>{
			console.log(resp)
			if(typeof resp.data === "object"){
				dispatch(propertySetDetails(resp.data));
				resolve(resp.data);
			}else{
				resolve(false);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(propertySetLoading(false));
		})
	})
};

export const deleteProperty = (id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_deleteProperty(id, token).then((resp)=>{
			dispatch(propertyRemoveProperty(id));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const updateProperty = (formData, formState) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_updateProperty(formData, token).then((resp)=>{
			dispatch(propertyUpdateProperty(formState));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const deleteBulkProperty = (formData) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_deleteBulkProperty(formData, token).then((resp)=>{
			const {limit, offset} = getState().properties;
			dispatch(fetchProperties({limit, offset}));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const createActivity = (formData, property_id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_createActivity(formData, token).then((resp)=>{
			dispatch(fetchActivities({property_id}));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const fetchActivities = (params) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_fetchActivities(params, token).then((resp)=>{
			if(Array.isArray(resp.activities)){
				dispatch(propertySetActivities(resp.activities));
				resolve(resp);
			}else{
				resolve([]);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const deleteActivity = (id, property_id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_deleteActivity(id, token).then((resp)=>{
			dispatch(fetchActivities({property_id}));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const updateActivity = (formData, property_id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_updateActivity(formData, token).then((resp)=>{
			dispatch(fetchActivities({property_id}));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};

export const createAppointment = (formData, property_id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_createAppointment(formData, token).then((resp)=>{
			dispatch(fetchAppointments({property_id}));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const fetchAppointments = (params) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_fetchAppointments(params, token).then((resp)=>{
			if(Array.isArray(resp.appointments)){
				dispatch(propertySetAppointments(resp.appointments));
				resolve(resp);
			}else{
				resolve([]);
			}
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const updateAppointment = (formData, property_id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_updateAppointment(formData, token).then((resp)=>{
			dispatch(fetchAppointments({property_id}));
			resolve(resp);
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const deleteAppointment = (id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		_deleteAppointment(id, token).then((resp)=>{
			resolve(resp);
			dispatch(propertyRemoveAppointment(id))
		}).catch(err =>{
			console.log(err)
			reject(err);
		})
	})
};
export const fetchLocationDetails = (location) => async (dispatch) => {
	return new Promise((resolve, reject) => {
		_fetchLocationDetails(location)
			.then(async (res) => {
				let state = "",
					city = "",
					postalCode = "",
					country = "",
					streetNumber = "",
					route="";
				if (res.data?.results?.length) {
					for (
						var i = 0;
						i < res.data.results[0].address_components.length;
						i++
					) {
						if (
							res.data.results[0].address_components[i].types.includes(
								"administrative_area_level_1"
							)
						) {
							state = res.data.results[0].address_components[i].short_name;
						} else if (
							res.data.results[0].address_components[i].types.includes(
								"locality"
							)
						) {
							city = res.data.results[0].address_components[i].long_name;
						} else if (
							res.data.results[0].address_components[i].types.includes(
								"route"
							)
						) {
							route = res.data.results[0].address_components[i].long_name;
						} else if (
							res.data.results[0].address_components[i].types.includes(
								"street_number"
							)
						) {
							streetNumber = res.data.results[0].address_components[i].long_name;
						} else if (
							res.data.results[0].address_components[i].types.includes(
								"postal_code"
							)
						) {
							postalCode = res.data.results[0].address_components[i].long_name;
						} else if (
							res.data.results[0].address_components[i].types.includes(
								"country"
							)
						) {
							country = res.data.results[0].address_components[i].long_name;
						}
					}
				}
				resolve({ city, postalCode, state, country, streetNumber, route })
			})
			.catch(async (err) => {
				reject(err)
				console.log(err);
			});
	})
};
export const fetchLocationPredictions = (destination) => async (
	dispatch,
	getState
) => {
	_fetchLocationPredictions(destination)
		.then(async (res) => {
			await dispatch(setLocationPredictions(res.data.predictions));
		})
		.catch(async (err) => { });
};

export const createProperty = (formData) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		const {limit, offset} = getState().properties;
		dispatch(propertySetLoading(true));
		_createProperty(formData, token).then((resp)=>{
			dispatch(fetchProperties({limit, offset}));
			resolve(true);
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(propertySetLoading(false));
		})
	})
};

export const fetchMediaDetail = () => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {token} = getState().auth;
		dispatch(propertySetLoading(true));
		_fetchMediaDetail(token).then((resp)=>{
			resolve(resp.data);
		}).catch(err =>{
			console.log(err)
			reject(err);
		}).finally(()=>{
			dispatch(propertySetLoading(false));
		})
	})
};
