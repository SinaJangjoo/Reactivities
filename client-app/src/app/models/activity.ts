
// In here we define all our properties types as TypeScript expects
// so we define all our properties and tell ts what are their type is and then use this interface
// inside for eg. App.tsx where we want to set value from state to our model properties!

export interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  city: string;
  venue: string;
}
