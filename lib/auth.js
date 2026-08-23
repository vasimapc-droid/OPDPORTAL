export const mockUsers = {
  patient: {
    id: 'PAT001',
    name: 'Patient User',
    email: 'patient@example.com',
    password: 'patient123',
    role: 'patient',
  },
  doctor: {
    id: 'DOC001',
    name: 'Dr. Priya Sharma',
    email: 'doctor@example.com',
    password: 'doctor123',
    role: 'doctor',
  },
};

export function authenticateUser(email, password) {
  const user = Object.values(mockUsers).find(
    (u) => u.email === email && u.password === password
  );
  
  if (user) {
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password',
  };
}