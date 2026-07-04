import React from 'react';
import { SortType } from '../../types';
import './FilterBar.scss';

interface FilterBarProps {
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  isVisible: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ sortType, onSortChange, isVisible }) => {
  const filters: { key: SortType; label: string }[] = [
    { key: 'recommend', label: '推荐排序' },
    { key: 'time', label: '时间' },
    { key: 'price', label: '价格' },
  ];

  return (
    <div className={`filter-bar ${isVisible ? 'visible' : ''}`}>
      {filters.map((filter) => (
        <button
          key={filter.key}
          className={`filter-btn ${sortType === filter.key ? 'active' : ''}`}
          onClick={() => onSortChange(filter.key)}
        >
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
