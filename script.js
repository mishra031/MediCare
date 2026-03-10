// Configuration and State
const defaultConfig = {
  hospital_name: 'MediCare Hospital',
  hero_title: 'Your Health Is Our Top Priority',
  hero_subtitle: "Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities. We're committed to providing compassionate care for you and your family.",
  primary_color: '#0ea5e9',
  secondary_color: '#10b981',
  background_color: '#f0f9ff',
  text_color: '#1f2937',
  accent_color: '#ffffff'
};

let appointments = [];
let currentUser = null;
let isStaffLoggedIn = false;

// Doctors Data
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    qualification: 'MD, FACC - Harvard Medical School',
    experience: 15,
    description: 'Expert in cardiovascular diseases and heart surgery with over 15 years of experience.',
    availability: 'Mon, Wed, Fri',
    time: '9:00 AM - 5:00 PM',
    rating: 4.9,
    reviews: 234,
    color: 'sky'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    qualification: 'MD, PhD - Stanford University',
    experience: 12,
    description: 'Specializes in brain and nervous system disorders with expertise in stroke treatment.',
    availability: 'Tue, Thu, Sat',
    time: '10:00 AM - 6:00 PM',
    rating: 4.8,
    reviews: 189,
    color: 'purple'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Orthopedic',
    qualification: 'MD, MS - Johns Hopkins',
    experience: 18,
    description: 'Leading expert in joint replacement surgery and sports medicine injuries.',
    availability: 'Mon, Tue, Thu',
    time: '8:00 AM - 4:00 PM',
    rating: 4.9,
    reviews: 312,
    color: 'emerald'
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialization: 'Pediatrician',
    qualification: 'MD, FAAP - Yale School of Medicine',
    experience: 10,
    description: 'Compassionate care for children from newborns to adolescents.',
    availability: 'Mon - Fri',
    time: '9:00 AM - 5:00 PM',
    rating: 4.9,
    reviews: 456,
    color: 'blue'
  },
  {
    id: 5,
    name: 'Dr. Amanda Foster',
    specialization: 'Dermatologist',
    qualification: 'MD, FAAD - Columbia University',
    experience: 8,
    description: 'Specialist in skin conditions, cosmetic procedures, and skin cancer treatment.',
    availability: 'Wed, Fri, Sat',
    time: '11:00 AM - 7:00 PM',
    rating: 4.7,
    reviews: 178,
    color: 'pink'
  },
  {
    id: 6,
    name: 'Dr. Robert Kim',
    specialization: 'General Surgeon',
    qualification: 'MD, FACS - UCLA',
    experience: 20,
    description: 'Experienced in minimally invasive surgeries and complex surgical procedures.',
    availability: 'Tue, Wed, Thu',
    time: '7:00 AM - 3:00 PM',
    rating: 4.8,
    reviews: 267,
    color: 'teal'
  }
];

// Initialize Element SDK
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange: async (config) => {
      updateUI(config);
    },
    mapToCapabilities: (config) => ({
      recolorables: [
        {
          get: () => config.primary_color || defaultConfig.primary_color,
          set: (value) => { config.primary_color = value; window.elementSdk.setConfig({ primary_color: value }); }
        },
        {
          get: () => config.secondary_color || defaultConfig.secondary_color,
          set: (value) => { config.secondary_color = value; window.elementSdk.setConfig({ secondary_color: value }); }
        },
        {
          get: () => config.background_color || defaultConfig.background_color,
          set: (value) => { config.background_color = value; window.elementSdk.setConfig({ background_color: value }); }
        },
        {
          get: () => config.text_color || defaultConfig.text_color,
          set: (value) => { config.text_color = value; window.elementSdk.setConfig({ text_color: value }); }
        },
        {
          get: () => config.accent_color || defaultConfig.accent_color,
          set: (value) => { config.accent_color = value; window.elementSdk.setConfig({ accent_color: value }); }
        }
      ],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config) => new Map([
      ['hospital_name', config.hospital_name || defaultConfig.hospital_name],
      ['hero_title', config.hero_title || defaultConfig.hero_title],
      ['hero_subtitle', config.hero_subtitle || defaultConfig.hero_subtitle]
    ])
  });
}

// Initialize Data SDK
const dataHandler = {
  onDataChanged(data) {
    appointments = data.filter(d => d.type === 'appointment');
    updateDashboardStats();
    renderAppointmentsTable();
    renderRecentAppointments();
  }
};

if (window.dataSdk) {
  window.dataSdk.init(dataHandler);
}

// UI Update Function
function updateUI(config) {
  const hospitalName = config.hospital_name || defaultConfig.hospital_name;
  const heroTitle = config.hero_title || defaultConfig.hero_title;
  const heroSubtitle = config.hero_subtitle || defaultConfig.hero_subtitle;

  const loginHospitalName = document.getElementById('login-hospital-name');
  const navHospitalName = document.getElementById('nav-hospital-name');
  const footerHospitalName = document.getElementById('footer-hospital-name');
  const heroTitleEl = document.getElementById('hero-title');
  const heroSubtitleEl = document.getElementById('hero-subtitle');

  if (loginHospitalName) loginHospitalName.textContent = hospitalName;
  if (navHospitalName) navHospitalName.textContent = hospitalName;
  if (footerHospitalName) footerHospitalName.textContent = hospitalName;
  if (heroTitleEl) {
    const words = heroTitle.split(' ');
    const lastTwo = words.slice(-2).join(' ');
    const rest = words.slice(0, -2).join(' ');
    heroTitleEl.innerHTML = `${rest} <span class="gradient-text">${lastTwo}</span>`;
  }
  if (heroSubtitleEl) heroSubtitleEl.textContent = heroSubtitle;
}

// Page Navigation
function showPage(pageId) {
  const authPages = ['user-login', 'user-register', 'staff-login'];
  authPages.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(pageId).classList.remove('hidden');
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Auth Handlers
document.getElementById('user-login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  if (email) {
    currentUser = { email };
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('hospital-home').classList.remove('hidden');
    showToast('Welcome back! Successfully logged in.', 'success');
    renderDoctors();
  }
});

document.getElementById('user-register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (password !== confirm) {
    showToast('Passwords do not match!', 'error');
    return;
  }

  currentUser = {
    name: document.getElementById('reg-name').value,
    email: document.getElementById('reg-email').value,
    phone: document.getElementById('reg-phone').value
  };

  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('hospital-home').classList.remove('hidden');
  showToast('Account created successfully!', 'success');
  renderDoctors();
});

document.getElementById('staff-login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  isStaffLoggedIn = true;
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('staff-dashboard').classList.remove('hidden');
  showToast('Welcome to Staff Portal!', 'success');
  updateDashboardStats();
});

function logout() {
  currentUser = null;
  document.getElementById('hospital-home').classList.add('hidden');
  document.getElementById('auth-container').classList.remove('hidden');
  showPage('user-login');
  showToast('Logged out successfully', 'success');
}

function staffLogout() {
  isStaffLoggedIn = false;
  document.getElementById('staff-dashboard').classList.add('hidden');
  document.getElementById('auth-container').classList.remove('hidden');
  showPage('staff-login');
  showToast('Logged out successfully', 'success');
}

// Render Doctors
function renderDoctors() {
  const grid = document.getElementById('doctors-grid');
  if (!grid) return;

  grid.innerHTML = doctors.map(doctor => `
    <div class="card-hover bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="h-48 bg-gradient-to-br from-${doctor.color}-100 to-${doctor.color}-200 flex items-center justify-center relative">
        <div class="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg class="w-16 h-16 text-${doctor.color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow flex items-center gap-1">
          <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="font-semibold text-gray-800">${doctor.rating}</span>
        </div>
      </div>
      <div class="p-6">
        <div class="inline-flex items-center gap-1 bg-${doctor.color}-100 text-${doctor.color}-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
          ${doctor.specialization}
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">${doctor.name}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${doctor.description}</p>
        <div class="flex items-center justify-between">
          <span class="text-gray-500 text-sm">${doctor.reviews} reviews</span>
          <button onclick="openDoctorModal(${doctor.id})" class="btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Doctor Modal
function openDoctorModal(doctorId) {
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) return;

  const modal = document.getElementById('doctor-modal');
  const content = document.getElementById('doctor-modal-content');

  const starSVG = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  const fiveStars = starSVG.repeat(5);

  content.innerHTML = `
    <div class="relative">
      <div class="h-64 bg-gradient-to-br from-${doctor.color}-100 to-${doctor.color}-200 flex items-center justify-center">
        <div class="w-40 h-40 rounded-full bg-white shadow-xl flex items-center justify-center">
          <svg class="w-20 h-20 text-${doctor.color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      <button onclick="closeDoctorModal()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div class="p-8">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-${doctor.color}-100 text-${doctor.color}-700 px-4 py-1 rounded-full text-sm font-medium">${doctor.specialization}</span>
        <div class="flex items-center gap-1">
          <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <span class="font-semibold">${doctor.rating}</span>
          <span class="text-gray-500">(${doctor.reviews} reviews)</span>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">${doctor.name}</h2>
      <p class="text-gray-500 mb-6">${doctor.qualification}</p>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-50 rounded-xl p-4">
          <div class="text-sm text-gray-500 mb-1">Experience</div>
          <div class="font-bold text-gray-800">${doctor.experience}+ Years</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <div class="text-sm text-gray-500 mb-1">Patients</div>
          <div class="font-bold text-gray-800">${doctor.reviews * 10}+</div>
        </div>
      </div>
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">About</h3>
        <p class="text-gray-600">${doctor.description}</p>
      </div>
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-3">Availability</h3>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            ${doctor.availability}
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            ${doctor.time}
          </div>
        </div>
      </div>
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-3">Patient Reviews</h3>
        <div class="space-y-3">
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-semibold text-sm">JD</div>
              <span class="font-medium text-gray-800">John D.</span>
              <div class="flex text-amber-400 ml-auto">${fiveStars}</div>
            </div>
            <p class="text-gray-600 text-sm">Excellent doctor! Very professional and caring.</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-semibold text-sm">SM</div>
              <span class="font-medium text-gray-800">Sarah M.</span>
              <div class="flex text-amber-400 ml-auto">${fiveStars}</div>
            </div>
            <p class="text-gray-600 text-sm">Highly recommend! Took time to explain everything clearly.</p>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button onclick="openAppointmentModal('${doctor.name}')" class="btn-primary flex-1 py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Book Appointment
        </button>
        <button onclick="closeDoctorModal()" class="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
          Close
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeDoctorModal() {
  document.getElementById('doctor-modal').classList.add('hidden');
}

// Appointment Modal
function openAppointmentModal(doctorName) {
  closeDoctorModal();
  document.getElementById('appt-doctor-name').value = doctorName;
  document.getElementById('appt-doctor-display').value = doctorName;

  if (currentUser) {
    document.getElementById('appt-patient-name').value = currentUser.name || '';
    document.getElementById('appt-email').value = currentUser.email || '';
    document.getElementById('appt-phone').value = currentUser.phone || '';
  }

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('appt-date').setAttribute('min', today);

  document.getElementById('appointment-modal').classList.remove('hidden');
}

function closeAppointmentModal() {
  document.getElementById('appointment-modal').classList.add('hidden');
  document.getElementById('appointment-form').reset();
}

// Appointment Form Handler
document.getElementById('appointment-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (appointments.length >= 999) {
    showToast('Maximum appointment limit reached. Please contact us directly.', 'error');
    return;
  }

  const submitBtn = document.getElementById('appt-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Booking...';

  const appointmentData = {
    id: 'appt_' + Date.now(),
    type: 'appointment',
    patientName: document.getElementById('appt-patient-name').value,
    email: document.getElementById('appt-email').value,
    phone: document.getElementById('appt-phone').value,
    doctorName: document.getElementById('appt-doctor-name').value,
    date: document.getElementById('appt-date').value,
    time: document.getElementById('appt-time').value,
    symptoms: document.getElementById('appt-symptoms').value,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  if (window.dataSdk) {
    const result = await window.dataSdk.create(appointmentData);
    if (result.isOk) {
      showToast('Appointment booked successfully! We will contact you shortly.', 'success');
      closeAppointmentModal();
    } else {
      showToast('Failed to book appointment. Please try again.', 'error');
    }
  } else {
    appointments.push(appointmentData);
    showToast('Appointment booked successfully! We will contact you shortly.', 'success');
    closeAppointmentModal();
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Confirm Appointment';
});

// Dashboard Functions
function showDashboardSection(section) {
  document.getElementById('dashboard-overview').classList.add('hidden');
  document.getElementById('dashboard-appointments').classList.add('hidden');
  document.getElementById('dashboard-' + section).classList.remove('hidden');

  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.closest('.sidebar-item').classList.add('active');
}

function updateDashboardStats() {
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-cancelled').textContent = cancelled;
}

function renderRecentAppointments() {
  const container = document.getElementById('recent-appointments');
  if (!container) return;

  const recent = appointments.slice(-5).reverse();

  if (recent.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">No appointments yet</p>';
    return;
  }

  container.innerHTML = recent.map(appt => `
    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div>
          <div class="font-medium text-gray-800">${appt.patientName}</div>
          <div class="text-sm text-gray-500">${appt.doctorName} • ${appt.date}</div>
        </div>
      </div>
      <span class="status-badge status-${appt.status}">${appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</span>
    </div>
  `).join('');
}

function renderAppointmentsTable() {
  const tbody = document.getElementById('appointments-table');
  if (!tbody) return;

  const searchTerm = document.getElementById('search-appointments')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('filter-status')?.value || '';

  let filtered = appointments;

  if (searchTerm) {
    filtered = filtered.filter(a =>
      a.patientName.toLowerCase().includes(searchTerm) ||
      a.doctorName.toLowerCase().includes(searchTerm)
    );
  }

  if (statusFilter) {
    filtered = filtered.filter(a => a.status === statusFilter);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-gray-500">No appointments found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(appt => `
    <tr class="border-b hover:bg-gray-50">
      <td class="py-4 px-4">
        <div class="font-medium text-gray-800">${appt.patientName}</div>
        <div class="text-sm text-gray-500">${appt.email}</div>
      </td>
      <td class="py-4 px-4 text-gray-600">${appt.doctorName}</td>
      <td class="py-4 px-4 text-gray-600">${appt.date}</td>
      <td class="py-4 px-4 text-gray-600">${appt.time}</td>
      <td class="py-4 px-4">
        <span class="status-badge status-${appt.status}">${appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</span>
      </td>
      <td class="py-4 px-4">
        <div class="flex gap-2">
          ${appt.status === 'pending' ? `
            <button onclick="updateAppointmentStatus('${appt.__backendId || appt.id}', 'approved')" class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200">Approve</button>
            <button onclick="updateAppointmentStatus('${appt.__backendId || appt.id}', 'cancelled')" class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">Cancel</button>
          ` : appt.status === 'approved' ? `
            <button onclick="updateAppointmentStatus('${appt.__backendId || appt.id}', 'completed')" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">Complete</button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

async function updateAppointmentStatus(id, newStatus) {
  const appt = appointments.find(a => (a.__backendId || a.id) === id);
  if (!appt) return;

  if (window.dataSdk && appt.__backendId) {
    const updatedAppt = { ...appt, status: newStatus };
    const result = await window.dataSdk.update(updatedAppt);
    if (result.isOk) {
      showToast(`Appointment ${newStatus}!`, 'success');
    } else {
      showToast('Failed to update appointment', 'error');
    }
  } else {
    appt.status = newStatus;
    updateDashboardStats();
    renderAppointmentsTable();
    renderRecentAppointments();
    showToast(`Appointment ${newStatus}!`, 'success');
  }
}

// Search and Filter
document.getElementById('search-appointments')?.addEventListener('input', renderAppointmentsTable);
document.getElementById('filter-status')?.addEventListener('change', renderAppointmentsTable);

// Toast Function
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize
updateUI(defaultConfig);
renderDoctors();
