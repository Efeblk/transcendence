export const initiate42Login = async () => {
    try {
      const response = await fetch('/api/auth/42/login/');
      const data = await response.json();
      
      if (data.auth_url) {
        // Redirect to 42's authorization page
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error('Failed to initiate 42 login:', error);
    }
  };