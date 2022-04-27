import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/recipeCard.module.css'


const RecipeCard = ({ recipe }) => {
  const { title, slug, cookingTime, thumbnail } = recipe.fields

  return (
    <div className={styles.card}>
      <div className={styles.featured}>
        <Image 
          src={'https:' + thumbnail.fields.file.url}
          alt={title}
          // width={thumbnail.fields.file.details.image.width * 2}
          // height={thumbnail.fields.file.details.image.height * 2}
          width={'60%'}
          height={'50%'}
          layout="responsive"
          // objectFit='contain'
          // layout="fill"
          // objectFit="cover"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h4>{ title }</h4>
          <p>Takes approx { cookingTime } mins to make</p>
        </div>
        
        <div className={styles.actions}>
          <Link href={'/recipes/' + slug}><a>Cook this</a></Link>
        </div>
      </div>

    </div>
  )
}

export default RecipeCard