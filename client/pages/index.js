import axios from "axios";

const Home = ({currentUser}) => {
  console.log(currentUser);
  return <h1>Home Page</h1>
};

Home.getInitialProps = async ({req}) => {

  let requestURL = '/api/users/currentuser';
  
  // if getInitialProps is executing on server
  if (typeof window === 'undefined') {
    console.log('Executing on the server!!!');
    requestURL = `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${requestURL}`;
  }

  const { data } = await axios.get(
    requestURL,
    {
      headers: req.headers,
    }
  );
  console.log('On Server', data);
  return data;
};


export default Home;