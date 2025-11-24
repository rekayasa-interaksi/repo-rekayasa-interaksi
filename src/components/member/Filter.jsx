import React, { useMemo } from 'react';
import { Dropdown } from '../ui/Dropdown';

const FilterDropdown = ({
  label,
  data = [],
  dataKey = 'id',
  dataLabel = 'name',
  value,
  onChange,
  isLoading = false,
  error = null,
  placeholder = 'Pilih salah satu...'
}) => {
  const options = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      value: item[dataKey],
      label: item[dataLabel],

      disabled: item.active !== undefined ? !item.active : false
    }));
  }, [data, dataKey, dataLabel]);

  return (
    <Dropdown
      label={label}
      options={options}
      value={value}
      onValueChange={onChange}
      placeholder={isLoading ? 'Memuat...' : placeholder}
      disabled={isLoading}
      error={error ? `Gagal memuat ${label.toLowerCase()}` : null}
    />
  );
};

export default FilterDropdown;
