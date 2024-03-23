import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null); // this is for hovered image

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg("");
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.");
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  return (
    <div className="container">
      <h1 className="title">Image Search App</h1>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder=" Search here..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection("Mountains")}>Mountains</div>
        <div onClick={() => handleSelection("Beaches")}>Beaches</div>
        <div onClick={() => handleSelection("Birds")}>Birds</div>
        <div onClick={() => handleSelection("Food")}>Food</div>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="images">
            {images.map((image) => (
              <div
                key={image.id}
                className="image-container"
                onMouseEnter={() => setHoveredImage(image)}
                onMouseLeave={() => setHoveredImage(null)}>
                <img
                  src={image.urls.small}
                  alt={image.alt_description}
                  className="image"
                />
                {hoveredImage && hoveredImage.id === image.id && (
                  <div className="overlay">
                    <div className="overlay-text">
                      <p>Width: {image.width}</p>
                      <p>Height: {image.height}</p>
                      <p>
                        Created at:{" "}
                        {new Date(image.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="buttons">
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            {page < totalPages && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
