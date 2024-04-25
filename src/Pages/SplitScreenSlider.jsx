import React from 'react'; 
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer'; 
import './SplitScreenSlider.css'; 

const SplitScreenSlider = ({ image, content }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
    });
  
    const contentAnimation = useSpring({
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(100%)',
    });
  
    return (
      <div className="split-screen-container" ref={ref}>
        <div className="image-container">
          <img src={image} alt="Split Screen" />
        </div>
        <animated.div className="content-container" style={contentAnimation}>
          {content}
        </animated.div>
      </div>
    );
  };
  
export default SplitScreenSlider;
