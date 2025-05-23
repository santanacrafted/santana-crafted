import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  templateUrl: './template-detail.component.html',
})
export class TemplateDetailComponent implements OnInit {
  templateId = '';
  template: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.templateId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.templateId);
  }
}
