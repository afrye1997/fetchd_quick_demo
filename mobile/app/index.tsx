import { Redirect } from 'expo-router';

// Root entry — redirects to the tab navigator (authenticated home)
// When auth is wired, this will check session and route to (auth) or (tabs)
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
