import bg from '../../assests/bg.png';
import './Home.css';
import ProductSearchBar from '../ProductSearchBar/ProductSearchBar';

const Home = () => {

  return (
    <div className='home-conatiner'>
      <header className="home">
        <div className="main-title">
          Welcome to Crafted Comfort
        </div>
        <div className="desc">
        Discover the art of elegant living with Crafted Comfort. <br />
        Explore our collection of thoughtfully designed home accessories that bring style, comfort, and personality to any space. <br />
        Our collection blends modern design with timeless elegance, bringing warmth and personality to your home.
        </div>
        <div className="know-button-container">
          <button className="know-button">Know More</button>
        </div>
        <div className="bg-container">
          <img src={bg} alt="Urban Rental Background" className="background-image" />
        </div>
        <ProductSearchBar />
      </header>
    </div>
  );
};

export default Home;
