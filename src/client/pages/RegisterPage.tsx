import React from "react";
import axios, {AxiosError} from "axios";

const registerUser = async (formData) => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  const data = await response.json();
  return data;
}
