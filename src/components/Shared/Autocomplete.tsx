'use client';

import { useState, useEffect, useRef } from 'react';
import { getDepartments, getLocations } from '@/lib/storage';

interface AutocompleteProps {
  value: string;
  onSelect: (value: string) => void;
  endpoint: 'departments' | 'locations';
  placeholder: string;
  error?: string;
}

export default function Autocomplete({ value, onSelect, endpoint, placeholder, error }: AutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      let data: any[] = [];
      if (endpoint === 'departments') {
        data = await getDepartments(query);
      } else {
        data = await getLocations(query);
      }

      console.log(data)
      setSuggestions(data?.map(item => item.name));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    fetchSuggestions(newValue);
  };

  const handleSelect = (suggestion: string) => {
    setInputValue(suggestion);
    onSelect(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        className={`form-input ${error ? 'error' : ''}`}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      {isOpen && (
        <div className="autocomplete-dropdown">
          {isLoading && (
            <div className="autocomplete-loading">Loading...</div>
          )}
          {!isLoading && suggestions.length === 0 && inputValue && (
            <div className="autocomplete-no-results">No results found</div>
          )}
          {!isLoading && suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="autocomplete-item"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
