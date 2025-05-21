import React, { useEffect, useState } from "react";
import "../../styles/ManageUsers.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleUpdates, setRoleUpdates] = useState({});
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone_number_1: "", phone_number_2: "" });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch users.");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleRoleChange = (id, role) => {
    setRoleUpdates((prev) => ({ ...prev, [id]: role }));
  };

  const updateRole = async (id) => {
    const newRole = roleUpdates[id];
    if (!newRole) return alert("Please select a role");

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(`Role update failed: ${err.message}`);
    }
  };

  const openEditForm = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone_number_1: user.phone_number_1,
      phone_number_2: user.phone_number_2 || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const roleOptions = ["user", "driver", "medic", "dispatcher", "admin"];

  return (
    <>
    <NavBar/>
    <div className="usermanage_container">
      <h2 className="usermanage_heading">Manage Users</h2>
      <table className="usermanage_table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone 1</th>
            <th>Phone 2</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ _id, name, role, email, phone_number_1, phone_number_2 }) => (
            <tr key={_id}>
              <td>{name}</td>
              <td>{role}</td>
              <td>{email}</td>
              <td>{phone_number_1}</td>
              <td>{phone_number_2}</td>
              <td>
                <select
                  value={roleUpdates[_id] || role}
                  onChange={(e) => handleRoleChange(_id, e.target.value)}
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <button
                  className="usermanage_button usermanage_button-update"
                  onClick={() => updateRole(_id)}
                >
                  Update Role
                </button>
                <button
                  className="usermanage_button usermanage_button-edit"
                  onClick={() => openEditForm({ _id, name, email, phone_number_1, phone_number_2 })}
                >
                  Edit
                </button>
                <button
                  className="usermanage_button usermanage_button-delete"
                  onClick={() => handleDelete(_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div className="usermanage_modal-overlay">
          <div className="usermanage_modal-content">
            <h3>Edit User</h3>
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleEditChange}
              type="text"
            />
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleEditChange}
              type="email"
            />
            <label>Phone 1</label>
            <input
              name="phone_number_1"
              value={formData.phone_number_1}
              onChange={handleEditChange}
              type="text"
            />
            <label>Phone 2</label>
            <input
              name="phone_number_2"
              value={formData.phone_number_2}
              onChange={handleEditChange}
              type="text"
            />
            <div className="usermanage_modal-buttons">
              <button
                className="usermanage_button usermanage_button-update"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="usermanage_button usermanage_button-delete"
                onClick={() => setEditUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default ManageUsers;
