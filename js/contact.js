/**
 * CONTACT.JS - JavaScript specific to the contact page
 * Contains functionality for contact form validation and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add fade-in animation to contact section
  const contactSection = document.querySelector('#contact');
  const formContainer = document.querySelector('.contact-form-container');
  
  if (contactSection) {
    contactSection.style.opacity = '0';
    contactSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      contactSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      contactSection.style.opacity = '1';
      contactSection.style.transform = 'translateY(0)';
    }, 100);
  }
  
  // Animate form container
  if (formContainer) {
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      formContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      formContainer.style.opacity = '1';
      formContainer.style.transform = 'scale(1)';
    }, 400);
  }
  
  // Form validation and submission handler
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Validate form
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      // Get submit button
      const submitBtn = this.querySelector('.submit-btn') || this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch("/.netlify/functions/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          submitBtn.textContent = 'Message Sent! ✓';
          submitBtn.style.background = '#27ae60';
          
          // Reset form after 2 seconds
          setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
          }, 2000);
        } else {
          alert(data.error || 'Failed to send message');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }

      } catch (error) {
        alert('Server not responding. Please try again later.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
    
    // Add real-time validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
          this.style.borderColor = '#e74c3c';
        } else {
          this.style.borderColor = '';
        }
      });
      
      input.addEventListener('focus', function() {
        this.style.borderColor = '';
      });
    });
  }
});
