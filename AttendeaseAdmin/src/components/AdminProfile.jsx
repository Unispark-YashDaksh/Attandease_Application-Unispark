import { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import "../css/AdminProfile.css";

const apiUrl = import.meta.env.VITE_API;

/* ─────────────────────────────────────────────────────
 * AdminProfile — view and edit admin profile
 *
 * Fields:
 *   - Profile photo (placeholder for upload)
 *   - Full name, email, phone, employee code, role, department
 *
 * Logic:
 *   1. On mount → fetch admin data from GET /api/admin/profile
 *   2. Editable fields with inline edit
 *   3. Save → PUT /api/admin/profile → show loading/success/error
 * ───────────────────────────────────────────────────── */
export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    employee_code: "",
    role: "",
    department: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch admin profile on mount
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiUrl}/admin/profile`);
      const data = response.data.profile || response.data;
      setProfile(data);
      setOriginalProfile(data);
    } catch (err) {
      // If API doesn't exist yet, use default placeholder
      if (err.response?.status === 404) {
        const defaults = {
          id: 1,
          name: "Admin User",
          email: "admin@sparkhrms.com",
          phone: "+91 9876543210",
          employee_code: "EMP001",
          role: "Super Admin",
          department: "Engineering",
        };
        setProfile(defaults);
        setOriginalProfile(defaults);
      } else {
        setError(err.response?.data?.error || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await axios.put(`${apiUrl}/admin/profile`, profile);
      setSuccess("Profile updated successfully");
      setOriginalProfile(profile);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel / reset
  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setError("");
    setSuccess("");
  };

  const hasChanges =
    JSON.stringify(profile) !== JSON.stringify(originalProfile);

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      {saving && <LoadingSpinner message="Saving profile..." />}

      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/screen.svg" className="animate-spin" alt="Avatar" />
        </div>
        <div className="profile-title">
          <h1>{profile.name || "Admin"}</h1>
          <span className="profile-badge">{profile.role || "Administrator"}</span>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="profile-card" onSubmit={handleSave}>
        <h2>Personal Information</h2>

        <div className="profile-form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Employee Code</label>
            <input
              type="text"
              className="form-control"
              value={profile.employee_code}
              disabled
              style={{ background: "#f5f5f5", cursor: "not-allowed" }}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              className="form-control"
              value={profile.role}
              onChange={handleChange}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              className="form-control"
              value={profile.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>

        <div className="profile-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleCancel}
            disabled={!hasChanges || saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!hasChanges || saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
