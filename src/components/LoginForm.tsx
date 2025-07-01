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
    <div className="login-bg min-vh-100 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', width: '100vw' }}>
      <div className="w-100" style={{ maxWidth: 400 }}>
        <h1 className="mb-4 fw-bold text-center login-title">ManagMe</h1>
        <form onSubmit={handleSubmit} className="card shadow p-4" style={{ background: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}>
          <h2 className="mb-3 text-center">Logowanie</h2>
          <div className="mb-2">
            <label className="form-label mb-1">Login:</label>
            <input className="form-control" value={login} onChange={e => setLogin(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label className="form-label mb-1">Hasło:</label>
            <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger my-2 p-2 text-center">{error}</div>}
          <button className="btn btn-primary w-100 mt-2" type="submit">Zaloguj</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
