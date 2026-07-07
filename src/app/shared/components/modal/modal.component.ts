import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  public isOpen = input.required<boolean>();
  public typeModal = input.required<'success' | 'error' | 'wait'>();
  public message = input.required<string>();
  public closed = output<void>();

  public resolvedTitle = computed(() => {
    switch (this.typeModal()) {
      case 'error':
        return 'Ошибка';
      case 'success':
        return 'Готово';
      case 'wait':
        return 'Подождите';
    }
  });

  public iconClass = computed(() => {
    return this.typeModal() === 'wait' ? 'loading' : this.typeModal();
  });

  public onClose(): void {
    this.closed.emit();
  }

}
