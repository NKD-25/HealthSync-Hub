import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <img 
              src="/images/logo-full.png" 
              alt="Chikitsa" 
              className="h-12 object-contain"
            />
          </Link>

          <div className="flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-teal-600 font-medium transition">Features</a>
            <a href="#about" className="text-gray-600 hover:text-teal-600 font-medium transition">About</a>
            <Link
              to="/login"
              className="text-gray-600 hover:text-teal-600 font-medium transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup/hospital"
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                ✨ Modern Healthcare Management
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Seamless Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">Management Platform</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Connect hospitals, doctors, and patients in one unified platform. Streamline medical records, appointments, and patient care with Chikitsa.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/signup/hospital"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold shadow-lg flex items-center space-x-2"
                >
                  <span>🏥</span>
                  <span>Register Hospital</span>
                </Link>

                <Link
                  to="/signup/doctor"
                  className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg hover:bg-teal-50 transition font-semibold flex items-center space-x-2"
                >
                  <span>👨‍⚕️</span>
                  <span>Join as Doctor</span>
                </Link>
              </div>

              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-teal-600">500+</p>
                  <p className="text-gray-600">Healthcare Providers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600">50K+</p>
                  <p className="text-gray-600">Active Patients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600">24/7</p>
                  <p className="text-gray-600">Support Available</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-teal-200 rounded-3xl blur-3xl opacity-50"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 flex items-center justify-center">
                <img 
                  src="/images/logo-full.png" 
                  alt="Chikitsa Logo" 
                  className="w-64 h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Healthcare
            </h2>
            <p className="text-xl text-gray-600">Everything you need to manage healthcare efficiently</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Medical Records</h3>
              <p className="text-gray-600">Secure, centralized medical records accessible to authorized healthcare providers anytime, anywhere.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                📅
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Scheduling</h3>
              <p className="text-gray-600">Automated appointment scheduling with real-time notifications and reminders for all parties.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                💊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Prescription Management</h3>
              <p className="text-gray-600">Digital prescriptions with automatic pharmacy integration and delivery tracking.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Security</h3>
              <p className="text-gray-600">Enterprise-grade encryption and HIPAA-compliant infrastructure for patient data protection.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Ready</h3>
              <p className="text-gray-600">Fully responsive design works seamlessly on desktop, tablet, and mobile devices.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics & Reports</h3>
              <p className="text-gray-600">Comprehensive dashboards and reports for better insights into patient care and operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-8xl mx-20 px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Chikitsa Works
            </h2>
          </div>

         <div className="grid md:grid-cols-3 gap-x-20 gap-y-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">Hospital, doctor, or patient registers on the platform</p>
            </div>

            

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verify</h3>
              <p className="text-gray-600">Admin approval and verification of credentials</p>
            </div>


            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Start managing healthcare records and appointments</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tailored for Every Role
            </h2>
            <p className="text-xl text-gray-600">Specialized features for hospitals, doctors, and patients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-green-200 rounded-2xl p-8 hover:border-green-600 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center text-4xl mb-6">
                🏥
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Hospitals</h3>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Admin dashboard & staff management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Patient record management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Resource optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Analytics & reporting</span>
                </li>
              </ul>
              <Link
                to="/signup/hospital"
                className="w-47 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold text-center"
              >
                Register Hospital
              </Link>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-600 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-4xl mb-6">
                👨‍⚕️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Doctors</h3>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>Patient records access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>Appointment scheduling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>Digital prescriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>Patient communication</span>
                </li>
              </ul>
              <Link
                to="/signup/doctor"
                className="w-full px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition font-semibold text-center"
              >
                Join as Doctor
              </Link>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 hover:border-purple-600 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-4xl mb-6">
                🧑‍⚕️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Patients</h3>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="text-purple-600">✓</span>
                  <span>Access medical records</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-600">✓</span>
                  <span>Book appointments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-600">✓</span>
                  <span>View prescriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-600">✓</span>
                  <span>Health tracking</span>
                </li>
              </ul>
              <Link
                to="/signup/patient"
                className="w-full px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-center"
              >
                Register as Patient
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of healthcare providers already using Chikitsa to improve patient care.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/signup/hospital"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Get Started Now
            </Link>
            <a
              href="#features"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-teal-600 transition font-semibold"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
               
                <span className="text-white font-bold text-xl">Chikitsa</span>
              </div>
              <p className="text-sm">Modern Healthcare Management Platform</p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#about" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">HIPAA</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Chikitsa. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
