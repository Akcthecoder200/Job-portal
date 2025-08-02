import React from "react";
import {
  Briefcase,
  User,
  Wallet,
  Cpu,
  Code,
  Brush,
  Zap,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Smartphone,
  MapPin,
  DollarSign,
  Target,
  Sparkles,
  RefreshCcw,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

// The main App component representing the entire landing page.
export default function MainLayout() {
  const Navigate = useNavigate();
  const sections = [
    { id: "features", text: "Features" },
    { id: "tech-stack", text: "Tech Stack" },
    { id: "about", text: "About" },
    { id: "contact", text: "Contact" },
  ];

  // Function to handle smooth scrolling to a section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 antialiased">
      {/* Navbar - Fixed at the top for easy navigation */}
      <nav className="fixed w-full z-50 bg-white shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">JobPortal</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section.id);
                }}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                {section.text}
              </a>
            ))}
          </div>

          {/* Call to Action Button */}
          <button
            onClick={() => Navigate("/login")}
            className="hidden md:block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-20 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Connecting Talent with Tomorrow's Jobs, Powered by Blockchain & AI
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl">
            Our job portal revolutionizes hiring with secure, transparent
            payments and intelligent matching. Find your next opportunity or
            hire your next star employee with confidence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </div>
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Powerful Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From seamless user management to AI-powered matching, we've built
            the tools to help you succeed.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1: Authentication & Profile Management */}
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                User Authentication & Profiles
              </h3>
              <p className="mt-2 text-gray-600 text-center">
                Secure user registration and login with JWT/sessions. Create
                rich profiles with manual or AI-extracted skills and connect
                your public wallet address.
              </p>
            </div>
            {/* Feature Card 2: Job Posting + Feed */}
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Job Posting & Dynamic Feed
              </h3>
              <p className="mt-2 text-gray-600 text-center">
                Post jobs with detailed requirements and a transparent budget.
                Browse a real-time job feed with powerful filters for skills,
                location, and tags.
              </p>
            </div>
            {/* Feature Card 3: Blockchain Payment Integration */}
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                <Wallet className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Blockchain Payment Integration
              </h3>
              <p className="mt-2 text-gray-600 text-center">
                Pay platform fees directly from your MetaMask or Phantom wallet.
                Job posting is enabled only after a successful and verified
                on-chain transaction.
              </p>
            </div>
            {/* Feature Card 4: AI Enhancements */}
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                AI-Powered Enhancements
              </h3>
              <p className="mt-2 text-gray-600 text-center">
                Leverage AI for smart job-applicant matching, automated skill
                extraction from resumes, and personalized job recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI & Blockchain in Detail Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* AI Enhancements */}
            <div>
              <div className="text-center md:text-left">
                <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Intelligent AI Enhancements
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  Our platform goes beyond traditional job boards by integrating
                  cutting-edge AI to make your experience smarter and more
                  efficient.
                </p>
              </div>
              <div className="mt-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-2 rounded-full">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Job-Applicant Matching
                    </h4>
                    <p className="mt-1 text-gray-600">
                      An NLP model analyzes job descriptions and candidate bios
                      to provide a 'match score', ensuring you see the most
                      relevant opportunities or applicants.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-2 rounded-full">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Resume Skill Extraction
                    </h4>
                    <p className="mt-1 text-gray-600">
                      Save time and effort. Our AI parses uploaded resumes and
                      bios to automatically fill in the top skills on your
                      profile.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-2 rounded-full">
                    <RefreshCcw className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Smart Suggestions
                    </h4>
                    <p className="mt-1 text-gray-600">
                      Receive personalized job recommendations and connection
                      suggestions based on your profile and interactions,
                      helping you grow your network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Blockchain Integration */}
            <div>
              <div className="text-center md:text-left">
                <div className="inline-block p-3 rounded-full bg-green-100 text-green-600 mb-4">
                  <Wallet className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Transparent Blockchain Payments
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  We've built a trustless system for payments, ensuring security
                  and transparency for every transaction.
                </p>
              </div>
              <div className="mt-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-2 rounded-full">
                    <Link className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Connect Your Wallet
                    </h4>
                    <p className="mt-1 text-gray-600">
                      Seamlessly connect your MetaMask or Phantom wallet to our
                      platform with a single click.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-2 rounded-full">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Secure Platform Fees
                    </h4>
                    <p className="mt-1 text-gray-600">
                      Before posting a job, securely pay a small platform fee
                      (e.g., 0.01 SOL) to the admin wallet. The transaction is
                      confirmed on the blockchain.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Guaranteed Submission
                    </h4>
                    <p className="mt-1 text-gray-600">
                      Job posting is only enabled after a successful, verified,
                      and immutable blockchain transaction, ensuring a secure
                      process for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Modern Technology Stack
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern, robust, and scalable technologies to ensure a
            fast and reliable experience.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="text-indigo-600 mb-4">
                <Wallet className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Blockchain
              </h3>
              <p className="mt-2 text-gray-600 text-center">
                We use blockchain for secure, transparent transactions and
                verifiable payment history, building a foundation of trust.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="text-indigo-600 mb-4">
                <Lightbulb className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Generative AI
              </h3>
              <p className="mt-2 text-gray-600 text-center">
                Our AI models power intelligent features like resume skill
                extraction and smart job recommendations to enhance your
                experience.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="text-indigo-600 mb-4">
                <Code className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">React.js</h3>
              <p className="mt-2 text-gray-600 text-center">
                A flexible and robust front-end library used to build the
                dynamic, responsive, and modern user interface of our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our mission is to create a more equitable and transparent hiring
            ecosystem. By leveraging the power of blockchain and artificial
            intelligence, we aim to eliminate traditional barriers, foster
            trust, and connect skilled professionals with forward-thinking
            companies. We believe in a future where talent is matched not just
            by keywords, but by true skill and potential, and where every
            transaction is secure and verifiable.
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Get In Touch
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or want to learn more? Feel free to reach out to us.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Contact Form (Placeholder) */}
            <form className="bg-gray-100 p-8 rounded-lg shadow-md max-w-lg mx-auto">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
            </form>

            {/* Contact Information */}
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center space-x-4 justify-center md:justify-start">
                <div className="bg-gray-200 p-3 rounded-full text-indigo-600">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-gray-700">akchoudhary2411@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4 justify-center md:justify-start">
                <div className="bg-gray-200 p-3 rounded-full text-indigo-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-4 justify-center md:justify-start">
                <div className="bg-gray-200 p-3 rounded-full text-indigo-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-gray-700">jalore, Rajasthan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// CSS for the animated blobs in the hero section
const style = `
  @keyframes blob {
    0% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0, 0) scale(1);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

// Add the style to the document head
document.head.appendChild(document.createElement("style")).textContent = style;
