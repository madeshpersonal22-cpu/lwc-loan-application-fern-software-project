

import { LightningElement,api } from 'lwc';
import saveLoan from '@salesforce/apex/LoanApplicationController.saveLoan';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LoanApplication extends LightningElement
 {

    @api recordId;

    loanAmount = 0;
    totalIncome = 0;
    totalDebt = 0;

    handleLoanAmount(event)
    {
        this.loanAmount = parseFloat(event.target.value) || 0;
    }

    handleIncome(event)
    {
        this.totalIncome = event.detail.totalIncome;
    }

    handleDebt(event)
    {
        this.totalDebt = event.detail.totalDebt;
    }

    handleSubmit()
    {

        let incomeCmp = this.template.querySelector('c-income-child');
        let debtCmp = this.template.querySelector('c-debt-child');

       
        if(!incomeCmp.validate() || !debtCmp.validate())
            {
            this.showToast('Error', 'Please fill all records', 'error');
            return;
        }

        
        if(this.totalIncome <= 0.4 * this.loanAmount)
            {
            this.showToast(
                'Validation Error',
                'Income must be greater than 40% of Loan Amount',
                'warning'
            );
            return;
        }

        
        if(this.totalDebt >= 0.2 * this.totalIncome)
            {
            this.showToast(
                'Validation Error',
                'Debt must be less than 20% of Total Income',
                'warning'
            );
            return;
        }

        let loan = {
            Loan_Amount__c: this.loanAmount,
            Total_Income__c: this.totalIncome,
            Total_Debt__c: this.totalDebt,
            Contact__c: this.recordId
        };

        saveLoan({
            loan: loan,
            incomes: incomeCmp.getData(),
            debts: debtCmp.getData()
        })
        .then(()=>{
            this.showToast(
                'Success',
                'Loan Application Created Successfully',
                'success'
            );
        })
        .catch(error=>{
            this.showToast(
                'Error',
                error.body.message,
                'error'
            );
        });
    }

    handleCancel()
    {
         // console.log('Cancel clicked');

   
    this.resetForm();

   
}

    resetForm()
    {

        this.loanAmount = 0;
        this.totalIncome = 0;
        this.totalDebt = 0;

       
        this.template.querySelectorAll('lightning-input').forEach(input => {
            input.value = null;
        });

    
        let incomeCmp = this.template.querySelector('c-income-child');
        let debtCmp = this.template.querySelector('c-debt-child');

        if(incomeCmp)
            {
            incomeCmp.reset();
        }

        if(debtCmp)
            {
            debtCmp.reset();
        }
    }


   
    showToast(title, message, variant)
    {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: 'dismissable'
            })
        );
    }
}
