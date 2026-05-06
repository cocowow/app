import { getUser } from '$lib/auth';
import type { LayoutServerLoad } from './$types';



export const load = (async ({ cookies }) => {
  // Din uppgift: Använd getUser för att få auth-status
  // (Inte requireAuth - det skulle redirecta på publika sidor!)
  
  const user = await getUser(cookies);
  
  return {
    user: user // Nu tillgängligt i alla komponenter via data.user
  };
}) satisfies LayoutServerLoad;
 
