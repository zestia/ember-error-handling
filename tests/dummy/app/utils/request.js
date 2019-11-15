import { AJAXError } from './errors';
import fetch from 'fetch';

export default function request(url) {
  return fetch(url).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      const error = new AJAXError(response.statusText);
      error.status = response.status;

      throw error;
    }
  });
}
