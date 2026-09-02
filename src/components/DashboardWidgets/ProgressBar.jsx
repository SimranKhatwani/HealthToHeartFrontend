const ProgressBar = ({ value, color }) => {
    return (
      <div className="w-full bg-teal-500 rounded h-2">
        <div
          className={`h-2 rounded bg-teal-600`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    );
  };
  
  export default ProgressBar;
  