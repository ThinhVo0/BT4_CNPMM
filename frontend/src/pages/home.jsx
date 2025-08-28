import React, { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context.jsx';

const Home = () => {
  const { user } = useContext(AuthContext);
  return <h1>Welcome, {user?.name}</h1>;
};

export default Home;