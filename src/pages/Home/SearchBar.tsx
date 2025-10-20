import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  // デバウンス処理（500ms）
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, onSearch]);

  return (
    <div className="search-bar">
      <div className="search-bar__icon">
        <FiSearch />
      </div>
      <input
        type="text"
        className="search-bar__input"
        placeholder="メモを検索..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
