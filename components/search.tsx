'use client';

import { useCallback, useEffect, useState } from 'react';

import { Search as SearchIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: string;
  network?: string;
  url?: string;
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = useCallback((url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
    setSearchQuery('');
    setCoins([]);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      if (!searchQuery.trim()) {
        setCoins([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        console.log({ data });
        setCoins(data.assets);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
        setCoins([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchCoins, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const SearchContent = () => (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3 h-5 w-5 shrink-0 opacity-50" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 pl-10 text-base"
          placeholder="Search coins (DexScreener)..."
          autoFocus
        />
      </div>
      {searchQuery && (coins.length > 0 || isLoading) && (
        <div className="mt-2 max-h-[400px] overflow-y-auto rounded-md border p-1 shadow-md bg-card">
          {isLoading ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground animate-pulse">Scanning markets...</div>
          ) : (
            coins.map((coin) => (
              <button
                key={`${coin.symbol}-${coin.network}`}
                onClick={() => handleSelect(coin.url)}
                className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base group-hover:text-primary transition-colors">{coin.symbol}</span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold px-1 py-0">{coin.network}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1">{coin.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono font-medium text-emerald-500">{coin.price}</span>
                  <span className="text-[9px] text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">View Chart</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="relative hidden w-full max-w-[440px] md:block group">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 h-4 w-4 shrink-0 text-muted-foreground/30 group-focus-within:text-primary transition-colors duration-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-9 text-[13px] font-medium rounded-2xl border-white/[0.03] bg-white/[0.02] backdrop-blur-3xl focus:bg-white/[0.04] focus:ring-primary/20 transition-all duration-500 placeholder:text-muted-foreground/20"
            placeholder="Search signals..."
          />
          <div className="absolute right-4 flex items-center gap-1.5 pointer-events-none opacity-20 group-focus-within:opacity-0 transition-opacity">
            <kbd className="px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-tighter">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-tighter">K</kbd>
          </div>
        </div>

        {searchQuery && (coins.length > 0 || isLoading) && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-[28px] border border-white/[0.05] bg-background/80 backdrop-blur-3xl p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 animate-pulse">Syncing Markets</span>
              </div>
            ) : (
              <div className="max-h-[520px] overflow-y-auto scrollbar-hide">
                <div className="px-4 py-2 border-b border-white/[0.03]">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">Market Results</span>
                </div>
                {coins.map((coin) => (
                  <button
                    key={`${coin.symbol}-${coin.network}`}
                    onClick={() => handleSelect(coin.url)}
                    className="flex w-full items-center justify-between px-4 py-4 text-sm outline-none hover:bg-white/[0.03] rounded-2xl transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:border-primary/20 transition-colors">
                        <span className="text-xs font-black text-foreground/40 group-hover:text-primary transition-colors">{coin.symbol.slice(0, 1)}</span>
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[15px] tracking-tighter group-hover:text-primary transition-colors">{coin.symbol}</span>
                          <span className="px-1.5 py-0.5 rounded-[4px] bg-white/[0.03] text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 border border-white/[0.05]">{coin.network}</span>
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-tight truncate w-[180px]">{coin.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-[13px] font-black text-emerald-500">{coin.price}</span>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        <span className="text-[9px] text-primary font-black uppercase tracking-widest leading-none">Terminal View</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
          onClick={() => setIsModalOpen(true)}
        >
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="p-4 sm:max-w-[425px] bg-background/80 backdrop-blur-3xl border-white/[0.05] rounded-[32px]">
            <SearchContent />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
