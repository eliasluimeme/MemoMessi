import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export default function LanguageSelector() {
  const defaultLanguage = 'en';
  const flags = {
    en: '🇬🇧',
    fr: '🇫🇷',
    ar: '🇸🇦',
  };

  return (
    <Select defaultValue={defaultLanguage}>
      <SelectTrigger className="flex h-9 w-9 items-center justify-center rounded-md border-none bg-transparent p-0 hover:bg-accent hover:text-accent-foreground dark:bg-transparent dark:shadow-none [&>svg:last-child]:hidden">
        <span>{flags[defaultLanguage as keyof typeof flags]}</span>
      </SelectTrigger>
      <SelectContent className="bg-background">
        <SelectGroup>
          <SelectItem value="en" className="flex items-center">
            <span>🇬🇧</span>
            <span className="ml-2">English</span>
          </SelectItem>
          <SelectItem value="fr" disabled className="flex items-center">
            <span>🇫🇷</span>
            <span className="ml-2">
              French <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
            </span>
          </SelectItem>
          <SelectItem value="ar" disabled className="flex items-center">
            <span>🇸🇦</span>
            <span className="ml-2">
              Arabic <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
