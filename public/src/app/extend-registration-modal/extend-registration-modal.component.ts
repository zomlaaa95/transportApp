import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Vehicle } from '../_model/index';

@Component({
  selector: 'app-extend-registration-modal',
  templateUrl: './extend-registration-modal.component.html',
  styleUrls: ['./extend-registration-modal.component.css']
})
export class ExtendRegistrationModalComponent implements OnInit {

  @Input() vehicle: Vehicle;
  @Output() extendRegistration = new EventEmitter();
  @Output() resetForm = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ok() {
    this.extendRegistration.emit();
  }

  cancel(form: NgForm) {
    form.reset();
    this.resetForm.emit();
  }

}
