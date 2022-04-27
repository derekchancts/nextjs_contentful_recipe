import { createClient } from 'contentful'
import RecipeCard from '../components/RecipeCard';


export default function Recipes({ recipes }) {
  // console.log({recipes})
  console.log(recipes)
  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        // <div key={recipe.sys.id}>{recipe.fields.title}</div>
        // <div key={recipe.sys.id}>
        //   <RecipeCard recipe={recipe}/>
        // </div>
        <RecipeCard key={recipe.sys.id} recipe={recipe}/>

      ))}
    </div>
  )
}


// export async function getStaticProps () {
// }

export const getStaticProps = async() => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  })


  const res = await client.getEntries({ 
    content_type: 'receipe' 
  });
  // console.log(res)


  return {
    props: {
      recipes: res.items
    },
    revalidate: 1 
  }
};