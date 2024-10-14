const cron = require('node-cron');
const User = require("../models/User/User");
const TransactionLog = require("../models/User/TransactionLog");

// Schedule the task to run at midnight on the 1st day of every month
const feeCalculationScheduler = () => {
    cron.schedule('0 0 1 * *', () => {
        console.log('Scheduler running: Fee calculation for the 1st day of the month');
         calculateMonthlyFees();
    });
};



const calculateMonthlyFees = async () => {
    try {
        const users = await User.find({ userType: 'flat' });

        if (users.length > 0) {
            for (const user of users) {
                // Calculate the fee for the user
                const fee = 1000;

                // Update the user's balance by adding the calculated fee
                user.balance = (user.balance || 0) + fee;

                // Save the updated user back to the database
                await user.save();

                // Create a transaction log after updating the balance
                const transactionLog = new TransactionLog({
                    userId: user._id,
                    amount: fee,
                    transactionType: 'Monthly Fee',
                    date: new Date()
                });

                // Save the transaction log to the database
                await transactionLog.save();

                console.log(`Updated balance for user ${user.name}: ${user.balance}`);
            }
        } else {
            console.log('No users found with userType: flat');
        }
    } catch (error) {
        console.error('Error calculating fees:', error);
    }
}
module.exports = { feeCalculationScheduler }
