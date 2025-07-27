function App() {
  return (
    <div>
      <img src="test.jpg" alt="A decorative element" />
      <label htmlFor="name-input">
        Enter your name:
        <input type="text" id="name-input" />
      </label>
      <button type="button" onClick={() => console.log('clicked')}>
        Click me
      </button>
      <a href="https://example.com">Visit our website</a>
    </div>
  );
}

export default App;
