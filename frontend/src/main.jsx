import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./style.css";

const API = "http://localhost:8080/api";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [form, setForm] = useState({
    title: "", description: "", category: "INFRASTRUCTURE",
    location: "", priority: "MEDIUM", anonymous: true,
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  async function loadIncidents() {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/incidents`);
      setIncidents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load incidents. Check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadIncidents(); }, []);

  async function submitIncident(event) {
    event.preventDefault();
    setError(""); setMessage("");
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
      };
      await axios.post(`${API}/incidents`, payload);
      setMessage("Incident submitted successfully!");
      setForm({ title: "", description: "", category: "INFRASTRUCTURE", location: "", priority: "MEDIUM", anonymous: true });
      await loadIncidents();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Incident submission failed. Please try again.");
    } finally { setSubmitting(false); }
  }

  async function handleLogin(event) {
    event.preventDefault(); setError(""); setMessage("");
    try {
      const response = await axios.post(`${API}/auth/login`, {
        email: loginForm.email.trim(), password: loginForm.password,
      });
      const user = { userId: response.data.userId, name: response.data.name, role: response.data.role };
      setLoggedInUser(user); setShowLogin(false); setLoginForm({ email: "", password: "" });
      setMessage(`Welcome, ${user.name}! Login successful.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Check your email and password.");
    }
  }

  async function handleRegister(event) {
    event.preventDefault(); setError(""); setMessage("");
    try {
      const response = await axios.post(`${API}/auth/register`, {
        name: registerForm.name.trim(), email: registerForm.email.trim(),
        password: registerForm.password, role: "STUDENT",
      });
      setMessage(response.data?.message || "Registration successful! Please log in.");
      setShowRegister(false); setShowLogin(true);
      setLoginForm({ email: registerForm.email.trim(), password: "" });
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  function handleLogout() {
    setLoggedInUser(null); setMessage("You have been logged out."); setError("");
  }

  async function updateStatus(id, value) {
    setError(""); setMessage("");
    try {
      await axios.put(`${API}/incidents/${id}/status`, null, { params: { value } });
      setMessage(`Incident #${id} status updated to ${value}.`);
      await loadIncidents();
    } catch (err) {
      console.error(err); setError(err.response?.data?.message || "Status update failed.");
    }
  }

  async function assignTeam(id, team) {
    if (!team) return;
    setError(""); setMessage("");
    try {
      await axios.put(`${API}/incidents/${id}/assign`, null, { params: { team } });
      setMessage(`Incident #${id} assigned to ${team}.`);
      await loadIncidents();
    } catch (err) {
      console.error(err); setError(err.response?.data?.message || "Team assignment failed.");
    }
  }

  const total = incidents.length;
  const inProgress = incidents.filter((item) => item.status === "IN_PROGRESS").length;
  const resolved = incidents.filter((item) => item.status === "RESOLVED").length;
  const assigned = incidents.filter((item) => item.assignedTeam && item.assignedTeam.trim() !== "").length;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand"><span className="shield">♡</span><span>SafeCampus</span></div>
        <span className="tagline">Report · Respond · Resolve</span>
        <div className="user-actions">
          {loggedInUser ? <><span className="user-name">Hi, {loggedInUser.name}</span><button type="button" className="login-button" onClick={handleLogout}>Logout</button></> : <>
            <button type="button" className="login-button" onClick={() => { setShowLogin(true); setShowRegister(false); setError(""); setMessage(""); }}>Login</button>
            <button type="button" className="login-button" onClick={() => { setShowRegister(true); setShowLogin(false); setError(""); setMessage(""); }}>Register</button>
          </>}
        </div>
      </header>

      <main className="container">
        <section className="hero"><h1>A Safer Campus Starts With You</h1><p>Report safety concerns and help your campus respond faster.</p></section>
        {message && <div className="success-message" role="status">{message}</div>}
        {error && <div className="error-message" role="alert">{error}</div>}

        <section className="panel">
          <h2>Report an Incident</h2>
          <form onSubmit={submitIncident} className="incident-form">
            <label htmlFor="title">Incident title</label>
            <input id="title" type="text" placeholder="Enter incident title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <label htmlFor="description">Description</label>
            <textarea id="description" placeholder="Describe the incident" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="MEDICAL">Medical</option><option value="INFRASTRUCTURE">Infrastructure</option><option value="ELECTRICAL">Electrical</option><option value="SECURITY">Security</option><option value="OTHER">Other</option>
            </select>
            <label htmlFor="location">Location</label>
            <input id="location" type="text" placeholder="Enter campus location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select>
            <label className="checkbox-label"><input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} /> Anonymous report</label>
            <button className="submit-button" type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Incident"}</button>
          </form>
        </section>

        <section className="dashboard">
          <h2>Admin Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card"><strong>{total}</strong><span>Total</span></div>
            <div className="stat-card"><strong>{assigned}</strong><span>Assigned</span></div>
            <div className="stat-card"><strong>{inProgress}</strong><span>In Progress</span></div>
            <div className="stat-card"><strong>{resolved}</strong><span>Resolved</span></div>
          </div>
          <div className="incidents-heading"><h3>Recent Incidents</h3><button type="button" className="refresh-button" onClick={loadIncidents}>Refresh</button></div>
          {loading && <p>Loading incidents...</p>}
          {!loading && incidents.length === 0 && !error && <p>No incidents reported yet.</p>}
          <div className="incident-list">
            {incidents.slice().reverse().map((incident) => <article className="incident-card" key={incident.id}>
              <h4>{incident.title}</h4><p className="incident-meta">{incident.category} · {incident.priority}</p>
              <p className="incident-details">{incident.location} · {incident.status}</p>
              <p className="incident-team">Team: {incident.assignedTeam || "Not assigned"}</p>
              {incident.description && <p>{incident.description}</p>}
              <div className="admin-controls"><label>Status<select value={incident.status || "RECEIVED"} onChange={(e) => updateStatus(incident.id, e.target.value)}><option value="RECEIVED">Received</option><option value="IN_PROGRESS">In Progress</option><option value="RESOLVED">Resolved</option></select></label>
                <label>Assign team<select value={incident.assignedTeam || ""} onChange={(e) => assignTeam(incident.id, e.target.value)}><option value="">Select team</option><option value="Maintenance Team">Maintenance Team</option><option value="Campus Medical Team">Campus Medical Team</option><option value="Security Team">Security Team</option></select></label></div>
            </article>)}
          </div>
        </section>
      </main>

      {showLogin && <div className="modal-backdrop" onClick={() => setShowLogin(false)}><section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-button" onClick={() => setShowLogin(false)} aria-label="Close login">×</button><h2 id="login-title">Login to SafeCampus</h2>
        <form onSubmit={handleLogin} className="incident-form"><label htmlFor="login-email">Email</label><input id="login-email" type="email" placeholder="Enter your email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
          <label htmlFor="login-password">Password</label><input id="login-password" type="password" placeholder="Enter your password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
          <button className="submit-button" type="submit">Login</button></form>
        <p className="login-note">Sign in with your registered email and password.</p><p>Don't have an account? <button type="button" onClick={() => { setShowLogin(false); setShowRegister(true); setError(""); }}>Register</button></p>
      </section></div>}

      {showRegister && <div className="modal-backdrop" onClick={() => setShowRegister(false)}><section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="register-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-button" onClick={() => setShowRegister(false)} aria-label="Close registration">×</button><h2 id="register-title">Create SafeCampus Account</h2>
        <form onSubmit={handleRegister} className="incident-form"><label htmlFor="register-name">Full name</label><input id="register-name" type="text" placeholder="Enter your name" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required />
          <label htmlFor="register-email">Email</label><input id="register-email" type="email" placeholder="Enter your email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
          <label htmlFor="register-password">Password</label><input id="register-password" type="password" minLength={6} placeholder="Create a password (at least 6 characters)" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
          <button className="submit-button" type="submit">Register</button></form>
        <p>Already registered? <button type="button" onClick={() => { setShowRegister(false); setShowLogin(true); setError(""); }}>Login</button></p>
      </section></div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);