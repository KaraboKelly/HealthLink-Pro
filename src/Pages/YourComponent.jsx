import React from 'react';
import SplitScreenSlider from './SplitScreenSlider';
import image from '../images/smile.png'; 

const YourComponent = () => {
  const content = (
    <>
      <div>
        <h1 style={{ fontSize: "3.5em", color: "#007BFF", fontFamily: "Lora, serif", fontWeight: 700 }}>Access Medical Guidance Anytime, Anywhere</h1>
      </div>
      <div>
        <p style={{ fontSize: "1.5em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700 }}>Enjoy the flexibility of seeking medical advice from the comfort of your own space.</p>
        <p style={{ fontSize: "1.5em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700 }}>Access the platform 24/7, allowing you to manage your health on your terms.</p>
        <p style={{ fontSize: "1.5em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700 }}>Start your journey towards better health today!</p>
      </div>
    </>
  );

  return <SplitScreenSlider image={image} content={content} />;
};

export default YourComponent;
