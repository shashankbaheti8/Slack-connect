const Landing = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Slack Connect</h1>
      <a href={`${import.meta.env.VITE_BASE_URL}/api/auth/slack`}>
        <button className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700">
          Connect to Slack
        </button>
      </a>
    </div>
  );
};

export default Landing;
