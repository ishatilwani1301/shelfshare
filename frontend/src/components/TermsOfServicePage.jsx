import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header  from './Header'; // Assuming your Navbar component path
import Footer from './Footer'; // Assuming your Footer component path

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header /> {/* Add the Navbar component here */}

      <main className="flex-grow flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
            <h1 className="text-3xl font-extrabold text-[#171612]">Terms of Service</h1>
            <button
              onClick={() => navigate(-1)} // Navigates back to the previous page
              className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
            >
              &larr; Go Back
            </button>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              Please read these terms and conditions carefully before using Our Service.
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
                <strong>Content</strong> refers to content such as text, images, or other information
                that can be posted, uploaded, linked to, or otherwise made available by You,
                regardless of the form of that content.
              </li>
              <li>
                <strong>Country</strong> refers to: Haryana, India
              </li>
              <li>
                <strong>Device</strong> means any device that can access the Service such as a
                computer, a cellphone or a digital tablet.
              </li>
              <li>
                <strong>Feedback</strong> means feedback, innovations or suggestions sent by You
                regarding the attributes, performance or features of our Service.
              </li>
              <li>
                <strong>Service</strong> refers to the Website.
              </li>
              <li>
                <strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and
                Conditions that form the entire agreement between You and the Company regarding the
                use of the Service.
              </li>
              <li>
                <strong>Third-party Social Media Service</strong> means any services or content
                (including data, information, products or services) provided by a third-party that
                may be displayed, included or made available by the Service.
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

            <h2 className="text-2xl font-semibold text-[#171612] mt-8 mb-4">Acknowledgement</h2>
            <p className="mb-4">
              These are the Terms and Conditions governing the use of this Service and the agreement
              that operates between You and the Company. These Terms and Conditions set out the
              rights and obligations of all users regarding the use of the Service.
            </p>
            <p className="mb-4">
              Your access to and use of the Service is conditioned on Your acceptance of and
              compliance with these Terms and Conditions. These Terms and Conditions apply to all
              visitors, users and others who access or use the Service.
            </p>
            {/* Add more sections like:
              - Links to Other Websites
              - Termination
              - Limitation of Liability
              - "AS IS" and "AS AVAILABLE" Disclaimer
              - Governing Law
              - Disputes Resolution
              - For European Union (EU) Users
              - United States Legal Compliance
              - Severability
              - Waiver
              - Translation Interpretation
              - Changes to These Terms and Conditions
              - Contact Us
            */}
            <p className="mt-8 text-sm text-gray-500">
              These Terms of Service were last updated on June 13, 2025.
            </p>
          </div>
        </div>
      </main>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
};

export default TermsOfServicePage;