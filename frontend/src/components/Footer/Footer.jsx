import { Link } from 'react-router-dom';
import { Bolt, Github, Mail, ExternalLink } from 'lucide-react';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="footer-logo-icon">
                                <Bolt size={20} />
                            </div>
                            <span>India Fasteners</span>
                        </Link>
                        <p className="footer-tagline">
                            Simplifying fastener calculations for the Indian industry
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4 className="footer-heading">Quick Links</h4>
                        <nav className="footer-nav">
                            <Link to="/calculator">Weight Calculator</Link>
                            <Link to="/diagrams">Fastener Diagrams</Link>
                            <Link to="/hsn">HSN Codes</Link>
                            <Link to="/standards">Standards Reference</Link>
                        </nav>
                    </div>

                    {/* Resources */}
                    <div className="footer-links">
                        <h4 className="footer-heading">Resources</h4>
                        <nav className="footer-nav">
                            <a href="https://www.indiafasteners.com" target="_blank" rel="noopener noreferrer">
                                Official Website <ExternalLink size={12} />
                            </a>
                            <a href="https://cbic-gst.gov.in" target="_blank" rel="noopener noreferrer">
                                GST Portal <ExternalLink size={12} />
                            </a>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="footer-links">
                        <h4 className="footer-heading">Contact</h4>
                        <nav className="footer-nav">
                            <a href="mailto:jainamjparekh@gmail.com">
                                <Mail size={14} /> jainamjparekh@gmail.com
                            </a>
                        </nav>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} India Fasteners.
                    </p>
                    <p className="footer-disclaimer">
                        Calculations are approximate. Always verify with official specifications.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
