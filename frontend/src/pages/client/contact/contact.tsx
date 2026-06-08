import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <Header />
      <style>{styles}</style>

      {/* Hero Section */}
      <div
        className="contact-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.8)), url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="contact-hero__content">
          <nav className="contact-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="contact-hero__breadcrumb-link">
              <Home size={15} className="contact-hero__home-icon" /> Home
            </Link>
            <span className="contact-hero__breadcrumb-sep">|</span>
            <span className="contact-hero__breadcrumb-current">Contact Us</span>
          </nav>
          <h1 className="contact-hero__title">Get In Touch</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="contact-main">
        <div className="contact-grid">
          {/* LEFT COLUMN - Contact Info */}
          <div className="contact-info-container">
            <h2 className="contact-section-title">Contact Information</h2>
            <p className="contact-text">
              Have questions or need assistance? Our team is here to help. Reach
              out to us using any of the following methods, and we'll get back to
              you as soon as possible.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>Our Location</h3>
                  <p>123 Service Avenue, Suite 456<br />New York, NY 10001</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>Phone Number</h3>
                  <p>+1 (555) 123-4567<br />Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>Email Address</h3>
                  <p>support@servicehub.com<br />info@servicehub.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Contact Form */}
          <div className="contact-form-container">
            <h2 className="contact-section-title">Send us a Message</h2>
            
            {submitSuccess ? (
              <div className="contact-success">
                <div className="contact-success-icon">✓</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. We will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={5}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ─── Styles ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .contact-page {
    min-height: 100vh;
    background: #fafaf8;
    font-family: "Times New Roman", sans-serif, "Geist", "Geist Placeholder", "Inter", "Inter Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
    color: #1a1a2e;
    -webkit-font-smoothing: antialiased;
  }

  .contact-page *,
  .contact-page button,
  .contact-page span,
  .contact-page h1,
  .contact-page h2,
  .contact-page h3,
  .contact-page h4,
  .contact-page p,
  .contact-page a,
  .contact-page input,
  .contact-page textarea {
    font-family: "Times New Roman", sans-serif, "Geist", "Geist Placeholder", "Inter", "Inter Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
  }

  /* Hero Section */
  .contact-hero {
    position: relative;
    padding: 100px 24px 120px;
    text-align: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 380px;
  }
  .contact-hero__content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .contact-hero__breadcrumb {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 700;
  }
  .contact-hero__breadcrumb-link {
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    transition: color 0.2s;
  }
  .contact-hero__breadcrumb-link:hover {
    color: #c2a044;
  }
  .contact-hero__home-icon {
    color: #c2a044;
    stroke-width: 2.5;
  }
  .contact-hero__breadcrumb-sep {
    color: #fff;
    font-weight: 400;
  }
  .contact-hero__breadcrumb-current {
    color: #fff;
  }
  .contact-hero__title {
    font-size: 48px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    letter-spacing: -1px;
  }

  /* Main */
  .contact-main {
    width: 100%;
    margin: 0;
    padding: 48px 48px 80px;
  }
  @media (max-width: 1100px) {
    .contact-main { padding: 48px 32px 80px; }
  }
  @media (max-width: 900px) {
    .contact-main { padding: 48px 24px 80px; }
  }

  /* Grid */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 48px;
    align-items: start;
    width: 100%;
  }
  @media (max-width: 900px) {
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  /* Section Title */
  .contact-section-title {
    font-size: 28px;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0 0 24px;
    letter-spacing: -0.5px;
  }

  /* Contact Info Container */
  .contact-info-container {
    padding-right: 20px;
  }
  @media (max-width: 900px) {
    .contact-info-container {
      padding-right: 0;
    }
  }
  .contact-text {
    font-size: 15px;
    line-height: 1.7;
    color: #555;
    margin-bottom: 40px;
  }
  .contact-info-list {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .contact-info-item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }
  .contact-info-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f5f0e8;
    color: #c9a84c;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  .contact-info-item:hover .contact-info-icon {
    background: #1a1a2e;
    color: #fff;
    transform: scale(1.05);
  }
  .contact-info-content h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 8px;
  }
  .contact-info-content p {
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    margin: 0;
  }

  /* Contact Form Container */
  .contact-form-container {
    background: #fff;
    border: 1px solid #eae6dc;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  }
  @media (max-width: 600px) {
    .contact-form-container {
      padding: 24px;
    }
  }
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .contact-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 600px) {
    .contact-form-row {
      grid-template-columns: 1fr;
    }
  }
  .contact-form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .contact-form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;
  }
  .contact-form-group input,
  .contact-form-group textarea {
    width: 100%;
    padding: 14px 16px;
    background: #fcfbf9;
    border: 1px solid #eae6dc;
    border-radius: 8px;
    font-size: 14px;
    color: #1a1a2e;
    transition: all 0.2s ease;
    outline: none;
  }
  .contact-form-group input:focus,
  .contact-form-group textarea:focus {
    border-color: #c9a84c;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
  }
  .contact-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    background: linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
  }
  .contact-submit-btn:hover {
    background: linear-gradient(135deg, #c9a84c 0%, #d4b65e 100%);
    color: #1a1a2e;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(201, 168, 76, 0.2);
  }
  .contact-submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Success Message */
  .contact-success {
    text-align: center;
    padding: 40px 20px;
    background: #f8fff9;
    border: 1px dashed #c2a044;
    border-radius: 12px;
  }
  .contact-success-icon {
    width: 64px;
    height: 64px;
    background: #c2a044;
    color: #fff;
    font-size: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  .contact-success h3 {
    font-size: 20px;
    color: #1a1a2e;
    margin: 0 0 10px;
  }
  .contact-success p {
    color: #666;
    margin: 0;
  }
`;

export default Contact;
