import { useMemo, useState } from 'react'
import './App.css'

/*
  Temporary local value for the static demo.

  In the LaunchDarkly version, this will be replaced by the ai-mixologist
  feature flag. When the flag is true, the AI Mixologist panel is shown.
  When the flag is false, users only see the stable recipe repository.
*/
const SHOW_AI_MIXOLOGIST_PREVIEW = true

const users = [
  {
    key: 'kendra',
    name: 'Kendra',
    plan: 'premium',
    betaUser: true,
    favoriteSpirit: 'Bourbon',
    flavorProfile: 'citrus + cozy',
    region: 'US',
    occasion: 'dinner party',
  },
  {
    key: 'miles',
    name: 'Miles',
    plan: 'standard',
    betaUser: false,
    favoriteSpirit: 'Bourbon',
    flavorProfile: 'spirit-forward + cozy',
    region: 'US',
    occasion: 'date night',
  },
  {
    key: 'nina',
    name: 'Nina',
    plan: 'premium',
    betaUser: false,
    favoriteSpirit: 'Tequila',
    flavorProfile: 'bright + spicy',
    region: 'CA',
    occasion: 'backyard hangout',
  },
  {
    key: 'sam',
    name: 'Sam',
    plan: 'internal',
    betaUser: true,
    favoriteSpirit: 'Zero-proof',
    flavorProfile: 'fresh + not too sweet',
    region: 'US',
    occasion: 'work event',
  },
]

const recipes = [
  {
    name: 'Maple Bourbon Smash',
    type: 'Cocktail',
    description:
      'Bourbon, lemon, orange juice, and maple syrup. Cozy, citrusy, and suspiciously easy to batch.',
    tags: ['bourbon', 'citrus', 'cozy'],
    favorite: true,
    ingredients: [
      '60 ml (2 oz) bourbon',
      '20 ml (2/3 oz) fresh lemon juice',
      '20 ml (2/3 oz) orange juice',
      '15 ml (1/2 oz) maple syrup',
      'Ice',
      'Orange slice or lemon wheel for garnish',
    ],
    instructions: [
      'Add bourbon, lemon juice, orange juice, and maple syrup to a shaker with ice.',
      'Shake until well chilled.',
      'Strain into a rocks glass over fresh ice.',
      'Garnish with an orange slice or lemon wheel.',
    ],
  },
  {
    name: 'No Regrets Negroni',
    type: 'Cocktail',
    description: 'Bitter, balanced, and emotionally prepared for aperitivo hour.',
    tags: ['bitter', 'classic', 'spirit-forward'],
    favorite: false,
    ingredients: [
      '1 oz gin',
      '1 oz Campari',
      '1 oz sweet vermouth',
      'Orange peel',
    ],
    instructions: [
      'Add gin, Campari, and sweet vermouth to a mixing glass with ice.',
      'Stir until well chilled.',
      'Strain into a rocks glass over a large cube.',
      'Express an orange peel over the top and garnish.',
    ],
  },
  {
    name: 'Spiced Pear Spritz',
    type: 'Cocktail',
    description: 'Pear, bubbles, baking spice, and main-character energy.',
    tags: ['sparkling', 'fall', 'party'],
    favorite: true,
    ingredients: [
      '1 1/2 oz pear liqueur',
      '1/2 oz lemon juice',
      '3 oz sparkling wine',
      '1 oz soda water',
      'Cinnamon stick for garnish',
    ],
    instructions: [
      'Add pear liqueur and lemon juice to a wine glass with ice.',
      'Top with sparkling wine and soda water.',
      'Stir gently.',
      'Garnish with a cinnamon stick.',
    ],
  },
  {
    name: 'Cucumber Mint Fizz',
    type: 'Mocktail',
    description: 'Crisp, bright, and safe for Monday morning status meetings.',
    tags: ['zero-proof', 'fresh', 'light'],
    favorite: false,
    ingredients: [
      '3 cucumber slices',
      '6 mint leaves',
      '3/4 oz lime juice',
      '1/2 oz simple syrup',
      'Soda water',
      'Cucumber ribbon for garnish',
    ],
    instructions: [
      'Muddle cucumber, mint, lime juice, and simple syrup in a shaker.',
      'Add ice and shake briefly.',
      'Strain into a glass with fresh ice.',
      'Top with soda water.',
      'Garnish with a cucumber ribbon.',
    ],
  },
]

function getRecommendation(user) {
  const recommendations = {
    Bourbon: {
      drink: 'Maple Bourbon Smash',
      reason:
        'It matches your citrus + cozy profile and gives bourbon a bright, hosting-friendly twist.',
      bartenderNote:
        'Use real maple syrup. Pancake syrup is where trust goes to die.',
    },
    Tequila: {
      drink: 'Spicy Paloma',
      reason:
        'It fits your bright + spicy profile and works well for a casual group setting.',
      bartenderNote:
        'Add a tajín rim if the guest list deserves flair.',
    },
    'Zero-proof': {
      drink: 'Cucumber Mint Fizz',
      reason:
        'It is fresh, not too sweet, and appropriate for a work event where everyone has to be normal afterward.',
      bartenderNote:
        'Top with extra bubbles. Nobody misses the chaos.',
    },
  }

  return recommendations[user.favoriteSpirit] || recommendations.Bourbon
}

function TasteProfile({ user }) {
  return (
    <aside className="card profile-card">
      <p className="eyebrow">Taste profile</p>
      <h2>{user.name}</h2>

      <dl className="attribute-list">
        <div>
          <dt>Plan</dt>
          <dd>{user.plan}</dd>
        </div>
        <div>
          <dt>Favorite spirit</dt>
          <dd>{user.favoriteSpirit}</dd>
        </div>
        <div>
          <dt>Flavor profile</dt>
          <dd>{user.flavorProfile}</dd>
        </div>
        <div>
          <dt>Region</dt>
          <dd>{user.region}</dd>
        </div>
      </dl>
    </aside>
  )
}

function RecipeRepository({ onSelectRecipe }) {
  return (
    <section className="card recipe-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your library</p>
          <h2>Saved recipes</h2>
        </div>
        <span className="status-pill">Stable experience</span>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <article className="recipe-card" key={recipe.name}>
            <div className="recipe-card-header">
              <div>
                <p className="recipe-type">{recipe.type}</p>
                <h3>{recipe.name}</h3>
              </div>
              {recipe.favorite && <span className="favorite">★</span>}
            </div>

            <p>{recipe.description}</p>

            <div className="tag-row">
              {recipe.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <button
              className="recipe-button"
              type="button"
              onClick={() => onSelectRecipe(recipe)}
            >
              View recipe
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function RecipeDetail({ recipe, onBack }) {
  return (
    <section className="card recipe-detail">
      <button className="back-button" type="button" onClick={onBack}>
        ← Back to recipes
      </button>

      <div className="recipe-detail-header">
        <p className="eyebrow">{recipe.type}</p>
        <h2>{recipe.name}</h2>
        <p>{recipe.description}</p>
      </div>

      <div className="recipe-detail-grid">
        <div>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Instructions</h3>
          <ol>
            {recipe.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function AiMixologist({ user, recommendation }) {
  return (
    <section className="card ai-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">COMING SOON</p>
          <h2>AI Mixologist</h2>
        </div>
        <span className="status-pill ai-pill">Personalized recommendations</span>
      </div>

      <div className="chat-layout">
        <div className="chat-message user-message">
          I want something that fits my preferences and works for a{' '}
          {user.occasion}. What should I make?
        </div>

        <div className="chat-message ai-message">
          <strong>Recommended: {recommendation.drink}</strong>
          <p>{recommendation.reason}</p>
          <p>
            <strong>Bartender note:</strong> {recommendation.bartenderNote}
          </p>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [currentUserKey, setCurrentUserKey] = useState('kendra')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const currentUser = users.find((user) => user.key === currentUserKey)

  const recommendation = useMemo(() => {
    return getRecommendation(currentUser)
  }, [currentUser])

  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Cocktail and mocktail recipe library</p>
          <h1>Pour Decisions</h1>
          <p className="subtitle">
            Save your favorite recipes, remember what your friends actually
            like, and get recommendations that do not begin with “hear me out.”
          </p>
        </div>

        <div className="account-switcher">
          <label htmlFor="current-user">Viewing as</label>
          <select
            id="current-user"
            value={currentUserKey}
            onChange={(event) => {
              setCurrentUserKey(event.target.value)
              setSelectedRecipe(null)
            }}
          >
            {users.map((user) => (
              <option key={user.key} value={user.key}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="welcome-card">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>Your bar cart is behaving beautifully.</h2>
          <p>
            Browse saved recipes, revisit favorites, and plan a drink menu based
            on the preferences you already know.
          </p>
        </div>

        <div className="quick-stats">
          <div>
            <strong>24</strong>
            <span>Saved recipes</span>
          </div>
          <div>
            <strong>8</strong>
            <span>Favorites</span>
          </div>
          <div>
            <strong>4</strong>
            <span>Flavor tags</span>
          </div>
        </div>
      </section>

      {selectedRecipe ? (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
        />
      ) : (
        <>
          <section className="dashboard-grid">
            <TasteProfile user={currentUser} />
            <RecipeRepository onSelectRecipe={setSelectedRecipe} />
          </section>

          {SHOW_AI_MIXOLOGIST_PREVIEW && (
            <AiMixologist user={currentUser} recommendation={recommendation} />
          )}
        </>
      )}
    </main>
  )
}

export default App