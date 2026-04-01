function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="state-card spinner-card">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export default LoadingSpinner;
