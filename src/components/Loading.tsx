import "./Loading.css";

const Loading = () => {
  return (
    <div id="overlay-loader">
      <div id="container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>

        <div id="loading-text">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;