export const validateEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/; 
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

export const validatePassword = (password) => {
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};

export const validateName = (name) => {
 
  if (name.length < 3 || name.length > 100) {
    throw new Error('Name must be between 3 and 100 characters');
  }
};