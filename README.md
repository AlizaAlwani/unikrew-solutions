# HR Portal Web Application
This project is a web application developed for the HR department to manage employee salary information efficiently. It enables HR personnel to upload Excel files, automatically parse the data, generate individual salary slips in PDF format, and email these PDFs to the respective employees.

### Features
1. Excel Upload: Upload Excel files containing employee salary data.
2. Data Parsing: Automatically parses the uploaded files to extract salary information.
3. PDF Generation: Generates salary slips in PDF format for each employee.
4. Email Functionality: Sends the generated salary slips via email.
5. Database: Uses NeonDB (PostgreSQL) for storing employee data.
6. CI/CD: GitHub Actions are used for continuous integration and deployment.
7. Deployment: Deployed on Vercel for easy access and scalability.

## Getting Started

### Prerequisites
-> Node.js
-> PNPM
-> Git
-> NeonDB PostgreSQL

### Installation

1. Clone the repository:

git clone https://github.com/AlizaAlwani/unikrew-solutions.git
cd unikrew-solutions

2. Install dependencies:

pnpm install and ensure all the prerequisites are installed as well.

3. Set up the environment:

Configure your .env file with the necessary database credentials.

4. Run the development server:

pnpm dev
The application should now be running on http://localhost:3000.

### Deployment
The application is deployed using Vercel. 

To deploy:
1. Link your GitHub repository to Vercel.
2. Set up environment variables in Vercel as required.
3. Vercel will handle automatic deployments for every push to the main branch.

### Deployed Link:
https://unikrew-solutions-hr.vercel.app/