const express = require('express');
const app = express();
app.use(express.json());
let clients = {}; 
function creditScoreCheck(req, res, next) {
    const { credit } = req.body;
    if (credit < 600) {
        return res.status(400).json({
            message: "Sorry! Loan application denied due to low credit score.",
            status: "denied"
        });
    }
    next();
}
function debtToIncomeCheck(req, res, next) {
    const { debt, income } = req.body;
    const ratio = (debt / income) * 100;
    req.debtToIncomeAssessment = ratio > 40 ? "decreased" : "normal";
    next();
}
function balanceCheck(req, res, next) {
    const { balance } = req.body;
    req.loanConditions = balance < 1000 ? "restricted" : "standard";
    next();
}
function processLoanApproval(req, res) {
    const { customerId } = req.body;
    const { debtToIncomeAssessment, loanConditions } = req;
    let loanAmount; 
    loanAmount = loanConditions === "restricted" ? 5000 : 10000;
    clients[customerId] = {
        loanStatus: "approved",
        loanAmount: loanAmount
    }; 
    return res.json({
        message: "Loan application processed",
        status: "approved",
        loanAmount: loanAmount
    });
}
app.post('/apply-loan', creditScoreCheck, debtToIncomeCheck, balanceCheck, processLoanApproval);
app.get('/customers/loan-status', (req, res) => {
    const { customerId } = req.query;
    if (clients[customerId]) {
        return res.json({
            customerId: customerId,
            loanStatus: clients[customerId].loanStatus
        });
    }
    return res.status(404).json({ message: "Customer not found" });
});
app.put('/customers/update-info', (req, res) => {
    const { customerId, balance, debt, income } = req.body;
    if (!clients[customerId]) {
        return res.status(404).json({ message: "Customer not found" });
    }
    clients[customerId] = { ...clients[customerId], balance: balance, debt: debt, income: income };
    return res.json({
        message: "Customer financial information updated",
        customer: clients[customerId]
    });
});
function generalErrorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
}
app.use(generalErrorHandler);
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
