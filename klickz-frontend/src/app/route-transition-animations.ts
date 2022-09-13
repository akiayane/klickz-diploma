import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';
export const routeTransitionAnimations = trigger('triggerName', [
    transition('profile => links, links => createlink, profile => createlink', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ right: '-100%', opacity: 0 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('0.8s ease-out', style({ right: '100%', opacity: 0 }))]),
			query(':enter', [animate('0.8s ease-out', style({ right: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),
	transition('createlink => links, links => profile, createlink => profile', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ left: '-100%', opacity: 0 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('0.8s ease-out', style({ left: '100%', opacity: 0 }))]),
			query(':enter', [animate('0.8s ease-out', style({ left: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),
	transition('account => api', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ top: '-100%', opacity: 0 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('1s ease-out', style({ top: '100%', opacity: 0 }))]),
			query(':enter', [animate('1s ease-out', style({ top: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),
	transition('api => account', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ bottom: '-100%', opacity: 0 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('1s ease-out', style({ bottom: '100%', opacity: 0 }))]),
			query(':enter', [animate('1s ease-out', style({ bottom: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),
]);