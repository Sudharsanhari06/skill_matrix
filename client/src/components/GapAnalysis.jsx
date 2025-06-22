import React, { useEffect, useState } from 'react';

const GapAnalysis = () => {
  const [gapData, setGapData] = useState([]);

  useEffect(() => {
    const fetchGapAnalysis = async () => {
      const token = localStorage.getItem("token"); // optional, if auth used
      const response = await fetch('http://localhost:3008/gap-analysis', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setGapData(data);
    };

    fetchGapAnalysis();
  }, []);

  return (
    <div>
      <h2>Gap Analysis</h2>
      {gapData.map((item, index) => (
        <div key={index} style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
          <h3>{item.skill_name}</h3>
          <p><strong>Current Level:</strong> {item.current_level}</p>
          <p><strong>Expected Level:</strong> {item.expected_level}</p>
          <p><strong>Guidance to Expected:</strong> {item.guidance_to_expected}</p>
          <a href={item.resource_to_expected} target="_blank" >Learn More</a>

          {item.current_level === item.expected_level && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Next Level: {item.next_level}</h4>
              <p><strong>Guidance to Next:</strong> {item.guidance_to_next}</p>
              <a href={item.resource_to_next} target="_blank" rel="noreferrer">Next Level Resource</a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GapAnalysis;
