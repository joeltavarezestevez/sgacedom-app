import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
})
export class SearchableSelectComponent implements OnInit {
  @Input() title = 'Buscar';
  @Input() multiple = false;
  @Input() itemTextField = 'name';

  @Output() valueChange = new EventEmitter<any>();

  private _data: any[] = [];
  private selecting = false;

  safeData: any[] = [];
  filteredData: any[] = [];

  isOpen = false;
  searchText = '';

  selectedSingle: any = null;
  selectedMultiple: any[] = [];

  @Input() set data(value: any[] | null | undefined) {
    const arr = Array.isArray(value) ? value : [];

    this._data = arr.filter((x) => x !== null && x !== undefined);
    this.safeData = [...this._data];
    this.applyFilter();
  }

  get data(): any[] {
    return this._data;
  }

  constructor() {
    addIcons({
      'checkmark-outline': checkmarkOutline,
    });
  }

  ngOnInit() {
    this.applyFilter();
  }

  open() {
    this.isOpen = true;
    this.searchText = '';
    this.applyFilter();
  }

  cancel() {
    this.isOpen = false;
    this.selecting = false;
  }

  confirm() {
    if (this.multiple) {
      this.valueChange.emit(this.selectedMultiple);
    } else if (this.selectedSingle) {
      this.valueChange.emit(this.selectedSingle);
    }

    this.isOpen = false;
  }

  trackByIndex(index: number) {
    return index;
  }

  onSearchChange() {
    this.applyFilter();
  }

  selectSingle(item: any) {
    if (item === null || item === undefined || this.selecting) return;

    this.selecting = true;
    this.selectedSingle = item;
    this.valueChange.emit(item);

    setTimeout(() => {
      this.isOpen = false;
      this.selecting = false;
    }, 150);
  }

  toggleItem(item: any) {
    if (item === null || item === undefined) return;

    if (this.multiple) {
      const idx = this.selectedMultiple.indexOf(item);
      if (idx >= 0) {
        this.selectedMultiple.splice(idx, 1);
      } else {
        this.selectedMultiple.push(item);
      }
    } else {
      this.selectSingle(item);
    }
  }

  isSelected(item: any): boolean {
    return this.multiple
      ? this.selectedMultiple.includes(item)
      : this.selectedSingle === item;
  }

  private applyFilter() {
    const q = (this.searchText || '').trim().toLowerCase();

    if (!q) {
      this.filteredData = [...this.safeData];
      return;
    }

    this.filteredData = this.safeData.filter((item) =>
      this.getLabel(item).toLowerCase().includes(q)
    );
  }

  getLabel(item: any): string {
    if (item === null || item === undefined) return '';

    if (typeof item === 'string' || typeof item === 'number') {
      return String(item);
    }

    const field = (this.itemTextField || 'name').trim();

    const valueFromPath = field
      .split('.')
      .reduce((acc: any, key: string) => acc?.[key], item);

    const val =
      valueFromPath ??
      item?.[field] ??
      item?.nombre ??
      item?.name ??
      item?.label ??
      item?.descripcion ??
      item?.title ??
      item?.value ??
      item?.id;

    return val === null || val === undefined ? '' : String(val);
  }

  get value(): any {
    return this.multiple ? this.selectedMultiple : this.selectedSingle;
  }
}