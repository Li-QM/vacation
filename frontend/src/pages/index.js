import { lazy } from 'react';

export const Home = lazy(() => import('./Home'));
export const Help = lazy(() => import('./Help/Help'));
export const Rooms = lazy(() => import('./Rooms/Rooms'));
export {default as Dashboard} from './dashboard'; // Already imported as lazy in dashboard/index.js

export const ContactUs = lazy(() => import('./Contactus/ContactUs'));
export const StaticPageRouter = lazy(() => import('./StaticPages/StaticPageRouter'));
export const PricingPageRouter = lazy(() => import('./PricingPages/PricingRouter'));
export const HomesRouter = lazy(() => import('./Homes/HomesRouter'));
export const SearchRouter = lazy(() => import('./Search/SearchRouter'));
export const Inbox = lazy(() => import('./Inbox/Inbox'));
export const VerifyUser = lazy(() => import('./VerifyUser/VerifyUser'));
