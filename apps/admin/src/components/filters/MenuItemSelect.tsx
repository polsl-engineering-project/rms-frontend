import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@repo/ui';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../../api/client';

interface MenuItemSelectProps {
  value?: string;
  onChange: (value?: string) => void;
}

export function MenuItemSelect({ value, onChange }: MenuItemSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data: items } = useQuery({
    queryKey: ['menu-items', 'all'],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/item', {
        params: {
          query: {
            page: 0,
            size: 100, // Fetch enough items
          },
        },
      });

      if (error) {
        throw new Error('Failed to fetch menu items');
      }

      return data.content || [];
    },
  });

  const selectedItem = items?.find((item) => item.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedItem ? selectedItem.name : 'Select item...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items?.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChange(item.id === value ? undefined : item.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === item.id ? 'opacity-100' : 'opacity-0')}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
