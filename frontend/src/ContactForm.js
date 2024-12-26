import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/contactform.css';

export default function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "9712f4a5-f8cb-4950-845a-69f06ccbceb7");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }


  };

  return (
    <div className="contact-form-container">

<Link to="/">
        <button>Properties page</button>
      </Link>
      <h2>Contact Us</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit">Submit Form</button>
      </form>
      <span>{result}</span>
    </div>

  );
}