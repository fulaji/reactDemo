import axios from "axios";
import { API_URL } from "../../config";
export function _fetchMessages(params, token) {
  return new Promise((resolve, reject) => {
    let u = new URLSearchParams(params).toString();
    axios
    .get(`${API_URL}campaign/all?${u}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _importMessage(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}properties/create_bulk`, formData, {
      headers:{
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _searchMessage(searchKey, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}properties/search?search_key=${searchKey}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _fetchPropertyDetails(id, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}campaign/details/${id}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _deleteProperty(id, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}campaign/delete?id=${id}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _updateProperty(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}properties/update`, formData, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _deleteBulkProperty(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}properties/delete_bulk`, formData, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _createActivity(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}activities/create`, formData, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _fetchActivities(params, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}campaign/reports/?property_id=${params.property_id}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _deleteActivity(id, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}activities/delete?id=${id}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _updateActivity(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}activities/update`, formData, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _createAppointment(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}appointments/create`, formData, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _fetchAppointments(params, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}appointments?property_id=${params.property_id}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _updateAppointment(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}appointments/update`, formData, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _deleteAppointment(id, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}appointments/delete?id=${id}`, {
      headers:{
        Authorization: token
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
export function _fetchLocationPredictions(destination) {
  return new Promise((resolve, reject) => {
    let url = `https://cors-handle.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyAKXardyjo9LhZ-L2xloIpygAgKuC4l_i0&input=${destination}&types=address`; //components=country:ca&
    axios
      .get(url)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function _fetchLocationDetails(destination) {
  return new Promise((resolve, reject) => {
    let url = `https://cors-handle.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&sensor=true&key=AIzaSyAKXardyjo9LhZ-L2xloIpygAgKuC4l_i0`;
    axios
      .get(url)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function _createProperty(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}properties/create`, formData, {
      headers:{
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function _sendMessage(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}campaign/create`, formData, {
      headers:{
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function _getUserList(formData, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}Properties/FindNumber?query=${formData}`, {
      headers:{
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(async (response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

