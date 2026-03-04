import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Badge from '@mui/material/Badge';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { FaSearch, FaUser, FaHeart, FaTimes, FaClock, FaFire } from 'react-icons/fa';
import { logoutUser } from "../redux/apiCall";
import { trackButtonClick, trackUserAction } from '../utils/analytics';

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const wishlist = useSelector((state) => state.wishlist);

  // Logout handler
  const handleLogout = () => {
    logoutUser(dispatch);
    setOpenDropdown(false);
    navigate("/login");
  };

  // Close dropdown/search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        searchRef.current && !searchRef.current.contains(event.target)
      ) {
        setOpenDropdown(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load recent searches
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  const saveToRecentSearches = (query) => {
    const updated = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const searchSuggestions = useMemo(() => [
    { type: 'product', text: 'Vitamin C Serum', category: 'skincare', popularity: 95 },
    { type: 'product', text: 'Hyaluronic Acid Serum', category: 'skincare', popularity: 90 },
    { type: 'product', text: 'Retinol Cream', category: 'skincare', popularity: 88 },
    { type: 'product', text: 'Sunscreen SPF 50', category: 'skincare', popularity: 98 },
    { type: 'product', text: 'Matte Lipstick', category: 'makeup', popularity: 92 },
    { type: 'product', text: 'Foundation', category: 'makeup', popularity: 95 },
    { type: 'routine', text: 'Morning Skincare Routine', category: 'skincare', popularity: 90 },
    { type: 'routine', text: 'Nighttime Routine for Dry Skin', category: 'skincare', popularity: 85 }
  ], []);

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return [];
    const t = search.toLowerCase();
    return searchSuggestions
      .filter(s => s.text.toLowerCase().includes(t) || s.text.toLowerCase().split(' ').some(w => w.startsWith(t)))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8);
  }, [search, searchSuggestions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    saveToRecentSearches(search.trim());
    navigate(`/products/${encodeURIComponent(search.trim())}`);
    trackUserAction("search_query", "search", { query: search });
    setSearch("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (s) => {
    saveToRecentSearches(s.text);
    navigate(`/products/${encodeURIComponent(s.text)}`);
    trackButtonClick("search_suggestion_click", { suggestion: s.text });
    setSearch("");
    setShowSuggestions(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const popularSearches = useMemo(() => 
    searchSuggestions.sort((a, b) => b.popularity - a.popularity).slice(0, 3)
  , [searchSuggestions]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2 bg-white shadow-md' : 'py-4 bg-gradient-to-b from-rose-50 to-white'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between w-full">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-10" onClick={() => trackButtonClick("logo_click")}>
            <img
              src="https://res.cloudinary.com/dkdx7xytz/image/upload/v1772469610/blisslogo1_rwlktl.png"
              alt="Dubois Beauty"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <div className="hidden lg:flex space-x-8 mx-6">
            {['skincare', 'makeup', 'body', 'fragrance'].map(c => (
              <Link key={c} to={`/products/${c}`} className="text-gray-700 hover:text-rose-600 font-medium transition-colors">
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Link>
            ))}
            <Link to="/new" className="text-rose-600 font-medium flex items-center">
              New<span className="ml-1 bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded-full">+</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Find products, routines, or ingredients..."
                className="w-full py-3 px-5 pr-12 rounded-full border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all duration-300 shadow-sm"
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700">
                <FaSearch className="text-xl" />
              </button>
            </form>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-rose-200 rounded-2xl shadow-xl z-[9999] max-h-96 overflow-y-auto">
                
                {/* Recent Searches */}
                {!search.trim() && recentSearches.length > 0 && (
                  <div className="p-3 border-b border-rose-50">
                    <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
                      <div className="flex items-center"><FaClock className="mr-2 text-rose-400" />Recent Searches</div>
                      <button onClick={clearRecentSearches} className="text-xs text-rose-500 hover:text-rose-700">Clear all</button>
                    </div>
                    {recentSearches.map((r, i) => (
                      <div key={i} className="p-2 hover:bg-rose-50 cursor-pointer rounded-lg" onClick={() => navigate(`/products/${encodeURIComponent(r)}`)}>
                        <div className="flex items-center"><FaClock className="mr-3 text-gray-400 text-sm" />{r}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Popular */}
                {!search.trim() && (
                  <div className="p-3 border-b border-rose-50">
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                      <FaFire className="mr-2 text-rose-500" />Popular Now
                    </div>
                    {popularSearches.map((p, i) => (
                      <div key={i} className="p-2 hover:bg-rose-50 cursor-pointer rounded-lg flex justify-between" onClick={() => handleSuggestionClick(p)}>
                        <span>{p.text}</span>
                        <span className="text-xs text-rose-500 bg-rose-50 px-2 py-1 rounded-full">Trending</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Filtered Results */}
                {search.trim() && filteredSuggestions.length > 0 && (
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-600 mb-2">Search Results</div>
                    {filteredSuggestions.map((s, i) => (
                      <div key={i} className="p-3 hover:bg-rose-50 cursor-pointer border-b last:border-b-0" onClick={() => handleSuggestionClick(s)}>
                        <div className="flex justify-between">
                          <span>{s.text}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${s.type === 'routine' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                            {s.type === 'routine' ? 'Routine' : 'Product'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">{s.category}</div>
                      </div>
                    ))}
                  </div>
                )}

                {search.trim() && filteredSuggestions.length === 0 && (
                  <div className="p-4 text-center text-gray-500">No results found for "{search}"</div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-5 md:space-x-6">
            {/* Wishlist */}
            <Link to="/my-wishlist" className="relative group hidden sm:block">
              <div className="p-2 rounded-full group-hover:bg-rose-50 transition-colors">
                <Badge badgeContent={wishlist?.quantity || 0} color="error" overlap="circular">
                  <FaHeart className="text-rose-400 group-hover:text-rose-600" />
                </Badge>
              </div>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full group-hover:bg-rose-50 transition-colors">
                <Badge badgeContent={cart.quantity} color="error" overlap="circular">
                  <ShoppingBasketIcon className="text-rose-500 group-hover:text-rose-700" fontSize="medium" />
                </Badge>
              </div>
            </Link>

            {/* Account */}
            {!user.currentUser ? (
              <Link to="/login" className="relative group">
                <div className="flex items-center space-x-1 p-2 rounded-full group-hover:bg-rose-50 transition-colors">
                  <div className="bg-rose-100 p-2 rounded-full"><FaUser className="text-rose-600 group-hover:text-rose-700" /></div>
                </div>
              </Link>
            ) : (
              <div ref={dropdownRef} className="relative">
                <button onClick={() => setOpenDropdown(prev => !prev)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-rose-50 transition-colors">
                  <div className="bg-rose-100 p-2 rounded-full"><FaUser className="text-rose-600" /></div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">{user.currentUser.name}</span>
                </button>

                {openDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-rose-100 rounded-2xl shadow-xl z-[9999] overflow-hidden">
                    <Link to="/customer-dashboard/profile" className="block px-5 py-3 hover:bg-rose-50 transition-colors" onClick={() => setOpenDropdown(false)}>My Profile</Link>
                    <Link to="/customer-dashboard/myorders" className="block px-5 py-3 hover:bg-rose-50 transition-colors" onClick={() => setOpenDropdown(false)}>My Orders</Link>
                    <Link to="/support-tickets" className="block px-5 py-3 hover:bg-rose-50 transition-colors" onClick={() => setOpenDropdown(false)}>Support Tickets</Link>
                    <div className="border-t border-rose-100"></div>
                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-500 transition-colors">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page Padding */}
      <div className="pt-24"></div>
    </>
  );
};

export default Navbar;