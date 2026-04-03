public  class LoanApplicationController {
    
     @AuraEnabled
    public static Id saveLoan(
        Loan_Application__c loan,
        List<Income__c> incomes,
        List<Debt__c> debts
                             )
    {
        insert loan;

        for(Income__c inc : incomes){
            inc.Loan_Application__c = loan.Id;
        }
        insert incomes;

        for(Debt__c d : debts){
            d.Loan_Application__c = loan.Id;
        }
        insert debts;

        return loan.Id;
    }
}