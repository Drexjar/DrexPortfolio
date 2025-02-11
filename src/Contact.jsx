// Contact.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";
import "./App.css"; // or your dedicated CSS file for styling

function Contact() {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  // Update form state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send the email using EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_kaqhphn", // Replace with your EmailJS service ID
        "template_g177rv8", // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message
        },
        "K6TxBnD8C6VYtCnaA" // Replace with your EmailJS user ID or public key
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setStatus("SUCCESS");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.log("FAILED...", error);
          setStatus("FAILED");
        }
      );
  };

  return (
    <div className="contact-container">
      <h2>{t("contact.title", "Contact Me")}</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder={t("contact.name", "Your Name")}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("contact.email", "Your Email")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder={t("contact.message", "Your Message")}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">{t("contact.submit", "Send Message")}</button>
      </form>
      {status === "SUCCESS" && (
        <p className="success-message">
          {t("contact.success", "Your message has been sent!")}
        </p>
      )}
      {status === "FAILED" && (
        <p className="error-message">
          {t("contact.failure", "There was an error sending your message. Please try again later.")}
        </p>
      )}
      {/* Navigation Button to return to homepage */}
      <button onClick={() => navigate("/")} className="return-home-btn">
        {t("contact.returnHome", "Return to Homepage")}
      </button>
    </div>
  );
}

export default Contact;
