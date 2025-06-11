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
    // Small delay to allow click on dropdown item
    setTimeout(() => {
      this.showDropdown = false;
    }, 0);
  }

  onFocus() {
    setTimeout(() => {
      this.showDropdown = true;
    }, 1000);
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
    // Delay to ensure rendering is done
    setTimeout(() => {
      const inputElement = document.querySelector(
        '#inputElement'
      ) as HTMLElement;

      console.log('Input element:', inputElement);
      if (inputElement) {
        const rect = this.inputElement.nativeElement.getBoundingClientRect();
        console.log('Input rect:', rect);
        console.log(window.innerHeight);

        const spaceBelow = window.innerHeight - rect.bottom;
        console.log('Space below input:', spaceBelow);
        const dropdownHeight = 100; // estimate of dropdown height

        // If space below is less than dropdown height, show upwards
        this.showAboveDropdown = spaceBelow < dropdownHeight;
        console.log('Show above dropdown:', this.showAboveDropdown);
      }
    }, 0);
  }
}
