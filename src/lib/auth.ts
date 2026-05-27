import { prisma } from '$lib';
import { redirect } from '@sveltejs/kit';

// Din uppgift: Implementera denna funktion
export async function requireAuth(cookies: any) {
  const sessionToken = cookies.get('sessionToken');
  
  if (!sessionToken) {
    throw redirect(307, '/login');
  }
  
  const user = await prisma.user.findUnique({
    where: { sessionToken }
  });
  
  if (!user || !user.tokenCreatedAt) {
    cookies.delete('sessionToken', { path: '/' });
    throw redirect(307, '/login');
  }
  
  const expiredDays = 14;
  if (isTokenExpired(user.tokenCreatedAt, expiredDays)) {
    
    await prisma.user.update({
      where: { id: user.id },
      data: { sessionToken: null, tokenCreatedAt: null }
    });
    
    cookies.delete('sessionToken', { path: '/' });
    throw redirect(307, '/login');
  }
  
  return user;
}


// Bonus: Skapa en "optional auth" funktion
export async function getUser(cookies: any) {
  const sessionToken = cookies.get('sessionToken');
  
  if (!sessionToken) {
    return null;
  }
  
  const user = await prisma.user.findFirst({
    where: { sessionToken: sessionToken }
  });

  if (user && user.tokenCreatedAt) {
    const expiredDays = 14;
    const expiryDate = new Date(user.tokenCreatedAt);
    expiryDate.setDate(expiryDate.getDate() + expiredDays);
    
    if (new Date() > expiryDate) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          sessionToken: null,
          tokenCreatedAt: null
        }
      });
      return null;
    }
  }
  
  return user || null;
}



import crypto from 'node:crypto';

export function generateSessionToken(): string {
 
  return crypto.randomBytes(32).toString('base64url');
}

export function isTokenExpired(createdAt: Date, maxAgeInDays: number = 14): boolean {
 
  const now = new Date();
  const ageInMs = now.getTime() - createdAt.getTime();
  const maxAgeInMs = maxAgeInDays * 24 * 60 * 60 * 1000;
  return ageInMs > maxAgeInMs;
}



export async function validateSession(token: string | undefined) {
  if (!token) {
    return null;
  }
  
  // Din uppgift: Hitta användare med detta token
  // Kontrollera att token inte är expired
  // Uppdatera lastActive
  // Returnera user eller null
  const user = await prisma.user.findUnique({
    where: { sessionToken: token }
  });
  if (!user) {
    return null;
  }
  if (isTokenExpired(user.tokenCreatedAt, 14)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { sessionToken: null }
    });
    return null;
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActive: new Date() }
  });
  return user;
}

