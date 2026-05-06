import type { PageServerLoad } from './$types';
import { prisma } from '$lib';
import { error } from '@sveltejs/kit';


export const load = (async ({params}) => {
  const characterId = params.id;


  const character = await prisma.character.findUnique({
  where: { id: characterId },
  include: { 
    
  }
});
  if (!character) {
    throw error(404, 'Character hittades inte');
  }
  
  return { character };

})satisfies PageServerLoad;