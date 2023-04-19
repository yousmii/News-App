import axios from "axios";

const handleLogout = () => {
  axios.get('/api/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    console.log(response);
    window.location.reload();
  })
  .catch((error) => {
    console.log(error);
  });
};

export default handleLogout;