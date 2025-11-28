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

interface UserIdSelectProps {
  value?: string;
  onChange: (value?: string) => void;
}

export function UserIdSelect({ value, onChange }: UserIdSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data: users } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/users', {
        params: {
          query: {
            page: 0,
            size: 100, // Fetch enough users for the dropdown
          },
        },
      });

      if (error) {
        throw new Error('Failed to fetch users');
      }

      return data.content || [];
    },
  });

  const selectedUser = users?.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Select user...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.firstName} ${user.lastName}`}
                  onSelect={() => {
                    onChange(user.id === value ? undefined : user.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === user.id ? 'opacity-100' : 'opacity-0')}
                  />
                  {user.firstName} {user.lastName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
