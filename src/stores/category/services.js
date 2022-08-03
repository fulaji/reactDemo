import axios from "axios";
import { API_URL } from "../../config";
export function _getCategory() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}Message/category`)
      .then(async (response) => {
        //console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function _deleteCategory(id){
  return new Promise((resolve, reject) =>{
    axios.get(`${API_URL}Message/deleteCategory?categoryId=${id}`)
      .then(async (response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      })
  })
}