import type { Actions } from './$types';
import { prisma } from '$lib';
import { fail, redirect } from '@sveltejs/kit';
import * as crypto from "node:crypto";
import { generateSessionToken } from '$lib/auth.ts';


function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function validatePassword(inputPassword: string, storedSalt: string, storedHash: string): boolean {
  const hash = crypto.pbkdf2Sync(inputPassword, storedSalt, 10000, 64, 'sha512').toString('hex');
  return storedHash === hash;
}
function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Lösenordet måste vara minst 8 tecken');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en stor bokstav');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en liten bokstav');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en siffra');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst ett specialtecken');
  }
  
  // Vanliga lösenord att undvika
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Detta lösenord är för vanligt och osäkert');
  }
  
  return errors;
}

const failedAttempts = new Map<string, { count: number, lastAttempt: Date }>();

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    
    const data = await request.formData();
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    
    
    if (!username) {
      return fail(400, { error: 'Användarnamn krävs' });
    }
    if (!password) {
      return fail(400, { error: 'Lösenord krävs' });
    }
  
    const passwordErrors = validatePasswordStrength(password);
    
    if (passwordErrors.length > 0) {
      return fail(400, { error: passwordErrors.join('. ') });
    }
    

    if (username.length < 3){
      return fail(400, {error:'Användarnamn bheöver3tecken'})
    }
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingUser) {
      return fail(400, {error: 'användare finns redN'})
    }
  
    const { salt, hash } = hashPassword(password);
    try {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          salt: salt,
          hash: hash,
          lastActive: new Date()
        }
      });

      const sessionToken = generateSessionToken();
    await prisma.user.update({
      where: { id: newUser.id },
      data: {
        sessionToken,
        tokenCreatedAt: new Date(),
        lastActive: new Date()
      }
    });

    cookies.set('sessionToken', sessionToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: false, // true i production
      httpOnly: true
    });

    } catch (error) {
      // Vad kan gå fel här? Hur hanterar du det?
      return fail(500, { error: 'Kunde inte skapa användare' });
    }
    // Vart ska användaren skickas efter registrering?
    throw redirect(303, '/characters');

  },
login: async ({ request, cookies, getClientAddress }) => {
    const clientIP = getClientAddress();
    const data = await request.formData();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString();
    const attempts = failedAttempts.get(clientIP);
    const rememberMe = data.get('rememberMe') === 'on';

    if (attempts && attempts.count >= 5) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
      if (timeSinceLastAttempt < 15 * 60 * 1000) {
        return fail(429, { error: 'För många inloggningsförsök. Försök igen om 15 minuter.' });
      } else {
        failedAttempts.delete(clientIP);
      }
    }
    
    if (!username || !password) {
      return fail(400, { error: 'Alla fält måste fyllas i' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    
    const dummySalt = 'dummysalt123456789abcdef123456789abcdef';
    const dummyHash = 'dummyhash123456789abcdef123456789abcdef123456789abcdef123456789abcdef';
    
    const isValidPassword = user 
      ? validatePassword(password, user.salt, user.hash)
      : validatePassword(password, dummySalt, dummyHash);

    if (!user || !isValidPassword) {
      const current = failedAttempts.get(clientIP) || { count: 0, lastAttempt: new Date() };
      failedAttempts.set(clientIP, {
        count: current.count + 1,
        lastAttempt: new Date()
      });
      
      return fail(400, { error: 'Ogiltigt användarnamn eller lösenord' });
    } else {
      failedAttempts.delete(clientIP);
      
      const sessionToken = generateSessionToken();
      
      const sessionDays = rememberMe ? 90 : 14;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          sessionToken: sessionToken,
          tokenCreatedAt: new Date(),
          lastActive: new Date()
        }
      });

      
      cookies.set('sessionToken', sessionToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * sessionDays,
        secure: false,
        httpOnly: true
      });
      
      throw redirect(303, '/characters');
    }
  },

  logout: async ({ cookies }) => {
    cookies.delete('sessionToken', { path: '/' });
    throw redirect(303, '/login');
  }
};





