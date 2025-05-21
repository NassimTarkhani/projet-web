const Auth = {
  login(email, password, role) {
    return fetch("http://localhost/projet-web/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      }
      return data;
    })
    .catch(() => {
      return { success: false, message: "Erreur de connexion au serveur" };
    });
  },

  logout() {
    localStorage.removeItem("currentUser");
  },

  getCurrentUser() {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = "../pages/login.html";
    }
  },

  redirectToDashboard() {
    const user = this.getCurrentUser();
    if (user) {
      if (user.role === "admin") {
        window.location.href = "../pages/admin-dashboard.html";
      } else {
        window.location.href = "../pages/client-dashboard.html";
      }
    }
  },

  requireRole(role) {
    if (!this.hasRole(role)) {
      if (this.isLoggedIn()) {
        this.redirectToDashboard();
      } else {
        window.location.href = "../pages/login.html";
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    Auth.logout();
    window.location.href = "../index.html"; // Redirection vers la page de index.html
  });
}

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    if (Auth.isLoggedIn()) {
      Auth.redirectToDashboard();
      return;
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const userType = document.getElementById("userType").value;

      const result = await Auth.login(email, password, userType);

      if (result.success) {
        showNotification("Login successful! Redirecting...", "success");
        setTimeout(() => {
          Auth.redirectToDashboard();
        }, 1000);
      } else {
        showNotification(result.message, "error");
      }
    });

    const demoLoginBtn = document.getElementById("demoLogin");
    if (demoLoginBtn) {
      demoLoginBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const userType = document.getElementById("userType").value;
        let email, password;

        if (userType === "admin") {
          email = "admin@contactflow.com";
          password = "admin123";
        } else {
          email = "john@example.com";
          password = "client123";
        }

        document.getElementById("email").value = email;
        document.getElementById("password").value = password;

        const result = await Auth.login(email, password, userType);

        if (result.success) {
          showNotification("Demo login successful! Redirecting...", "success");
          setTimeout(() => {
            Auth.redirectToDashboard();
          }, 1000);
        } else {
          showNotification(result.message, "error");
        }
      });
    }
  }

  const dashboardContainer = document.querySelector(".dashboard-container");
  if (dashboardContainer) {
    Auth.requireLogin();

    const pathname = window.location.pathname;

    if (pathname.includes("admin-")) {
      Auth.requireRole("admin");
    } else if (
      pathname.includes("client-") ||
      pathname.includes("request-service") ||
      pathname.includes("view-requests") ||
      pathname.includes("profile")
    ) {
      Auth.requireRole("client");
    }

    updateUserInfo();
    initThemeToggle();
    initSidebarToggle();
  }
});

function updateUserInfo() {
  const user = Auth.getCurrentUser();
  if (user) {
    const userNameElements = document.querySelectorAll("#userName, #welcomeUserName");
    userNameElements.forEach((el) => {
      if (el) {
        if (el.id === "welcomeUserName") {
          el.textContent = user.name.split(" ")[0];
        } else {
          el.textContent = user.name;
        }
      }
    });

    const userAvatarElement = document.getElementById("userAvatar");
    if (userAvatarElement) {
      userAvatarElement.src = user.avatar;
      userAvatarElement.alt = `${user.name}'s Avatar`;
    }
  }
}

function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const darkMode = localStorage.getItem("darkMode") === "true";
    themeToggle.checked = darkMode;
    if (darkMode) {
      document.body.classList.add("dark-theme");
    }

    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("darkMode", "true");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("darkMode", "false");
      }
    });
  }
}

function initSidebarToggle() {
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("expanded");
    });
  }
}

function showNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.className = "notification";
    notification.classList.add(type, "show");
    notification.textContent = message;

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
}
