import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  public isCheckoutUserDataValid = signal<boolean>(false);
  public isCheckoutUserAddressValid = signal<boolean>(false);

  public isReadyToOrder = computed(() => {
    return this.isCheckoutUserDataValid() && this.isCheckoutUserAddressValid();
  });
}
