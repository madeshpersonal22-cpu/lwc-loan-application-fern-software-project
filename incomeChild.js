

import { LightningElement, track, api } from 'lwc';

export default class IncomeChild extends LightningElement
 {
     
    @track incomeList = [];

    options = 
    [
          { label: 'Salary', value: 'Salary' },
         { label: 'Other', value: 'Other' }
    ];

    connectedCallback()
    {
         this.addRow();
    }

    addRow()
    {
         this.incomeList = [
             ...this.incomeList,
             { id: Date.now(), type:'', description:'', amount:0, isOther:false }
        ];
    }

    removeRow(event)
    {
         let id = event.target.dataset.id;
          this.incomeList = this.incomeList.filter(i => i.id != id);
           this.calculateTotal();
    }

    handleType(event)
    {
          let id = event.target.dataset.id;
         let value = event.detail.value;

        this.incomeList = this.incomeList.map(i=>
            {
            if(i.id == id){
                i.type = value;
                i.isOther = value === 'Other';
            }
            return i;
        });
    }

    handleDesc(event)
    {
         let id = event.target.dataset.id;
          let value = event.target.value;

        this.incomeList = this.incomeList.map(i=>
            {
            if(i.id == id){
                i.description = value;
            }
            return i;
        });
    }

    handleAmount(event)
    {
        let id = event.target.dataset.id;
         let value = parseFloat(event.target.value) || 0;

         this.incomeList = this.incomeList.map(i=>
            {
            if(i.id == id){
                i.amount = value;
            }
            return i;
        });

         this.calculateTotal();
    }

    calculateTotal()
    {
        let total = this.incomeList.reduce((sum,i)=> sum + i.amount,0);

          this.dispatchEvent(new CustomEvent('incomechange',{
              detail:{ totalIncome: total }
        }));
    }

    @api validate()
    {
          return this.incomeList.length > 0;
    }

    @api getData()
    {
          return this.incomeList.map(i=>{
             return {
                  Type__c: i.type,
                   Description__c: i.description,
                 Amount__c: i.amount
             };
        });
    }
      

    @api reset()
    {
        this.incomeList = [];
          this.addRow();

         this.dispatchEvent(new CustomEvent('incomechange',{
             detail:{ totalIncome: 0 }
        }));
    }
}