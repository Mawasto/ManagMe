import React, { useState } from 'react';
import { authApi } from '../api/authApi';

const LoginForm: React.FC<{ onLogin: (token: string, refreshToken: string) => void }> = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await authApi.login(login, password);
    if (res.error) {
      setError(res.error);
    } else {
      onLogin(res.token || '', res.refreshToken || '');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '2rem auto', background: '#222', color: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Logowanie</h2>
      <div>
        <label>Login:</label>
        <input value={login} onChange={e => setLogin(e.target.value)} required />
      </div>
      <div>
        <label>Hasło:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      {error && <div style={{ color: 'red', margin: '8px 0' }}>{error}</div>}
      <button type="submit">Zaloguj</button>
    </form>
  );
};

export default LoginForm;
