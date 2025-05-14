import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import "./App.css";

function Contact({ currentLang }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_kaqhphn",
        "template_g177rv8",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message
        },
        "K6TxBnD8C6VYtCnaA"
      )
      .then(
        () => {
          setStatus("SUCCESS");
          setFormData({ name: "", email: "", message: "" });
        },
        () => setStatus("FAILED")
      );
  };

  return (
    <div className="contact-container">
      <h2>{t("contact.title")}</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder={t("contact.name")}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("contact.email")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder={t("contact.message")}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">{t("contact.submit")}</button>
      </form>
      {status === "SUCCESS" && (
        <p className="success-message">{t("contact.success")}</p>
      )}
      {status === "FAILED" && (
        <p className="error-message">{t("contact.failure")}</p>
      )}
    </div>
  );
}

Contact.propTypes = {
  currentLang: PropTypes.string.isRequired,
};

export default Contact;
