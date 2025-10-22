import React, { useEffect } from 'react';
import Card from '../components/Card';

interface DevDetailsPageProps {
  onBack: () => void;
}

const DevDetailsPage: React.FC<DevDetailsPageProps> = ({ onBack }) => {
  // FIX: Ensure the page scrolls to the top when it's rendered.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <main className="w-full flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-3xl relative">
          <div className="absolute top-4 right-4">
            <button onClick={onBack} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">
              Back to Login
            </button>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Development & Technology Stack</h2>
          <div className="space-y-8 text-slate-700 text-base leading-relaxed pr-4 max-h-[80vh] overflow-y-auto">
            
            <section>
              <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3">Project Leadership</h3>
              <p><strong>Lead Developer:</strong> <b>Sarath</b></p>
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
        </Card>
      </main>
      <footer className="w-full text-center text-slate-500 text-sm p-4 mt-8">
        <span className="mx-2">© 2025</span>
      </footer>
    </div>
  );
};

export default DevDetailsPage;