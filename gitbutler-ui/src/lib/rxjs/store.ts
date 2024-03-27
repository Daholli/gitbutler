import { Observable } from 'rxjs';
import { writable, type Readable, type Writable } from 'svelte/store';

export function storeToObservable<T>(svelteStore: Writable<T> | Readable<T>): Observable<T> {
	return new Observable<T>((subscriber) => {
		return svelteStore.subscribe((val) => subscriber.next(val));
	});
}

/**
 * Turns an observable into a pair of success/error stores
 *
 * Observables are great for managing what is effectively a stream of data
 * into desired inputs for the application state. They are on the other hand
 * not great for consuming said data in components. Instead what we want is
 * to contain observables to within services, and use reactive stores in
 * components.
 *
 * Note that the observable is subscribed to when the store is first subscribed
 * to, and unsubscribed with the last unsubscribe to the store.
 */
export function observableToStore<T>(
	observable: Observable<T>
): [Readable<T | undefined>, Readable<any | undefined>] {
	const error = writable<any>();
	const store = writable<T | undefined>(undefined, () => {
		// This runs when the store is first subscribed to
		const subscription = observable.subscribe({
			next: (item) => {
				error.set(undefined);
				store.set(item);
			},
			error: (err) => {
				store.set(undefined);
				error.set(err);
			}
		});

		// This runs when the last subscriber unsubscribes
		return () => {
			// TODO: Investigate why project switching breaks without `setTimeout`
			setTimeout(() => {
				if (subscription && !subscription.closed) subscription.unsubscribe();
			}, 0);
		};
	});

	return [store, error];
}
