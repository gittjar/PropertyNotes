import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/contactform.css';

export default function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      setResult("Please fill in your name, email, and message so we know how to reply.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResult("That email address does not look quite right. Please check it and try again.");
      return;
    }

    formData.set("name", name);
    formData.set("email", email);
    formData.set("message", message);
    formData.append("access_key", "9712f4a5-f8cb-4950-845a-69f06ccbceb7");

    try {
      setResult("Sending your message…");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setResult("Thanks! Your message has been sent.");
        event.target.reset();
      } else {
        setResult(data.message || "Your message could not be sent. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setResult("We could not send your message right now. Please try again.");
    }
  };

  return (
    <div className="contact-form-container">

<Link to="/">
        <button>Properties page</button>
      </Link>
      <h2>Contact Us</h2>
      <form onSubmit={onSubmit} noValidate>
        <label className="form-hint" htmlFor="contact-name">What should we call you?</label>
        <input id="contact-name" type="text" name="name" placeholder="Your name" autoComplete="name" />
        <label className="form-hint" htmlFor="contact-email">Where can we reply?</label>
        <input id="contact-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" />
        <label className="form-hint" htmlFor="contact-message">How can we help?</label>
        <textarea id="contact-message" name="message" placeholder="Tell us a little about what you need" />
        <button type="submit">Submit Form</button>
      </form>
      {result && <p className="form-feedback" role="status">{result}</p>}
    </div>

  );
}