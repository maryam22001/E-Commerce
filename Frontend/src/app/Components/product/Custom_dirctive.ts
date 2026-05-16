import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCardBg]',
  standalone: true
})
export class CustomDirective implements OnInit {
  @Input() appCardBg: string = '#f8f9fa'; // Default

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.appCardBg);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s ease');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#e2e6ea'); // Darken on hover
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.appCardBg);
  }
}