import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SchoolTourApplicationForm() {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      description: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:8080/api/applications', formData);
        alert(response.data); // Show success message
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Failed to submit the application.');
      }
    };

    return (
      <div>
        <h1>Add Application</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <br />
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
          </label>
          <br />
          <button type="submit">Submit Application</button>
        </form>
      </div>
  );
}

export default SchoolTourApplicationForm;