import React, { useEffect, useState } from 'react';
import '../../styles/createemployee.css';
import { FaTimes } from "react-icons/fa";
const CreateEmployee = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: '',
    email: '',
    password: '',
    role_id: '',
    team_id: '',
  });

  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hrNames, setHrNames] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [primaryCategory, setPrimaryCategory] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [rolesRes, teamsRes, catsRes, hrNameRes, employeeRes] = await Promise.all([
          fetch('http://localhost:3008/roles', { headers }),
          fetch('http://localhost:3008/teams-name', { headers }),
          fetch('http://localhost:3008/categories', { headers }),
          fetch('http://localhost:3008/hr-names', { headers }),
          fetch('http://localhost:3008/employees', { headers }),
        ]);

        const [rolesData, teamsData, catsData, hrNamesData, employeesData] = await Promise.all([
          rolesRes.json(),
          teamsRes.json(),
          catsRes.json(),
          hrNameRes.json(),
          employeeRes.json()
        ]);

        console.log("rolesData", rolesData);
        setRoles(rolesData.result);
        setHrNames(hrNamesData.result);
        console.log("Hr Names",hrNamesData.result);
        setTeams(teamsData.result);
        setEmployeeData(employeesData.result);
        console.log("teamsData", teamsData);
        setCategories(catsData.result);
        console.log("catsData", catsData);

      } catch (err) {
        console.error('Error loading dropdowns:', err);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    if (primaryCategory === categoryId) {
      setPrimaryCategory(null);
    }
  };

  const handlePrimaryChange = (categoryId) => {
    setPrimaryCategory(categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const categoriesPayload = selectedCategories.map(id => ({
      category_id: id,
      is_primary: id === primaryCategory ? 1 : 0,
    }));

    const payload = {
      ...formData,
      categories: categoriesPayload,
    };

    try {
      const response = await fetch('http://localhost:3008/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Employee created successfully!');
        setShowForm(false);
        setFormData({
          employee_name: '',
          email: '',
          password: '',
          role_id: '',
          team_id: '',
        });
        setSelectedCategories([]);
        setPrimaryCategory(null);
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      alert('Error occurred while submitting the form.');
    }
  };

  return (
    <div className='admin-employee-container'>
      <button className="btn-create" onClick={() => setShowForm(true)}>
        Create Employee
      </button>


      {showForm && (
        <>
          <div className="overlay" onClick={() => setShowForm(false)} />
          <div className="form-container">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <FaTimes />
            </button>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee Name</label>
                  <input
                    type="text"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    required >

                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Team</label>
                  <select
                    name="team_id"
                    value={formData.team_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team.team_id} value={team.team_id}>
                        {team.team_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Hr</label>
                  <select
                    name="team_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Team</option>
                    {hrNames.map(emp => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.employee_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Categories</label>
                <div className="categories-container">
                  {categories.map(cat => (
                    <div key={cat.category_id} className="category-row">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.category_id)}
                        onChange={() => handleCategoryChange(cat.category_id)}
                      />
                      <span>{cat.category_name}</span>
                      <input
                        type="radio"
                        name="primaryCategory"
                        checked={primaryCategory === cat.category_id}
                        onChange={() => handlePrimaryChange(cat.category_id)}
                        disabled={!selectedCategories.includes(cat.category_id)}
                      />
                      <label className="primary-label">Primary</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">Create Employee</button>
              </div>

            </form>
          </div>
        </>
      )}
      <div className="employee-list-container">
        <h2>All Employees</h2>
        <div className="employee-grid">
          {employeeData.map((emp) => (
            <div key={emp.employee_id} className="employee-card">
              <h3>{emp.employee_name}</h3>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Role:</strong> {emp.role?.role_name}</p>
              <p><strong>Team:</strong> {emp.team?.team_name}</p>
              <p><strong>ID:</strong> {emp.employee_id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

export default CreateEmployee;
