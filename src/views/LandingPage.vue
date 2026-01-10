<template>
  <div class="landing-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">MedMarket</div>
        <div class="header-actions">
          <button @click="$emit('show-login')" class="login-link">Login</button>
          <button @click="$emit('show-signup')" class="get-started-btn">Get Started</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-container">
        <!-- Trusted Badge -->
        <div class="trusted-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="clock-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Trusted by 500+ Medical Suppliers</span>
        </div>

        <!-- Main Headline -->
        <h1 class="headline">
          East Africa's Premier <span class="highlight">Medical Supply Platform</span>
        </h1>

        <!-- Description -->
        <p class="description">
          Connect hospitals, clinics, and pharmacies with verified pharmaceutical suppliers. 
          Streamline procurement with secure payments, real-time tracking, and comprehensive compliance management.
        </p>

        <!-- CTA Buttons -->
        <div class="cta-buttons">
          <button @click="handleStartBuying" class="cta-primary">
            Start Buying
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button @click="handleBecomeSupplier" class="cta-secondary">
            Become a Supplier
          </button>
        </div>
      </div>
    </main>

    <!-- Statistics Section -->
    <footer class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stat-icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="stat-value">500+</div>
          <div class="stat-label">Active Suppliers</div>
        </div>
        <div class="stat-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stat-icon">
            <circle cx="9" cy="21" r="1" fill="currentColor"/>
            <circle cx="20" cy="21" r="1" fill="currentColor"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="stat-value">10K+</div>
          <div class="stat-label">Products Listed</div>
        </div>
        <div class="stat-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stat-icon">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="stat-value">25K+</div>
          <div class="stat-label">Orders Processed</div>
        </div>
        <div class="stat-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stat-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div class="stat-value">8</div>
          <div class="stat-label">Countries Served</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  methods: {
    handleStartBuying() {
      // Navigate to signup with buyer role pre-selected
      this.$emit('show-signup', 'buyer')
    },
    handleBecomeSupplier() {
      // Navigate to signup with seller role pre-selected
      this.$emit('show-signup', 'seller')
    }
  }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #dbeafe; /* Light blue secondary - body background */
}

/* Header Styles */
.header {
  padding: 20px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #1d4ed8; /* Dark blue primary */
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.login-link {
  background: none;
  border: none;
  color: #1d4ed8; /* Dark blue primary */
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.2s;
}

.login-link:hover {
  color: #2563eb; /* Medium blue hover */
}

.get-started-btn {
  background-color: #1d4ed8; /* Dark blue primary */
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.get-started-btn:hover {
  background-color: #2563eb;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background-color: #dbeafe; /* Light blue secondary - body background */
}

.content-container {
  max-width: 800px;
  text-align: center;
}

.trusted-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #ffffff; /* White badge to stand out on light blue background */
  border-radius: 20px;
  color: #1d4ed8; /* Dark blue primary */
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.clock-icon {
  color: #1d4ed8; /* Dark blue primary */
}

.headline {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  color: #111827;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.highlight {
  color: #1d4ed8; /* Dark blue primary */
}

.description {
  font-size: 20px;
  line-height: 1.6;
  color: #6b7280;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #1d4ed8; /* Dark blue primary */
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.cta-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.arrow-icon {
  color: white;
}

.cta-secondary {
  background-color: white;
  color: #1d4ed8; /* Dark blue primary */
  border: 2px solid #1d4ed8;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.cta-secondary:hover {
  background-color: #dbeafe; /* Light blue secondary */
  transform: translateY(-1px);
}

/* Statistics Section */
.stats-section {
  background-color: #ffffff; /* White footer */
  padding: 60px 40px;
  border-top: 1px solid #e5e7eb;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-icon {
  color: #1d4ed8; /* Dark blue primary */
  margin-bottom: 16px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1d4ed8; /* Dark blue primary */
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 16px 20px;
  }

  .logo {
    font-size: 20px;
  }

  .header-actions {
    gap: 12px;
  }

  .login-link,
  .get-started-btn {
    font-size: 14px;
    padding: 8px 16px;
  }

  .main-content {
    padding: 40px 20px;
  }

  .headline {
    font-size: 36px;
  }

  .description {
    font-size: 18px;
  }

  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
    justify-content: center;
  }

  .stats-section {
    padding: 40px 20px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  .stat-value {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
