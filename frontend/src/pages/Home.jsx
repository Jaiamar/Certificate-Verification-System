import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiSearch, FiDownload } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Students"
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
            Verify Your Success
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-indigo-100 text-center">
            A secure and reliable platform for authenticating internship certificates. Quickly verify documents, showcase your achievements, and download high-quality certificates online.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/search"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to authenticate
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Our certificate verification system ensures total transparency and authenticity for students and employers alike.
            </p>
          </div>

          <div className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden divide-y divide-gray-200 lg:divide-y-0 lg:divide-x lg:flex">
            <div className="p-8 lg:w-1/3 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                <FiSearch className="text-white text-2xl" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Instant Verification</h3>
              <p className="mt-4 text-base text-gray-500">
                Enter your unique Certificate ID to instantly verify the authenticity of your document in our database.
              </p>
            </div>
            <div className="p-8 lg:w-1/3 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                <FiDownload className="text-white text-2xl" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Digital Copies</h3>
              <p className="mt-4 text-base text-gray-500">
                Download a high-quality PDF version of your certificate anytime, anywhere.
              </p>
            </div>
            <div className="p-8 lg:w-1/3 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Secure & Reliable</h3>
              <p className="mt-4 text-base text-gray-500">
                Data is securely stored and protected. Our system ensures tamper-proof verification for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
