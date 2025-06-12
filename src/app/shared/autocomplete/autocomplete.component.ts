import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
})
export class AutocompleteComponent implements OnInit {
  @Input() items: string[] = [];
  @Output() valueChanged = new EventEmitter<string>();
  @Input() initialValue: string = '';
  @ViewChild('inputElement') inputElement!: ElementRef;
  showAboveDropdown = false;

  inputValue = '';
  filteredItems: string[] = [];
  showDropdown = false;

  ngOnInit(): void {
    this.filteredItems = this.items;
    this.inputValue = this.initialValue;
  }

  selectItem(item: string) {
    this.inputValue = item;
    this.valueChanged.emit(this.inputValue);
    this.showDropdown = false;
  }

  onBlur() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 100);
  }

  onFocus() {
    this.showDropdown = true;
    this.checkDropdownPosition();
  }

  onInputChange() {
    this.filteredItems = this.items.filter((item) =>
      item.toLowerCase().includes(this.inputValue.toLowerCase())
    );
    this.valueChanged.emit(this.inputValue);
    this.checkDropdownPosition();
  }

  checkDropdownPosition() {
    setTimeout(() => {
      const inputElement = this.inputElement.nativeElement;

      if (inputElement) {
        const rect = inputElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 200; // estimate of dropdown height

        // If space below is less than dropdown height, show upwards
        this.showAboveDropdown = spaceBelow < dropdownHeight;
      }
    }, 0);
  }
}
