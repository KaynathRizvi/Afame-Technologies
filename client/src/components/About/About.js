// About.js
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Home Essence</h1>
      </header>
      <section className="about-content">
        <p>
          Welcome to Home Essence – your one-stop destination for all your home essentials.
          At Home Essence, we believe that a home should be a sanctuary; a space that reflects
          your style, comfort, and personality.
        </p>
        <p>
          Our mission is to transform houses into homes by offering carefully curated products
          that blend functionality with aesthetic appeal. Whether you're revamping your living room,
          upgrading your kitchen, or simply searching for that perfect decorative piece, we’re here to help
          you create spaces you love.
        </p>
        <p>
          With a focus on quality, affordability, and user experience, our platform is built using the
          latest technologies. Our frontend is powered by <strong>React.js</strong>, ensuring a dynamic and
          responsive interface, while our backend leverages the robustness of <strong>Node.js</strong> and{' '}
          <strong>Express.js</strong> to deliver a secure and scalable experience.
        </p>
      </section>
      <footer className="about-footer">
        <p>
          Developed by <strong>Kaynath Zehra Rizvi</strong> using <strong>React.js</strong> and{' '}
          <strong>Node.js + Express.js</strong>.
        </p>
      </footer>
    </div>
  );
};

export default About;
