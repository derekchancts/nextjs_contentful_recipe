import { createClient } from 'contentful'
import Image from 'next/image'
import styles from '../../styles/slug.module.css'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Skeleton from '../../components/Skeleton';


export default function RecipeDetails({ recipe }) {
   // after we set the fallback to true, it will use the getStaticPaths and try to generate a "temp" page until
  // the new page / data is fetched and generated. 
  // if (!recipe) return <div>Loading...</div>
  if (!recipe) return <Skeleton />

  // console.log(recipe)
  const { featuredImage, title, cookingTime, ingredients, method } = recipe.fields
  // console.log(method)

  return (
    <div className={styles.card}>
      <div className={styles.banner}>
        <Image 
          src={'https:' + featuredImage.fields.file.url}
          alt={title}
          // width={featuredImage.fields.file.details.image.width * 3}
          // height={featuredImage.fields.file.details.image.height * 3}
          width={'100%'}
          height={'60%'}
          layout="responsive"
          // unoptimized={true}
          quality='100'
        />
      </div>

        <div className={styles.title}>
          <h2>{ title }</h2>
        </div>

      <div className={styles.info}>
        <p>Takes about { cookingTime } mins to cook.</p>
        <h3>Ingredients:</h3>

        {ingredients.map((ingredient, index) => (
          <span key={index}>{ ingredient }</span>
        ))}
      </div>

      <div className={styles.method}>
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>
    </div>
  )
};


const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})



export const getStaticPaths = async () => {
  const res = await client.getEntries({ 
    content_type: "receipe" 
  })

  const paths = res.items.map(item => {
    return {
      params: { 
        slug: item.fields.slug 
      }
    }
  })

  return {
    paths,
    //fallback: false  // if fallback is set to false, then we will get the 404 page
    fallback: true
  }
};


export const getStaticProps = async (context) => {
  // const { items } = await client.getEntries({
  const res = await client.getEntries({
    content_type: 'receipe',
    'fields.slug': context.params.slug
  })


  // if we cannot find the item / slug
  if (!res.items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false  // we might have the slug in the future. So, set permanent redirect to false here 
      }
    }
  };


  return {
    props: { 
      recipe: res.items[0] 
    },
    revalidate: 1    // INCREMENTAL STATIC REGENERATION
                     // will revalidate/refresh the page (if it has any updated data) after x seconds, "IF THE PAGE ALREADY EXISTS"
                     // after a user visits the page. so, subsequent users will see the updated page details
                     // if a new page is added, then the new page won't be "statically regenerated", unless
                     // a "Fallback page" is used or set to true. 
                     // Fallback pages are placeholder content whilst Nextjs fetches new data for the page
  }
};