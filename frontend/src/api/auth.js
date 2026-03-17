export const handleLogout = () => {
    // 1. Clear the data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Redirect to login
    window.location.href = '/login'; 
};