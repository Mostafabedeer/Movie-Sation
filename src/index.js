import React from "react";
import ReactDOM from "react-dom/client";
//import StarRating from "./StarRating";
import "./index.css";
import App from "./App";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating color='blue' size={30} onSetRating={setMovieRating} />
//       <p>Movie rating is {movieRating} Stars</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <Test />
    <StarRating maxRating={10} />
    <StarRating
      color='red'
      size={16}
      defualtRating={4}
      messages={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
      className='Test'
    /> */}
  </React.StrictMode>
);
