document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout');
  const token = getCookie('access-token');
  if (!token) {
    logoutButton.style.display = 'none';
  } else {
    logoutButton.addEventListener('click', async () => {
      document.cookie =
        'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      alert('로그아웃 되었습니다.');
      window.location.href = '/operate/login';
    });
  }
});

const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};
