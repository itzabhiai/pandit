import React from 'react';
import './Step.css';  // Import the CSS file

function Step() {
  return (
    <div className="step-container">
      <h1 className="step-title">Steps</h1>
      <ul className="step-list">
        <li className="step-item">
          <span className="step-number">1</span>
          <span className="step-text">Register</span>
          <p className="step-description">Create an account with us using Google or Facebook.</p>
        </li>
        <li className="step-item">
          <span className="step-number">2</span>
          <span className="step-text">Download</span>
          <p className="step-description">Browse and Download the template that you like from the marketplace.</p>
        </li>
        <li className="step-item">
          <span className="step-number">3</span>
          <span className="step-text">Run</span>
          <p className="step-description">Follow the instructions to setup and customize the template to your needs.</p>
        </li>
      </ul>
    </div>
  );
}

export default Step;
