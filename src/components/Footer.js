import React from 'react';
// import { Link } from 'react-router-dom';
import './Footer.css'; // Make sure this CSS file is created and styled accordingly

const Footer = () => {
    // Note: The back-to-top button logic can be added later with a state and an effect.
    return (
        <footer className="footer">
            <div className="footer-content container">
                {/* Section 1: Social and Brand Logos */}
                <div className="footer-section footer-brand">
                    <div className="footer-social-logos">
                        <a href="https://www.facebook.com/amaderjolkhabar" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            {/* It's recommended to use an icon library like React Icons for SVGs */}
                            <img src="/images/Contact_logos/facebook-icon.png" alt="Facebook" />
                        </a>
                        <a href="https://www.instagram.com/bangalirjolkhabar" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <img src="/images/Contact_logos/instagram-icon.png" alt="Instagram" />
                        </a>
                        <a href="https://www.youtube.com/@Bangalirjolkhabar" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <img src="/images/Contact_logos/YoutubeLogo.png" alt="YouTube" />
                        </a>
                    </div>
                    <div className="brand-logo">
                        <img src="/images/Contact_logos/Siblings_logo.png" alt="Siblings Exims Logo" />
                    </div>
                </div>

                {/* Section 2: "Places to find us" Button */}
                {/* <div className="footer-section footer-middle">
                    <Link to="/places" className="availability-btn">Places to find us</Link>
                </div> */}

                {/* Section 3: Help & Support */}
                <div className="footer-help">
                    <strong>Contact Us</strong>

                    <div className="contact-item">
                        <img src="/images/Contact_logos/Gmap Logo.png" className="contact-icon" alt="Location" />
                        <span>Kolkata, West Bengal</span>
                    </div>

                    <a href="tel:+919674627460" className="contact-item">
                        <img src="/images/Contact_logos/Phone_logo.png" className="contact-icon" alt="Call" />
                        +91 96746 27460
                    </a>

                    <a href="https://wa.me/919674627460" className="contact-item" target="_blank" rel="noopener noreferrer">
                        <img src="/images/Contact_logos/Whatsapp_logo.png" className="contact-icon" alt="WhatsApp" />
                        WhatsApp Us
                    </a>

                    <a href="mailto:Contact@jolkhabarstore.com" className="contact-item">
                        <img src="/images/Contact_logos/Email_logo.png" className="contact-icon" alt="Email" />
                        Contact@jolkhabarstore.com
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;

