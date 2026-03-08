import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="py-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            自動化資訊追蹤中心
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            最後更新時間: {data?.lastUpdate ? new Date(data.lastUpdate).toLocaleString('zh-TW') : '無資料'}
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📈</span> 投資功課 (Yahoo 財經台股)
            </h2>
          </div>
          
          <ul className="divide-y divide-gray-100">
            {data?.news?.length > 0 ? (
              data.news.map((item, index) => (
                <li key={index} className="p-6 hover:bg-blue-50/30 transition-colors duration-200">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(item.pubDate).toLocaleString('zh-TW')}
                    </p>
                  </a>
                </li>
              ))
            ) : (
              <li className="p-8 text-center text-gray-500">
                目前沒有追蹤到任何資料
              </li>
            )}
          </ul>
        </main>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-400">
        Powered by React + GitHub Actions & Serverless
      </footer>
    </div>
  );
}

export default App;
