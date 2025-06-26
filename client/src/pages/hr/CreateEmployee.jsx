import React, { useEffect, useState } from 'react';
import { FaTimes } from "react-icons/fa";
import '../../styles/createemployee.css';
import { getAllDesignations, searchEmployee, getAllEmployees, getAllHrames, getAllCategories, getAllTeamNames, getAllRoles } from '../../services/adminService';


const CreateEmployee = () => {

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: '',
    email: '',
    password: '',
    role_id: '',
    team_id: '',
    hr_id: '',
    desi_id: '',
    primary_category_id: '',
    secondary_category_id: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [fillterEmployeeData, setFilterEmployeeData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hrNames, setHrNames] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [primaryCategory, setPrimaryCategory] = useState(null);
  const [secondaryCategory, setSecondaryCategory] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [rolesData, teamsData, catsData, hrNamesData, employeesData, desiData] = await Promise.all([
          getAllRoles(),
          getAllTeamNames(),
          getAllCategories(),
          getAllHrames(),
          getAllEmployees(),
          getAllDesignations()
        ]);
        setRoles(rolesData.result);
        setHrNames(hrNamesData.result);
        setTeams(teamsData.result);
        setCategories(catsData.result);
        setEmployeeData(employeesData.result);
        setDesignations(desiData.result);
      } catch (err) {
        console.error('Error loading dropdowns:', err);
        setMessage('Failed to load some options. Using sample data.');
      }

    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim !== '') {
        searchEmployee(searchTerm)
          .then((data) => {
            setFilterEmployeeData(data.employees);
          })
          .catch((err) => console.error('Error fetching employees:', err))
      }
    }, 400)
    return () => clearTimeout(delay)
  }, [searchTerm]);

  console.log("fillterEmployeeData", fillterEmployeeData)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );

    if (!selectedCategories.includes(categoryId) && primaryCategory === categoryId) {
      setPrimaryCategory(null);
    }
  };

  const handlePrimaryChange = (categoryId) => {
    setPrimaryCategory(categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    const categoriesPayload = [];
    if (primaryCategory) {
      categoriesPayload.push({
        category_id: primaryCategory,
        is_primary: true,
      });
    }

    if (secondaryCategory && secondaryCategory !== primaryCategory) {
      categoriesPayload.push({
        category_id: secondaryCategory,
        is_primary: false,
      });
    }
    const payload = {
      ...formData,
      categories: categoriesPayload,
      hr_id: formData.hr_id || null,
      desi_id: formData.desi_id || null,
    };
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        payload[key] = null;
      }
    });


    try {
      const result = await addEmployee(payload)
      if (result.success) {
        setMessage('Employee created successfully!');
        setShowForm(false);

        setFormData(prev => ({
          ...prev,
          primary_category_id: '',
          secondary_category_id: ''
        }));
        setSelectedCategories([]);
        setPrimaryCategory(null);
        const token = localStorage.getItem('token');
        const employeesRes = await fetch('http://localhost:3008/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const employeesData = await employeesRes.json();
        setEmployeeData(employeesData.result);
      } else {
        const err = await response.json();
        setMessage(`Error: ${err.message || 'Failed to create employee.'}`);
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      setMessage('Error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div className='admin-employee-container'>
      <div className="employee-container__header">
        <div className="search-container">
          <input type="text" placeholder='Enter the Name..' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <button className="btn-create" onClick={() => setShowForm(true)}>
          Create Employee
        </button>
      </div>

      {message && (
        <div className={`form-message ${message.startsWith('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <>
          <div className="overlay" onClick={() => setShowForm(false)} />
          <div className="form-modal">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <FaTimes />
            </button>
            <h2 className="form-title">Create New Employee</h2> {/* Added a title */}
            <form onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-row__group">
                  <label htmlFor="employee_name">Employee Name</label>
                  <input
                    type="text"
                    id="employee_name"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    required
                    placeholder='Enter the Name..'
                  />
                </div>
                <div className="form-row__group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder='Enter the Email..'
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-row__group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder='Enter the Password..'

                  />
                </div>
                <div className="form-row__group">
                  <label htmlFor="role_id">Role</label>
                  <select
                    id="role_id"
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    required
                  >
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
                <div className="form-row__group">
                  <label htmlFor="team_id">Team</label>
                  <select
                    id="team_id"
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
                <div className="form-row__group">
                  <label htmlFor="hr_id">HR</label>
                  <select
                    id="hr_id"
                    name="hr_id" // Corrected name to hr_id
                    value={formData.hr_id}
                    onChange={handleChange}
                  >
                    <option value="">Select HR</option>
                    {hrNames.map(hr => (
                      <option key={hr.employee_id} value={hr.employee_id}>
                        {hr.employee_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-row__group">
                  <label htmlFor="desi_id">Designation (Optional)</label>
                  <select
                    id="desi_id"
                    name="desi_id" // Corrected name to desi_id
                    value={formData.desi_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Designation</option>
                    {designations.map(desi => (
                      <option key={desi.desi_id} value={desi.desi_id}>
                        {desi.position}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="form-row">
                <div className="form-row__group">
                  <label>Categories</label>
                  <div className="dropdown-container">
                    <div className="dropdown-group">
                      <label>Primary Category:</label>
                      <select
                        value={primaryCategory || ''}
                        onChange={(e) => setPrimaryCategory(Number(e.target.value))}
                      >
                        <option value="">-- Select Primary --</option>
                        {categories.map(cat => (
                          <option
                            key={cat.category_id}
                            value={cat.category_id}
                            disabled={cat.category_id === secondaryCategory}
                          >
                            {cat.category_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="dropdown-group">
                      <label>Secondary Category:</label>
                      <select value={secondaryCategory || ''}
                        onChange={(e) => setSecondaryCategory(Number(e.target.value))}
                      ><option value="">-- Select Secondary --</option>
                        {categories.map(cat => (
                          <option
                            key={cat.category_id}
                            value={cat.category_id}
                            disabled={cat.category_id === primaryCategory}
                          >{cat.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* <div className="categories-container">
                  {categories.map(cat => (
                    <div key={cat.category_id} className="category-row">
                      <input
                        type="checkbox"
                        id={`category-${cat.category_id}`}
                        checked={selectedCategories.includes(cat.category_id)}
                        onChange={() => handleCategoryChange(cat.category_id)}
                      />
                      <label htmlFor={`category-${cat.category_id}`} className="category-name">
                        {cat.category_name}
                      </label>
                      <input
                        type="radio"
                        id={`primary-${cat.category_id}`}
                        name="primaryCategory"
                        checked={primaryCategory === cat.category_id}
                        onChange={() => handlePrimaryChange(cat.category_id)}
                        disabled={!selectedCategories.includes(cat.category_id)}
                      />
                      <label htmlFor={`primary-${cat.category_id}`} className="primary-label">
                        Primary
                      </label>
                    </div>
                  ))}
                </div> */}
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
          {(searchTerm.trim() !== '' ? fillterEmployeeData : employeeData)?.length > 0 ? (
            (searchTerm.trim() !== '' ? fillterEmployeeData : employeeData).map((emp) => (
              <div key={emp.employee_id} className="employee-card">
                <h3>{emp.employee_name}</h3>
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Role:</strong> {emp.role?.role_name || 'N/A'}</p>
                <p><strong>Team:</strong> {emp.team?.team_name || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p className='no-employee'>No employees found</p>
          )}
        </div>



      </div>
    </div>
  );
};

export default CreateEmployee;
