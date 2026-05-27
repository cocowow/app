import type { PageServerLoad } from './$types';
import { prisma } from '$lib';
import { fail } from '@sveltejs/kit';
import { requireAuth } from '$lib/auth';
import type { Actions } from './$types';


export const load = (async ({ cookies }) => {
  // Autentisera användaren
  const user = await requireAuth(cookies);
  
  
  const characters = await prisma.character.findMany({ 
    where: {
      createdById: user.id,
    }
  });

  return { 
    characters,
    user
  };
}) satisfies PageServerLoad;


export const actions = {
  create: async ({ request, cookies }) => {
    const user = await requireAuth(cookies);

    const data = await request.formData();
    const name = data.get('name')?.toString();
    
    if (!name || name.trim().length === 0) {
      return fail(400, { error: 'Namn krävs' });
    }
    
    try {
      // Spara till databasen
      await prisma.character.create({
        data: {
          name: name.trim(),
          createdById: user.id
          
        }
      });
      
      return { success: true };
    } catch (error: any) {
      // Hantera om namnet redan finns
      if (error.code === 'P2002') {
        return fail(400, { error: 'Character finns redan' });
      }
      return fail(500, { error: 'Kunde inte skapa character' });
    }
  }
} satisfies Actions;



