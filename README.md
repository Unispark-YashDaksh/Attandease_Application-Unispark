**Project Setup Guide**

**Follow the steps below to run the project locally 👇**

**🔹 1. Clone the Repository**
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

**🔹 2. Setup Backend**
- cd Backend
  
- npm install

**▶️ Start Backend Server:**
npm start

**🔹 3. Setup Frontend**

**Open new terminal:**

- cd Frontend
  
- npm install

**▶️ Start Frontend:**

npm run dev

**Important Notes**
-Make sure Node.js is installed

- .env file should be configured properly (if required)

- Do not upload node_modules to GitHub

## PUT /leave-applications/:id/status — approve/reject (admin)
## Logic explanation: 
Adjustments change total_days + remaining_days (credit increases both, debit decreases remaining). total_days tracks the original + all credits over time. used_days stays untouched (it only changes via approvals). Every adjustment is logged for audit trail. Debit check prevents negative balance.

## GET /leave-applications — view history
## Logic explanation: 
One query serves both employee (filtered by employee_id) and admin (no filter = all records). LEFT JOIN on approved_by because pending leaves have no approver yet. Pagination with LIMIT/OFFSET prevents huge payloads.

## POST /leave-adjustments — admin credit/debit override

## Logic explanation:
 Adjustments change total_days + remaining_days (credit increases both, debit decreases remaining). total_days tracks the original + all credits over time. used_days stays untouched (it only changes via approvals). Every adjustment is logged for audit trail. Debit check prevents negative balance.

 ## POST /carry-forward — year-end EL carry-forward
## Logic explanation:
This is a year-end batch job (run via cron/scheduler, not user-facing). Steps: