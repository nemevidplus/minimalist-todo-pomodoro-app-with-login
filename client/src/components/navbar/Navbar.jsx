import React from 'react'
import { useState, useEffect } from 'react';
import "./navbar.css"

const Navbar = () => {

    const [scrolled, setScrolled] = useState(false);
   


    useEffect(()=> {
        const handleScroll = () => {
          if (window.scrollY > 10) {
            setScrolled(true);
          } else {
            setScrolled(false)
          }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll)
    
      }, [])
        
        
        function staggerLogo(text) {
          return (
            <span className="stagger-word-logo">
            {text.split('').map((char, index) => 
          (
          <span key={index}
          className="stagger-char-logo"
          style={{ '--i': index}}
          >
          <span className="char-primary-l">{char === ' ' ? '\u00A0' : char}</span>
          <span className="char-hover">{char === ' ' ? '\u00A0' : char}</span>
          
          </span>
          ))}
      
            </span>
          );
        };
      


  return (
    <div>
          <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>

<div className="nav-top-wrapper">
 
  <div className="nav-top container">
  <div className="logo-section">
    <span className="logo">{staggerLogo('feladatozások')}</span>
    <span className="sub-logo">{"//"}DIGITÁLIS FELADATTÉR</span>
  </div>
  </div>
  </div>

 
 
</header>
    </div>
  )
}

export default Navbar
