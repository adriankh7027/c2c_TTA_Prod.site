import React, { useState, useEffect } from 'react';
import Card from '../components/Card';

interface AboutPageProps {
  onBack: () => void;
}

const ProductDetailsContent: React.FC = () => (
    <>
        <br></br>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">C2C Trip Planner: A Comprehensive Guide</h2>
        <div className="space-y-6 text-slate-700 text-base leading-relaxed pr-4">
        
        <section>
            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">General & Login</h3>
            <ul className="list-disc list-inside space-y-2">
            <li><strong>Dual Login Modes:</strong> The login screen can appear in two ways, controlled by the System Admin for security.
                <ul className="list-['-_'] list-inside ml-6 mt-1">
                    <li><strong>List View:</strong> A visual grid of user profiles. Convenient but less private.</li>
                    <li><strong>Form View:</strong> A standard login form asking for your Name/Email and PIN. More secure.</li>
                </ul>
            </li>
            <li><strong>PIN Security:</strong> All accounts are protected by a 4-digit PIN. After selecting your profile or entering your name, you must enter your PIN to log in.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">User Dashboard</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-lg font-bold text-indigo-700">Trip Planning (Calendar)</h4>
                    <p>Navigate through months, click on dates to select/deselect your available travel days. Holidays are marked in red. Submit your plan for the month, and feel free to update it later as needed.</p>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-indigo-700">My Travel Schedule</h4>
                    <p>This card is your finalized trip summary. It shows who is the designated <strong>Booker</strong> (responsible for making bookings) for each trip, who you're <strong>Traveling With</strong>, and the <strong>Trip Type</strong> (e.g., Departure/Arrival).</p>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-indigo-700">My Monthly Expense</h4>
                    <p>Get a quick estimate of your personal trip-related costs for the month, calculated as: (Number of your bookings) x (Trip Price set by Admin).</p>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-indigo-700">Profile Management</h4>
                    <p>Click your name in the header to edit your profile. You can update your name and email. You can also change your 4-digit PIN here for security by verifying your current PIN first.</p>
                </div>
            </div>
        </section>

        <section>
            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">Allocation Admin Dashboard</h3>
            <div className="space-y-4">
            <div>
                <h4 className="text-lg font-bold text-indigo-700">Interface & Navigation</h4>
                <p>The dashboard features a minimizable sidebar (it starts minimized). When collapsed, hover over icons to see tooltips for 'Allocations' or 'Calendar'.</p>
            </div>
            <div>
                <h4 className="text-lg font-bold text-indigo-700">Allocations View</h4>
                <p>This is your main control panel. Review <strong>Submitted Plans</strong> for the relevant month (current or upcoming, based on a system setting). Click <strong>Allocate Bookings</strong> to run the automated, fair assignment process. The finalized <strong>Master Schedule</strong> shows all details. If a user updates their plan after allocation, a prominent <strong>warning</strong> will appear, prompting you to re-allocate.</p>
            </div>
            <div>
                <h4 className="text-lg font-bold text-indigo-700">Calendar View</h4>
                <p>Manage global holidays here. Select dates on the calendar and click 'Update Calendar' to mark them as non-working days for everyone, preventing them from being selected in plans.</p>
            </div>
            </div>
        </section>

        <section>
            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">System Admin Dashboard</h3>
            <div className="space-y-4">
            <div>
                <h4 className="text-lg font-bold text-indigo-700">User Management</h4>
                <p>The central hub for all user accounts. You can <strong>Add</strong>, <strong>Edit</strong>, or <strong>Delete</strong> users. For each user, you can set their Name, Email, Role (User, Admin, etc.), and their 'Send Email' preference.</p>
            </div>
            <div>
                <h4 className="text-lg font-bold text-indigo-700">System Settings</h4>
                <p>Customize the app's core behavior:
                <ul className="list-disc list-inside ml-6 mt-1">
                    <li><strong>Trip Labels:</strong> Change the text for 'Departure' and 'Arrival'.</li>
                    <li><strong>Trip Price:</strong> Set the cost per trip used for expense calculations.</li>
                    <li><strong>Allocate For Current Month:</strong> A crucial toggle that controls the planning cycle. When ON, the admin manages the current month. When OFF, they manage the upcoming month.</li>
                    <li><strong>User List View:</strong> Toggles the main login screen between the visual user grid and the secure name/PIN form.</li>
                </ul>
                </p>
            </div>
            </div>
        </section>
        </div>
    </>
);

const DevDetailsContent: React.FC = () => (
    <>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Development & Technology Stack</h2>
        <div className="space-y-8 text-slate-700 text-base leading-relaxed pr-4">
            <section>
                <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3">Project Leadership</h3>
                <p><strong>Lead Developer:</strong> Sarath</p>
                <p><strong>AI Collaboration:</strong> Google Gemini API was integral for AI-assisted code generation, architectural refactoring, feature implementation, and UI/UX enhancements.</p>
            </section>
            <section>
                <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3">Frontend Technology Stack</h3>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>Core Framework:</strong> React (v19+)</li>
                    <li><strong>Language:</strong> TypeScript</li>
                    <li><strong>Build Tool:</strong> Vite for fast, modern development and bundling.</li>
                    <li><strong>Styling:</strong> Tailwind CSS, utility-first for a fully responsive, mobile-first design.</li>
                    <li><strong>Architecture:</strong> Modular, component-based structure (e.g., Cards, Headers, Calendars) for reusability and maintainability.</li>
                    <li><strong>State Management:</strong> Native React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) for efficient and localized state control.</li>
                    <li><strong>API Communication:</strong> Browser `fetch` API for asynchronous communication with the backend.</li>
                </ul>
            </section>
            <section>
                <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3">Backend Technology Stack</h3>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>Framework:</strong> .NET 8 Web API</li>
                    <li><strong>Language:</strong> C# 12</li>
                    <li><strong>API Design:</strong> RESTful architecture following standard HTTP conventions.</li>
                    <li><strong>Authentication:</strong> Custom PIN-based authentication and user session management.</li>
                    <li><strong>ORM:</strong> Entity Framework Core for data access and object-relational mapping.</li>
                    <li><strong>API Documentation:</strong> Swagger (OpenAPI) for interactive API documentation and testing during development.</li>
                </ul>
            </section>
            <section>
                <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3">Database</h3>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>System:</strong> Microsoft SQL Server (MSSQL)</li>
                    <li><strong>Schema Management:</strong> EF Core Migrations for version-controlled, automated database schema updates.</li>
                    <li><strong>Design:</strong> Normalized relational database schema to ensure data integrity and minimize redundancy.</li>
                </ul>
            </section>
            <section>
                <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3">Hosting & DevOps</h3>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>Backend Hosting:</strong> Deployed as a scalable <strong>Microsoft Azure App Service</strong>.</li>
                    <li><strong>Frontend Hosting:</strong> Hosted on <strong>Netlify</strong>, benefiting from its global CDN and CI/CD integration.</li>
                    <li><strong>Version Control:</strong> Git, managed through a repository on GitHub.</li>
                    <li><strong>CI/CD (Continuous Integration/Continuous Deployment):</strong>
                        <ul className="list-['-_'] list-inside ml-6 mt-1">
                            <li><strong>Frontend:</strong> Automated builds and deployments triggered by pushes to the `main` branch via Netlify's integration with GitHub.</li>
                            <li><strong>Backend:</strong> Automated build and deployment pipeline using Azure DevOps or GitHub Actions to publish to the Azure App Service.</li>
                        </ul>
                    </li>
                </ul>
            </section>
        </div>
    </>
);

const ContactUsContent: React.FC = () => (
    <>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Contact Us</h2>
        <div className="space-y-8 text-slate-700 text-base leading-relaxed pr-4">
            <section>
                <p className="mb-6">
                    We'd love to hear from you! Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-lg border">
                        <h4 className="text-lg font-bold text-indigo-700 mb-2">General Inquiries</h4>
                        <p><strong>Email:</strong> <a href="mailto:c2c.tta@gmail.com" className="text-indigo-600 hover:underline">c2c.tta@gmail.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+1-800-555-0199" className="text-indigo-600 hover:underline">+1 (800) 555-0199</a></p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-lg border">
                        <h4 className="text-lg font-bold text-indigo-700 mb-2">Technical Support</h4>
                        <p><strong>Email:</strong> <a href="mailto:support.c2c.tta@gmail.com" className="text-indigo-600 hover:underline">support.c2c.tta@gmail.com</a></p>
                        <p><strong>Status Page:</strong> <a href="#" className="text-indigo-600 hover:underline">status.c2ctripplanner.com</a></p>
                    </div>
                </div>
            </section>
            <section>
                <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Our Office</h3>
                <p><strong>C2C Trip Planner Inc.</strong></p>
                <p>123 Innovation Drive</p>
                <p>Tech Park, Suite 450</p>
                <p>Metropolis, CA 90210</p>
            </section>
        </div>
    </>
);


const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  type ActiveTab = 'product' | 'dev' | 'contact';
  const [activeTab, setActiveTab] = useState<ActiveTab>('product');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const NavItem = ({ label, tabName }: { label: string; tabName: ActiveTab }) => (
      <li 
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-3 rounded-lg cursor-pointer font-semibold transition-colors ${activeTab === tabName ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
      >
          {label}
      </li>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <main className="w-full flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-6xl relative">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onBack} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">
              Back to Login
            </button>
          </div>
          <div className="flex">
            <aside className="w-1/4 pr-8 border-r border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 pl-4">About</h2>
                <ul className="space-y-2">
                    <NavItem label="Product" tabName="product" />
                    <NavItem label="Development" tabName="dev" />
                    <NavItem label="Contact Us" tabName="contact" />
                </ul>
            </aside>
            <div className="w-3/4 pl-8 max-h-[80vh] overflow-y-auto">
                {activeTab === 'product' && <ProductDetailsContent />}
                {activeTab === 'dev' && <DevDetailsContent />}
                {activeTab === 'contact' && <ContactUsContent />}
            </div>
          </div>
        </Card>
      </main>
      <footer className="w-full text-center text-slate-500 text-sm p-4 mt-8">
        <span className="mx-2">© 2025</span>
      </footer>
    </div>
  );
};

export default AboutPage;
