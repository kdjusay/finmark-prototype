import React from 'react';
import LoginForm from './components/LoginForm';

const wrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#eee',
};

const App = () => {
  const handleLogin = (data) => {
    console.log('Login data:', data);
  };

  return (
    <div style={wrapperStyle}>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default App;
