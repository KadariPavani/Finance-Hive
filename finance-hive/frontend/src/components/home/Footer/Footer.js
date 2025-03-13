import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <h2>Ready to get started?</h2>
        <p>Talk to us today and take the first step towards financial freedom.</p>
        <button onClick={() => alert("Get started clicked!")}>Get Started</button>
      </div>

      <div className="footer-content">
        <div className="footer-logo">
          <img src={"/Images/FH_logoFinal.png"} alt="Finance Management Logo" className="footer-logo-img" />
        </div>

        <div className="col col-3">
          <h6>FINANCE MANAGEMENT</h6>
          <p><b>One platform - Endless Possibilities</b></p>
          <p>
            Take control of your finance today, <br />
            with our innovative management tools. <br />
            Simplify your financial life, <br />
            and achieve your goals.
          </p>
        </div>

        <div className="col col-6">
          <h4>USEFUL LINKS</h4>
          <a href="/about" className="link-item">| About Us</a>
          <a href="/contact" className="link-item">| Contact Us</a>
          <a href="/privacy-policy" className="link-item">| Privacy Policy</a>
        </div>

        <div className="col col-7">
          <h4>Contact Us</h4>
          <p className="email-footer">
            email support: <a href="mailto:support@khub.com">support@khub.com</a>
          </p>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedInIcon />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <YouTubeIcon />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterIcon />
          </a>
        </div>
      </div>

      <div className="footer_2">
        <p>Copyright @2024 Financial, Design by K-HUB Team-8. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
