import React, { useEffect, useState } from 'react';
import '../styles/SkillCriteria.css';
import { FaRegStar } from "react-icons/fa";

const SkillCriteria = () => {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3008/categories', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCategories(data.result || []));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:3008/skills/category/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setSkills(data.result || []));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSkill) {
      fetch(`http://localhost:3008/skill-levels/${selectedSkill}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setLevels(data.result || []));
    }
  }, [selectedSkill]);

  return (
    <div className="skill-criteria-container">
      <div className="skill-criteria-content">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">Skill Criteria</h1>
          <p className="subtitle">Select a skill category to view associated skills and their level descriptions.</p>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Select Category</h2>
          </div>
          <div className="select-container">
            <select
              className="custom-select"
              onChange={(e) => {
                const id = e.target.value;
                setSelectedCategory(id);
                setSelectedSkill(null);
                setSkills([]);
                setLevels([]);
              }}
              defaultValue=""
            >
              <option value="" disabled>Choose Category</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            <span className="select-arrow">▼</span>
          </div>

          {selectedCategory && (
            <div className="selection-badge category-badge">
              <p>Selected Category: {categories.find(cat => cat.category_id === parseInt(selectedCategory))?.category_name}</p>
            </div>
          )}
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="section-card">
            <div className="section-header">
              <span className="section-icon skills-icon">🛠️</span>
              <h2 className="section-title">Select Skill</h2>
            </div>
            <div className="skills-grid">
              {skills.map(skill => (
                <button
                  key={skill.skill_id}
                  className={`skill-card ${selectedSkill === skill.skill_id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedSkill(skill.skill_id);
                    setLevels([]);
                  }}
                >
                  <span className="skill-name">{skill.skill_name}</span>
                  <span className="skill-arrow">➡️</span>
                </button>
              ))}
            </div>

            {selectedSkill && (
              <div className="selection-badge skill-badge">
                <p>Selected Skill: {skills.find(s => s.skill_id === selectedSkill)?.skill_name}</p>
              </div>
            )}
          </div>
        )}

        {/* Levels Section */}
        {levels.length > 0 && (
          <div className="section-card">
            <div className="section-header">
              <span className="section-icon levels-icon">📈</span>
              <h2 className="section-title">Skill Levels</h2>
            </div>
            <div className="levels-container">
              {levels.map((level, idx) => (
                <div key={level.level_id} className={`level-card level-${idx + 1}`}>
                  <div className="level-content">
                    <div className="level-icon-container">
                      <span className="level-icon"><FaRegStar/></span>
                    </div>
                    <div className="level-details">
                      <div className="level-header">
                        <h3 className="level-title">Level {level.level_number}</h3>
                        <div className="star-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`star ${i < level.level_number ? 'filled' : ''}`}><FaRegStar/></span>
                          ))}
                        </div>
                      </div>
                      <p className="level-description">{level.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedCategory && skills.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">😶</span>
            <p className="empty-title">No skills found for this category</p>
            <p className="empty-description">Please try selecting another category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCriteria;
