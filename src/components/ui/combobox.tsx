import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ComboboxProps {
  options: { value: string; label: string }[];
  placeholder: string;
  onSearch: (search: string) => void;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

export function Combobox({ options, placeholder, onSearch, value, onChange, disabled = false }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <Popover open={open && !disabled} onOpenChange={(isOpen) => !disabled && setOpen(isOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-11"
          disabled={disabled} // Disable the button
        >
          {value ? options.find((option) => option.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <Input
          placeholder="Cari..."
          value={search}
          onChange={(e) => {
            const newSearch = e.target.value;
            setSearch(newSearch);
            onSearch(newSearch);
          }}
          className="mb-2"
          disabled={disabled} // Disable the search input
        />
        <div className="max-h-[200px] overflow-y-auto">
          {filteredOptions.length === 0 && (
            <div className="p-2 text-sm text-muted-foreground">Tidak ada hasil ditemukan.</div>
          )}
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center p-2 hover:bg-muted cursor-pointer"
              onClick={() => {
                if (!disabled) {
                  onChange(option.value === value ? undefined : option.value);
                  setOpen(false);
                }
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  value === option.value ? 'opacity-100' : 'opacity-0'
                )}
              />
              {option.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}