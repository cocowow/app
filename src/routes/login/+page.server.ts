import type { Actions } from './$types';
import { prisma } from '$lib';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    // Din uppgift: Få data från formuläret
    const data = await request.formData();
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    
    // Din uppgift: Validering - vad ska du kolla?
    if (!username) {
      return fail(400, { error: 'Användarnamn krävs' });
    }
    if (!password) {
      return fail(400, { error: 'Lösenord krävs' });
    }
    // Lägg till fler valideringar:
    // - Password för kort?
    if (password.length < 5) {
      return fail(400, {error: 'Lösenordet är för kort'})
    }
    // - Username för kort?

    if (username.length < 3){
      return fail(400, {error:'Användarnamn bheöver3tecken'})
    }
    // - Ogiltiga tecken?
    
    // Din uppgift: Kolla om användaren redan finns
    const existingUser = await prisma.user.findUnique({
      where: { username: username }
    });
    
    if (existingUser) {
      return fail(400, {error: 'användare finns redN'})
    }
    
    // Din uppgift: Skapa användare
    // VARNING: Detta sparar lösenord i klartext (osäkert!)
    // Vi kommer fixa detta i senare modul
    try {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          password: password
        }
      });

      // Din uppgift: Logga in användaren direkt
      // För nu: spara user ID i cookie (enkelt men inte säkrast)
      cookies.set('userId', String(newUser.id), {
        path: '/',
        maxAge: 360 * 24 * 7,
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
  
  login: async ({ request, cookies }) => {
    // Din uppgift: Implementera login-logiken
    // 1. Få username och password från formData
    // 2. Hitta användare i databas
    // 3. Jämför lösenord (för nu: direkt jämförelse)
    // 4. Om korrekt: sätt cookie och redirect
    // 5. Om fel: returnera error
    const data = await request.formData();
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    
    // Din implementation här:
    if (!username) {
      return fail(400, { error: 'Användarnamn krävs' });
    }
    if (!password) {
      return fail(400, { error: 'Lösenord krävs' });
    }

    const user = await prisma.user.findUnique({
      where: { username: username }
    });
    
    if (!user) {
      return fail(400, {error: 'användare finns inte'})
    }
    if (user.password !== password) {
      return fail(400, {error: 'fel lösenord'})
    }
    cookies.set('userId', String(user.id), {
      path: '/',
      maxAge: 360  * 24 * 7, // 1 vecka
      secure: false, // true i production
      httpOnly: true
    });
    
    throw redirect(303, '/characters');

  },

  logout: async ({ cookies }) => {
    // Dinuppgift: Implementera logout
    // 1. Ta bort userId cookie
    // 2. Redirect till lämplig sida
    cookies.delete(('userId'), { path: '/' });
    throw redirect(303, '/login');
  }
};