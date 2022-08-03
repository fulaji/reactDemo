import axios from "axios";
import { API_URL } from "../../config";
export function _fetchAllUsers(token) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}users/`, {
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
export function _createUser(formData, token) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}users/create`, formData, {
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
export function _fetchUsers(params, token) {
  return new Promise((resolve, reject) => {
    let u = new URLSearchParams(params).toString();
    axios
      .get(`${API_URL}users/all?${u}`, {
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
export function _searchUsers(searchKey, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}users/search?search_key=${searchKey}`, {
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
export function _fetchUserDetails(userid, token) {
  return new Promise((resolve, reject) => {
    axios
    .get(`${API_URL}users/details?id=${userid}`, {
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
export function _editUser(formData, token) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}users/edit`, formData, {
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