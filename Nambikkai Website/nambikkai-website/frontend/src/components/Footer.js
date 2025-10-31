import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Nambikkai</h3>
            <p>Natural Products</p>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <address>
              33.A, Veerapa Nagar<br />
              1st, Cross, Krishnagiri<br />
              Tamil Nadu, 635001<br />
              Email: rajajp03@gmail.com<br />
              PH: 9894637056<br />
              State Code: 16
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Nambikkai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
