import React from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar'; // Assuming your Navbar component path
import Footer from './Footer'; // Assuming your Footer component path
import Header from './Header';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header /> {/* Add the Navbar component here */}

      <main className="flex-grow flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
            <h1 className="text-3xl font-extrabold text-[#171612]">Privacy Policy</h1>
            <button
              onClick={() => navigate(-1)} // Navigates back to the previous page
              className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
            >
              &larr; Go Back
            </button>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              This Privacy Policy describes Our policies and procedures on the collection, use and
              disclosure of Your information when You use the Service and tells You about Your
              privacy rights and how the law protects You.
            </p>

            <h2 className="text-2xl font-semibold text-[#171612] mt-8 mb-4">
              Interpretation and Definitions
            </h2>
            <h3 className="text-xl font-medium text-[#171612] mb-2">Interpretation</h3>
            <p className="mb-4">
              The words of which the initial letter is capitalized have meanings defined under the
              following conditions. The following definitions shall have the same meaning regardless
              of whether they appear in singular or in plural.
            </p>
            <h3 className="text-xl font-medium text-[#171612] mb-2">Definitions</h3>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Account</strong> means a unique account created for You to access our Service
                or parts of our Service.
              </li>
              <li>
                <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in
                this Agreement) refers to ShelfShare.
              </li>
              <li>
                <strong>Cookies</strong> are small files that are placed on Your computer, mobile
                device or any other device by a website, containing the details of Your Browse
                history on that website among its many uses.
              </li>
              <li>
                <strong>Country</strong> refers to: Haryana, India
              </li>
              <li>
                <strong>Device</strong> means any device that can access the Service such as a
                computer, a cellphone or a digital tablet.
              </li>
              <li>
                <strong>Personal Data</strong> is any information that relates to an identified or
                identifiable individual.
              </li>
              <li>
                <strong>Service</strong> refers to the Website.
              </li>
              <li>
                <strong>Service Provider</strong> means any natural or legal person who processes the
                data on behalf of the Company. It refers to third-party companies or individuals
                employed by the Company to facilitate the Service, to provide the Service on behalf
                of the Company, to perform services related to the Service or to assist the Company
                in analyzing how the Service is used.
              </li>
              <li>
                <strong>Usage Data</strong> refers to data collected automatically, either generated
                by the use of the Service or from the Service infrastructure itself (for example,
                the duration of a page visit).
              </li>
              <li>
                <strong>Website</strong> refers to ShelfShare, accessible from{' '}
                <a href="https://www.shelfshare.com" className="text-blue-600 hover:underline">
                  https://www.shelfshare.com
                </a>{' '}
                (or your actual domain).
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the Service, or the
                company, or other legal entity on behalf of which such individual is accessing or
                using the Service, as applicable.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#171612] mt-8 mb-4">
              Collecting and Using Your Personal Data
            </h2>
            <h3 className="text-xl font-medium text-[#171612] mb-2">Types of Data Collected</h3>
            <h4 className="text-lg font-semibold text-[#171612] mb-2">Personal Data</h4>
            <p className="mb-4">
              While using Our Service, We may ask You to provide Us with certain personally
              identifiable information that can be used to contact or identify You. Personally
              identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Usage Data</li>
            </ul>

            <h4 className="text-lg font-semibold text-[#171612] mb-2">Usage Data</h4>
            <p className="mb-4">
              Usage Data is collected automatically when using the Service.
              Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address),
              browser type, browser version, the pages of our Service that You visit, the time and date of Your visit,
              the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
            {/* Add more sections like:
              - Use of Your Personal Data
              - Disclosure of Your Personal Data
              - Retention of Your Personal Data
              - Transfer of Your Personal Data
              - Delete Your Personal Data
              - Disclosure for Law Enforcement
              - Other Legal Requirements
              - Security of Your Personal Data
              - Children's Privacy
              - Links to Other Websites
              - Changes to this Privacy Policy
              - Contact Us
            */}
            <p className="mt-8 text-sm text-gray-500">
              This Privacy Policy was last updated on June 13, 2025.
            </p>
          </div>
        </div>
      </main>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
};

export default PrivacyPolicyPage;