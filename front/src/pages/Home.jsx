// import de react usestate et useeffect 
import React, { useState, useEffect } from 'react';

// import des component
import { Loader, Card, FormField } from '../components';

const RenderCards = ({ data, title }) => {
  if(data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />)
  }

  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>
      {title}
    </h2>
  )
};

const Home = () => {

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [ searchedResults, setSearchedResults ] = useState(null);
  const [searchTimeout, setsearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch('https://ai-image-o2kz.onrender.com/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if(response.ok) {
          const result = await response.json();

          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    searchTimeout(
    setTimeout(() => {
      const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));

      setSearchedResults(searchResults);
    }, 500)
    );
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>La vitrine communautaire</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'>Parcourez une collection d'images imaginatives et visuellement époustouflantes générées par Ai image</p>
      </div>

      <div className='mt-16'>
        <FormField
        labelName='chercher les images poster'
        type='text'
        name='text'
        placeholder='Chercher les images poster'
        value={searchText}
        handleChange={handleSearchChange}
        />
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
          {searchText && (
            <h2 className='font-medium text-[#666e75] text-xl mb-3'>
              Affichage des résultats pour <span className='text-[#222328]'>{searchText}</span>
            </h2>
          )}

          <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
            {searchText ? (
              <RenderCards
              data={searchedResults}
              title="Aucun résultat de recherche trouvé"
               />
            ) : (
              <RenderCards
              data={allPosts}
              title="aucun article trouvé"
               />
            )}
          </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home