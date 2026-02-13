import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, IonModal } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
})
export class SearchableSelectComponent  implements OnInit {
  @Input() title = 'Buscar';
  @Input() data!: any[];
  @Input() multiple = false;
  @Input() itemTextField = 'name';

  isOpen = false;
  selected = [];

  constructor() { }

  ngOnInit() {}

  open() {
    console.log('open');
    this.isOpen = true;
    console.log(this.data);
  }

  cancel() {
    console.log('cancel');
    this.isOpen = false;
  }

  confirm() {
    console.log('confirm');
    this.isOpen = false;
  }  
}
