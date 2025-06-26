const SkillDetailsPanel = ({ skill }) => {
    if (!skill) return <p>Select a skill from the chart to view guidance.</p>;
  
    const achieved = skill.current_level >= skill.expected_level;
  
    return (
      <div className="skill-details-panel">
        <h3>{skill.skill_name}</h3>
        {achieved ? (
          <>
            <p className="success"> You have achieved the expected level!</p>
            <h4>Improve to next level:</h4>
            <p>{skill.guidance_to_next}</p>
            <a href={skill.resource_to_next} target="_blank" rel="noreferrer">Learn More</a>
          </>
        ) : (
          <>
            <p><strong>Current Level:</strong> {skill.current_level}</p>
            <p><strong>Expected Level:</strong> {skill.expected_level}</p>
            <p><strong>Guidance:</strong> {skill.guidance_to_expected}</p>
            <a href={skill.resource_to_expected} target="_blank" rel="noreferrer">Learn More</a>
          </>
        )}
      </div>
    );
  };
  
  export default SkillDetailsPanel;
  