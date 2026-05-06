import { prisma } from '$lib';
import { redirect } from '@sveltejs/kit';

// Din uppgift: Implementera denna funktion
export async function requireAuth(cookies: any) {
  // 1. Få userId från cookies
  const userId = cookies.get('userId') /* hur får du cookie-värdet? */;
  
  // 2. Om ingen cookie: redirect till login
  if (!userId) {
    // Hur gör du redirect?
    throw redirect(303, '/login')
  }
  
  // 3. Hitta användare i databas
  const user = await prisma.user.findUnique({
    where: { id: userId}
  });
  
  // 4. Om användare inte finns: rensa cookie och redirect
  if (!user) {
    // Hur tar du bort en cookie?
    cookies.delete('userId', { path: '/' });
    // Redirect till login
    throw redirect(303, '/login')
  }
  
  // 5. Returnera användaren
  return user;
}

// Bonus: Skapa en "optional auth" funktion
export async function getUser(cookies: any) {
  // Din uppgift: Som requireAuth men utan redirect
  // Returnera user eller null
  const userId = cookies.get('userId');
  if (!userId) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    cookies.delete('userId', { path: '/' });
    return null;
  }
  return user;
}