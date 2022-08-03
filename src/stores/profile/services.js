import axios from "axios";
import { API_URL } from "../../config";
export function _fethProfile(token) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}profile/`, {
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