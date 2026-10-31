/*  LOGIN PAGE*/


export function LoginPage({ error, loading, onSubmit, onRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ email: email.trim(), password });
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Sign In</h1>
        <p className="subtitle">Welcome back! Please login to your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={30}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="error-text" role="alert">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Please wait…" : "Sign In"}
          </button>
        </form>

        <div className="signup-option">
          <span>Don't have an account?</span>
          <button type="button" onClick={onRegister}>Sign Up</button>
        </div>

        <button className="back-btn" type="button" onClick={onBack}>
          ← Back to chat
        </button>
      </div>
    </div>
  );
}

/*REGISTER PAGE*/


export function RegisterPage({ error, loading, onSubmit, onLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name: name.trim(), email: email.trim(), password });
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up to get started.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="reg-name">Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              maxLength={40}
              autoComplete="name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={30}
              autoComplete="new-password"
              required
            />
          </div>

          <small className="password-hint">
            Use 8–30 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
          </small>

          {error && <p className="error-text" role="alert">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Please wait…" : "Sign Up"}
          </button>
        </form>

        <div className="signup-option">
          <span>Already have an account?</span>
          <button type="button" onClick={onLogin}>Sign In</button>
        </div>

        <button className="back-btn" type="button" onClick={onBack}>
          ← Back to chat
        </button>
      </div>
    </div>
  );
}
