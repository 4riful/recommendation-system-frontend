"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Users, Lock, Sparkles } from "lucide-react";
import { FaWeixin, FaEnvelope, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LandingPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/getall`);
        setJobs(response.data.data.slice(0, 6)); // Fetch and display only the first 6 jobs
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Our advanced algorithms ensure you find the perfect job fit.",
    },
    {
      icon: Users,
      title: "Extensive Network",
      description: "Connect with top employers across various industries.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your data is protected with state-of-the-art security measures.",
    },
    {
      icon: Sparkles,
      title: "Career Growth",
      description: "Get personalized recommendations for skill development.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-base-100 text-neutral">
      {/* Header */}
<header className="sticky top-0 z-50 bg-neutral shadow-md">
  <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="text-3xl font-extrabold text-primary tracking-wide">
      CareerPulse
    </Link>

    {/* Navigation Links */}
    <div className="hidden md:flex items-center gap-6">
     
    </div>

    {/* Authentication Buttons */}
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-white hover:text-primary transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="btn btn-primary btn-sm shadow-md shadow-primary/20 hover:shadow-primary/30"
      >
        Get Started
      </Link>
    </div>

    {/* Mobile Menu Icon */}
    <button
      className="md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-primary hover:bg-primary/80"
      onClick={() => toggleMobileMenu()}
      aria-label="Open Menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>

  {/* Mobile Menu */}
  <div id="mobile-menu" className="hidden md:hidden bg-neutral p-6">
    <Link
      href="/login"
      className="block text-white mb-4 hover:text-primary"
    >
      Sign In
    </Link>
    <Link
      href="/register"
      className="btn btn-primary w-full text-center"
    >
      Get Started
    </Link>
  </div>
</header>


    

{/* Hero Section */}
<section className="relative bg-neutral text-white py-28">
  <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-6">
    {/* Left Content: Heading and Subtitle */}
    <div className="lg:w-1/2 text-center lg:text-left">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
        Welcome to <br />
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Driven JOB Platfrom
        </span>
      </h1>
      <p className="text-lg md:text-2xl text-accent mb-8 leading-relaxed">
        Empowering job seekers and employers with AI-driven recommendations.
      </p>
    </div>

    {/* Right Content: Interactive Code Block */}
    <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
      <div className="relative w-full max-w-lg bg-neutral rounded-lg p-6 shadow-lg">
        {/* Code Block */}
        <pre className="text-sm md:text-md font-mono text-white bg-black rounded-lg p-6 overflow-x-auto shadow-md">
          <code>
            {`const careerHub = () => {`}
            <br />
            {`  const opportunities = await fetch('/api/jobs');`}
            <br />
            {`  return opportunities.map((job) => (`}
            <br />
            {`    <div className="job-card">`}
            <br />
            {`      <h3 className="job-title">{job.title}</h3>`}
            <br />
            {`      <p>{job.description}</p>`}
            <br />
            {`    </div>`}
            <br />
            {`  ));`}
            <br />
            {`}`}
          </code>
        </pre>
        {/* Decorative Glow */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary to-primary blur-3xl opacity-20"></div>
      </div>
    </div>
  </div>

  {/* Stats Section */}
  <div className="container mx-auto mt-16 px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="p-6 bg-neutral rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold text-primary mb-2">1,000+</h3>
        <p className="text-white/80">Jobs Added Weekly</p>
      </div>
      <div className="p-6 bg-neutral rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold text-secondary mb-2">50K+</h3>
        <p className="text-white/80">Active Job Seekers</p>
      </div>
      <div className="p-6 bg-neutral rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold text-accent mb-2">2,500+</h3>
        <p className="text-white/80">Registered Employers</p>
      </div>
    </div>
  </div>
</section>
{/* Features Section */}
<section className="py-20 bg-neutral text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-4xl font-bold mb-12 text-primary">
      Why Choose CareerPulse
    </h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-base-100 p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform flex flex-col items-center justify-center text-center"
        >
          {/* Icon Section */}
          <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-6">
            <feature.icon className="w-8 h-8 text-neutral" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-semibold mb-4 text-accent">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>


{/* Latest Job Opportunities */}
<section className="py-20 bg-neutral text-white">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-extrabold mb-12 text-center text-primary">
      Explore Your Next Opportunity
    </h2>
    {loading ? (
      <div className="text-center">
        <span className="text-accent text-2xl font-semibold">Loading...</span>
      </div>
    ) : jobs.length === 0 ? (
      <p className="text-center text-secondary text-lg">
        No jobs available at the moment.
      </p>
    ) : (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <motion.div
            key={job.job_id}
            className="relative bg-base-100 rounded-xl p-6 shadow-md hover:shadow-2xl transition-shadow overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10 blur-lg group-hover:opacity-20 transition-opacity"></div>
            
            {/* Job Title */}
            <h3 className="text-2xl font-bold text-accent mb-2">
              {job.job_title}
            </h3>

            {/* Department */}
            <p className="text-lg font-semibold text-primary mb-4">
              {job.department}
            </p>

            {/* Salary Feature */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-secondary to-primary p-3 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-neutral"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                {job.salary}
              </span>
            </div>

            {/* Location */}
            <p className="text-sm text-gray-400 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline w-5 h-5 text-secondary mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.city}, {job.state}, {job.country}
            </p>

            {/* Footer: View Details */}
            <div className="flex justify-between items-center">
              <Link
                href={`/jobs/${job.job_id}`}
                className="btn btn-accent btn-sm px-4 font-semibold shadow-lg hover:shadow-xl"
              >
                View Details
              </Link>
              <span className="text-xs text-gray-500">
                Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
</section>
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-neutral to-gray-900 text-white text-center relative overflow-hidden">
  {/* Decorative Background Elements */}
  <div className="absolute top-0 left-0 w-64 h-64 bg-primary opacity-30 blur-3xl rounded-full -z-10"></div>
  <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent opacity-20 blur-3xl rounded-full -z-10"></div>

  <div className="container mx-auto px-6 relative z-10">
    <h2 className="text-5xl font-extrabold mb-6 leading-tight">
      Ready to <span className="text-secondary">Elevate</span> Your Career?
    </h2>
    <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
      Join thousands of professionals discovering new opportunities and landing their dream jobs with{" "}
      <span className="text-primary">CareerPulse</span>.
    </p>
    <div className="flex justify-center">
      <Link
        href="/register"
        className="btn btn-lg bg-accent text-neutral font-bold px-8 py-3 rounded-md shadow-md hover:scale-105 hover:shadow-lg hover:bg-accent/80 transition-transform"
      >
        Join Now
      </Link>
    </div>
  </div>
</section>



    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">CareerPulse</h3>
            <p className="text-sm text-gray-400">
              Connecting talent with opportunities through intelligent matching.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Search Jobs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-accent">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-accent">Follow Us</h4>
            <div className="flex items-center space-x-4">
              <Link href="https://wechat.com" target="_blank" rel="noopener noreferrer">
                <FaWeixin className="w-6 h-6 hover:scale-110 transition-transform text-accent" />
              </Link>
              <Link href="mailto:support@careerhub.com" target="_blank" rel="noopener noreferrer">
                <FaEnvelope className="w-6 h-6 hover:scale-110 transition-transform text-accent" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="w-6 h-6 hover:scale-110 transition-transform text-accent" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="w-6 h-6 hover:scale-110 transition-transform text-accent" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 hover:scale-110 transition-transform text-accent" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} CareerPulse. All rights reserved.
          </p>
          <p className="mt-2">
            Built with ❤️ for connecting talent and opportunity.
          </p>
        </div>
      </div>
    </footer>

    </div>
  );
}
