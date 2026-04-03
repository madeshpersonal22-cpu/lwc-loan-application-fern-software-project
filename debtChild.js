
import { LightningElement, track, api } from 'lwc';


export default class DebtChild extends LightningElement 
{
      @track debtList = [];


    connectedCallback()
    {
        this.addRow();
    }

    addRow()
    {
        this.debtList = [
            ...this.debtList,
            { id: Date.now(), source:'', amount:0 }
        ];
    }

    removeRow(event)
    {
        let id = event.target.dataset.id;
        this.debtList = this.debtList.filter(d => d.id != id);
        this.calculateTotal();
    }

    handleSource(event)
    {
        let id = event.target.dataset.id;
        let value = event.target.value;

        this.debtList = this.debtList.map(d=>{
            if(d.id == id)
                {
                d.source = value;
            }
            return d;
        });
    }

    handleAmount(event)
    {
        let id = event.target.dataset.id;
        let value = parseFloat(event.target.value) || 0;

        this.debtList = this.debtList.map(d=>{
            if(d.id == id)
                {
                d.amount = value;
            }
            return d;
        });

        this.calculateTotal();
    }

    calculateTotal()
    {
        let total = this.debtList.reduce((sum,d)=> sum + d.amount,0);

        this.dispatchEvent(new CustomEvent('debtchange',
            {
            detail:{ totalDebt: total }
        }));
    }

    @api validate()
    {
        return this.debtList.length > 0;
    }

    @api getData()
    {
        return this.debtList.map(d=>{
            return {
                Source__c: d.source,
                Amount__c: d.amount
            };
        });
    }

      
    @api reset()
    {
        this.debtList = [];
        this.addRow();

        this.dispatchEvent(new CustomEvent('debtchange',{
            detail:{ totalDebt: 0 }
        }));
    }
}
