import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMiniMenu from '../components/SideMiniMenu';
import { notesAPI, authAPI } from '../services/api';

const COLORS = [
  { name: 'Cream', value: 'customyellow', bg: 'bg-[#E8D4A2]', border: 'border-[#E8D4A2]' },
  { name: 'Rose', value: 'customred', bg: 'bg-[#D4A5A5]', border: 'border-[#D4A5A5]' },
  { name: 'Sage', value: 'customgreen', bg: 'bg-[#B8D4C8]', border: 'border-[#B8D4C8]' },
  { name: 'Sky', value: 'customblue', bg: 'bg-[#A8C5DA]', border: 'border-[#A8C5DA]' },
  { name: 'Lavender', value: 'custompurple', bg: 'bg-[#C8B8D4]', border: 'border-[#C8B8D4]' },
];

const STATUSES = [
  { value: 'note', label: 'Note', icon: 'far fa-sticky-note' },
  { value: 'todo:inprogress', label: 'In Progress', icon: 'fas fa-spinner' },
  { value: 'todo:done', label: 'Done', icon: 'fas fa-check-circle' },
  { value: 'todo:nostatus', label: 'No Status', icon: 'far fa-circle' },
];

function CreateNotePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('customyellow');
  const [status, setStatus] = useState('note');
  const [isStarred, setIsStarred] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      await notesAPI.create({
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
        status: status,
      });
      
      navigate('/notes');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideMiniMenu />
      <main className="flex-1 px-5 md:px-14 py-10 bg-richblack min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-4">
              <span className="text-customblue">
                <i className="fas fa-plus-circle"></i>
              </span>
              Create Note
            </h1>
            <button
              onClick={() => navigate('/notes')}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 text-red-400 rounded-xl backdrop-blur-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="input-glass w-full rounded-xl px-5 py-3.5 bg-opacity-90 text-white border border-gray-700/50 focus:ring-2 focus:ring-customblue/50 outline-none font-medium transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content..."
                rows="8"
                className="input-glass w-full rounded-xl px-5 py-3.5 bg-opacity-90 text-white border border-gray-700/50 focus:ring-2 focus:ring-customblue/50 outline-none font-medium transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Color Theme
                </label>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`group relative w-14 h-14 rounded-xl ${color.bg} transition-all transform hover:scale-110 ${
                        selectedColor === color.value 
                          ? 'ring-3 ring-white ring-offset-2 ring-offset-richblack shadow-xl scale-105' 
                          : 'hover:shadow-lg'
                      }`}
                      aria-label={color.name}
                    >
                      {selectedColor === color.value && (
                        <i className="fas fa-check text-gray-700 text-lg"></i>
                      )}
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((stat) => (
                    <button
                      key={stat.value}
                      type="button"
                      onClick={() => setStatus(stat.value)}
                      className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium ${
                        status === stat.value
                          ? 'bg-customblue text-white shadow-lg scale-105'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:shadow-md'
                      }`}
                    >
                      <i className={stat.icon}></i>
                      <span>{stat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-700/50">
              <button
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium ${
                  isStarred
                    ? 'bg-yellow-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:shadow-md'
                }`}
              >
                <i className={`fas fa-star ${isStarred ? 'text-yellow-300' : ''}`}></i>
                <span>{isStarred ? 'Starred' : 'Star Note'}</span>
              </button>

              <button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="px-8 py-3.5 rounded-xl bg-customblue text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 focus:ring-2 focus:ring-customblue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    <span>Create Note</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateNotePage;
