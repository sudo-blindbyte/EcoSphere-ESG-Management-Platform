# 🌿 EcoSphere: Enterprise ESG & Gamification Management Platform

EcoSphere is a premium, real-time, full-stack enterprise web application designed to help corporations manage, track, and optimize their **Environmental, Social, and Governance (ESG)** performance. It blends deep analytics with an interactive **Gamification Engine** to encourage employee participation in green initiatives, award XP, unlock badges, and redeem eco-merchandise.

---

## 🚀 Key Modules & Capabilities

### 1. 📈 Executive Dashboard
*   **Real-time Intelligence KPIs**: Visualizes overall weighted ESG scores alongside individual Environmental, Social, and Governance category scores.
*   **Corporate Leaderboard**: Tracks top ESG champions in the company ranking employees dynamically by their earned XP.
*   **Goal Progression Gauges**: Provides quick indicators of active target goals, completed audits, and outstanding compliance logs.

### 2. ☘️ Environmental (Decarbonization Goals)
*   **Decarbonization Targets Tracking**: Displays real-time progress indicators for critical carbon emission metrics.
*   **Progress Slider Adjustments**: Allows authorized administrators and managers to update progress values directly, which instantly updates charts.

### 3. 🤝 Social (CSR & Community Volunteering)
*   **Volunteering Registry**: Employees can browse and register for scheduled corporate CSR events (e.g. Beach Cleanup drives, Tree Plantations).
*   **Registry Review Audit**: Managers can review employee participation submissions and click **Approve** or **Reject** to award points.
*   **Evidence Verification**: Satisfies schema criteria by registering placeholder proofs when approvals occur.

### 4. ⚖️ Governance (Policies & Audits)
*   **Compliance Incident Log**: Logs incidents and breaches, assigns ownership, schedules resolution deadlines, and tracks status.
*   **ESG Verification Audits**: Manages audit sessions, target departments, and schedules.
*   **Corporate Policies Acknowledgment**: Promotes regulatory awareness. Employees can click **Acknowledge** on drafted policies to earn a quick 25 XP.

### 5. 🏆 Gamification Engine (Challenges & Rewards)
*   **Joined Challenges Dashboard**: Employees can track active challenges, input progress percentages, and upload verification links (e.g., Strava logs, photo URLs).
*   **Auto-Awarded Achievement Badges**: Unlocks badges dynamically (e.g. *Green Warrior*, *Earth Saver*) as employees reach cumulative XP thresholds.
*   **Eco-Rewards Marketplace**: Employees can spend earned XP to redeem eco-friendly catalog items (e.g. Reusable Bamboo Water Bottle).
*   **Dynamic Creation Panels**: Administrators can create new challenges, badges, and rewards directly from the UI.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), React Router DOM (v6), Vanilla CSS (Custom design system variables with vibrant dark mode aesthetics).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose Schema Object Modeler).

---

## ⚙️ Project Setup & Installation

### Prerequisites
*   Node.js (v16+)
*   MongoDB running locally (`mongodb://localhost:27017/ecosphere`)

---

### Step 1: Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by checking the `.env` file:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/ecosphere
    JWT_SECRET=supersecretjwtkeyforecosphere
    ```
4.  **Seed the Database** (Loads default ESG goals, challenges, badges, rewards, and departments):
    ```bash
    npm run seed
    ```
5.  Start the backend development server:
    ```bash
    npm run dev
    ```

---

### Step 2: Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite frontend development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:3000` (or `http://localhost:3001` as configured by Vite).

---

## 🔑 Seeding / Demo Credentials

Use the following pre-seeded test accounts to demonstrate different role-based views (Standard Employee vs. Admin):

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ecosphere.com` | `admin0852` | Full access to settings, CSR approvals, compliance logs, policy publishing, and challenge creations. |
| **Employee** | `employee@ecosphere.com` | `employeepassword` | Access to join challenges, update task progress, register for CSR events, acknowledge policies, and spend XP on marketplace items. |
| **Employee 2** | `harsh@email.com` | `harsh@1122` | Another pre-seeded employee account to test dashboard leaderboards and registrations. |
