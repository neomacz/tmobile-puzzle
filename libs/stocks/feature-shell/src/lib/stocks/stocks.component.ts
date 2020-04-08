import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;

  quotes$ = this.priceQuery.priceQueries$;
  showDateRage = false;

  todayDate = new Date();

  timePeriods = [
    { viewValue: 'Use Date range', value: 'date' },
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      startDate: [this.todayDate],
      endDate: [this.todayDate]
    });
  }

  ngOnInit() {
    this.stockPickerForm.valueChanges.subscribe(() => {
      this.checkInput();
    });
  }

  checkInput() {
    const { symbol, period, startDate, endDate } = this.stockPickerForm.value;
    this.showDateRage = (period === 'date');
    if (period === 'date') {
      this.showDateRage = true;
      if (endDate < startDate) {
        this.stockPickerForm.get('endDate').setValue(startDate);
      }
      this.fetchQuote(symbol, 'max');
    } else {
      this.showDateRage = false;
      this.fetchQuote(symbol, period);
    }

  }

  fetchQuote(symbol: string, period: string) {
    if (this.stockPickerForm.valid) {
      this.priceQuery.fetchQuote(symbol, period);
    }
  }

}
