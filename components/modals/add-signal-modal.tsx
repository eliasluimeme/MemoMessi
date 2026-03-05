'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
  RocketIcon,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
  Zap
} from 'lucide-react';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast-context';
import { GECKO_NETWORK, isSolanaNetwork } from '@/lib/utils/chain-utils';

interface FormData {
  contractAddress: string;
  network: string;
  pair: string;
  action: string;
  entryZone: string;
  stopLoss: string;
  takeProfit: { price: string; gain: number }[];
  note: string;
}

interface FormErrors {
  contractAddress?: string;
  pair?: string;
  entryZone?: string;
  stopLoss?: string;
  takeProfit?: string[];
  error?: string;
}

const formDataSchema = z.object({
  pair: z.string().min(1, 'Trading pair is required'),
  action: z.string(),
  entryZone: z.number().min(0, 'Entry price is required'),
  stopLoss: z
    .number()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      return val > 0;
    }, 'Stop loss must be greater than 0'),
  takeProfit: z
    .array(z.object({ price: z.number(), gain: z.number() }))
    .min(1, 'At least one target is required')
    .refine((targets) => {
      return targets.every((t) => t.price > 0);
    }, 'All targets must be greater than 0'),
  note: z.string().optional(),
  contractAddress: z.string().optional(),
  network: z.string().optional(),
});

const initialFormState: FormData = {
  contractAddress: '',
  network: 'solana',
  pair: '',
  action: 'BUY',
  entryZone: '',
  stopLoss: '',
  takeProfit: [{ price: '', gain: 0 }],
  note: '',
};

const calculatePotentialGains = (targetPrice: number, entryPrice: number): number => {
  if (!entryPrice || !targetPrice) return 0;
  return ((targetPrice - entryPrice) / entryPrice) * 100;
};

export default function AddSignalModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Magic Input States
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [rugCheckScore, setRugCheckScore] = useState<any>(null);

  const { toast } = useToast();

  const resetForm = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setSubmitError(null);
    setTokenInfo(null);
    setRugCheckScore(null);
  };

  const recalculateAllGains = (entryPrice: number, takeProfits: typeof formData.takeProfit) => {
    return takeProfits.map((target) => ({
      price: target.price,
      gain: Number(calculatePotentialGains(Number(target.price), entryPrice).toFixed(2)),
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newState = {
        ...prev,
        [field]: field === 'stopLoss' && !value ? '' : value,
      };

      // Recalculate gains when entry price changes
      if (field === 'entryZone' && value && !isNaN(Number(value))) {
        newState.takeProfit = recalculateAllGains(Number(value), prev.takeProfit);
      }

      return newState;
    });

    if (formErrors[field as keyof FormErrors])
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleTakeProfitChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedTakeProfits = [...prev.takeProfit];
      updatedTakeProfits[index] = {
        price: value,
        gain: Number(calculatePotentialGains(Number(value), Number(prev.entryZone)).toFixed(2)),
      };
      return { ...prev, takeProfit: updatedTakeProfits };
    });

    if (formErrors.takeProfit) {
      setFormErrors((prev) => ({ ...prev, takeProfit: undefined }));
    }
  };

  const addTakeProfit = () => {
    if (formData.takeProfit.length < 8) {
      setFormData((prev) => ({
        ...prev,
        takeProfit: [...prev.takeProfit, { price: '', gain: 0 }],
      }));
    }
  };

  const removeTakeProfit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      takeProfit: prev.takeProfit.filter((_, i) => i !== index),
    }));
  };

  const fetchGeckoToken = async () => {
    if (!formData.contractAddress) {
      setFormErrors((prev) => ({ ...prev, contractAddress: 'CA is required for magic input' }));
      return;
    }

    setIsFetchingToken(true);
    setSubmitError(null);
    setTokenInfo(null);
    setRugCheckScore(null);

    try {
      // 1. Fetch token data from GeckoTerminal (use normalized network slug)
      const geckoNetwork = GECKO_NETWORK[formData.network] ?? formData.network;
      const geckoRes = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/${geckoNetwork}/tokens/${formData.contractAddress}`
      );
      const data = await geckoRes.json();

      if (!data?.data?.attributes) {
        throw new Error('Token not found on GeckoTerminal');
      }

      const attrs = data.data.attributes;
      const price = Number(attrs.price_usd);
      const symbol = attrs.symbol.toUpperCase();

      setTokenInfo({
        name: attrs.name,
        symbol: symbol,
        price: price,
        liquidity: attrs.total_reserve_in_usd,
        volume: attrs.volume_usd?.h24,
      });

      // 2. Pre-fill basic pair and entry data
      setFormData((prev) => {
        const newState = {
          ...prev,
          pair: `${symbol}/USDT`,
          entryZone: price.toString(),
        };
        newState.takeProfit = recalculateAllGains(price, newState.takeProfit);
        return newState;
      });

      // 3. Optional: Fetch RugCheck for Solana
      if (isSolanaNetwork(formData.network)) {
        fetch(`https://api.rugcheck.xyz/v1/tokens/${formData.contractAddress}/report/summary`)
          .then((res) => res.json())
          .then((rug) => {
            // simplified logic
            const isRugged = rug?.rugged || false;
            const risks = rug?.risks?.length || 0;
            setRugCheckScore({ isRugged, risks, score: rug?.score || 0 });
          })
          .catch((err) => console.log('RugCheck fetch failed', err));
      }

      toast({
        title: 'Token Found! 🚀',
        description: `Loaded ${attrs.name} at $${price.toFixed(6)}`,
      });

    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to fetch token data');
    } finally {
      setIsFetchingToken(false);
    }
  };

  const applySmartZones = () => {
    if (!formData.entryZone || isNaN(Number(formData.entryZone))) {
      toast({ title: 'Error', description: 'Need a valid Entry Price first.', variant: 'destructive' });
      return;
    }

    const entry = Number(formData.entryZone);
    // +2% Entry Adjustment? Or just +5% TP1, +10% TP2, -10% SL
    const tp1 = entry * 1.05;
    const tp2 = entry * 1.10;
    const tp3 = entry * 1.20;
    const sl = entry * 0.90;

    setFormData((prev) => ({
      ...prev,
      stopLoss: sl.toFixed(8).replace(/\.?0+$/, ''),
      takeProfit: [
        { price: tp1.toFixed(8).replace(/\.?0+$/, ''), gain: calculatePotentialGains(tp1, entry) },
        { price: tp2.toFixed(8).replace(/\.?0+$/, ''), gain: calculatePotentialGains(tp2, entry) },
        { price: tp3.toFixed(8).replace(/\.?0+$/, ''), gain: calculatePotentialGains(tp3, entry) },
      ]
    }));

    toast({
      title: 'Smart Zones Applied ⚡',
      description: 'Calculated TP1 (+5%), TP2 (+10%), TP3 (+20%) and SL (-10%)',
    });
  };

  const validateInputs = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.pair.trim()) {
      errors.pair = 'Trading pair is required';
      isValid = false;
    }

    const entryZoneNum = Number(formData.entryZone);
    if (!entryZoneNum || entryZoneNum <= 0) {
      errors.entryZone = 'Valid entry price is required';
      isValid = false;
    }

    const stopLossNum = Number(formData.stopLoss);
    if (formData.stopLoss && (isNaN(stopLossNum) || stopLossNum <= 0)) {
      errors.stopLoss = 'Stop loss must be a valid number greater than 0';
      isValid = false;
    }

    const validTargets = formData.takeProfit.filter((t) => Number(t.price) > 0);
    if (validTargets.length === 0) {
      errors.takeProfit = ['At least one valid target is required'];
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!validateInputs()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const validTargets = formData.takeProfit
        .filter((t) => Number(t.price) > 0)
        .map((t) => ({
          price: Number(t.price),
          gain: t.gain,
        }));
      const formDataValidated = formDataSchema.parse({
        pair: (formData.pair.endsWith('/USDT')
          ? formData.pair.slice(0, -5)
          : formData.pair
        ).toUpperCase() + '/USDT', // Normalize to SYMBOL/USDT
        action: formData.action,
        entryZone: Number(formData.entryZone),
        stopLoss: formData.stopLoss ? Number(formData.stopLoss) : null,
        takeProfit: validTargets,
        note: formData.note,
        contractAddress: formData.contractAddress,
        network: formData.network,
      });

      const response = await fetch('/api/postsignals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataValidated),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create signal');

      toast({
        title: 'Success',
        description: 'Signal posted successfully!',
      });
      resetForm();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error({ error });
      setSubmitError(error instanceof Error ? error.message : 'Failed to post signal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0 border dark:border-white/[0.08] border-border/60 dark:bg-[#0a0a0a] bg-background rounded-2xl shadow-2xl">

        {/* Header */}
        <DialogHeader className="border-b dark:border-white/[0.06] border-border/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl dark:bg-primary/10 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RocketIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">Add Signal</DialogTitle>
              <DialogDescription className="text-xs dark:text-muted-foreground/50 text-muted-foreground/70 mt-0.5 font-light">
                Use Magic Input to fetch token details or enter manually.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-5.5rem)] overflow-y-auto scrollbar-hide">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">

            {/* Magic Input Section */}
            <div className="rounded-xl border dark:border-blue-500/20 border-blue-500/30 dark:bg-blue-500/[0.04] bg-blue-500/[0.03] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500">Magic Input</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-none">
                  <Select
                    value={formData.network}
                    onValueChange={(value) => handleInputChange('network', value)}
                  >
                    <SelectTrigger className="w-[110px] h-10 rounded-lg dark:border-white/[0.08] border-border/60 dark:bg-white/[0.03] bg-background text-sm">
                      <SelectValue placeholder="Network" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:border-white/[0.08] border-border/60">
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="eth">Ethereum</SelectItem>
                      <SelectItem value="bsc">BSC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Paste Contract Address (CA)"
                    className="font-mono h-10 rounded-lg dark:border-white/[0.08] border-border/60 dark:bg-white/[0.03] bg-background text-sm pr-20"
                    value={formData.contractAddress}
                    onChange={(e) => handleInputChange('contractAddress', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), fetchGeckoToken())}
                    error={formErrors.contractAddress}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 rounded-md dark:bg-blue-500/10 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[11px] font-bold"
                    onClick={fetchGeckoToken}
                    disabled={isFetchingToken || !formData.contractAddress}
                  >
                    {isFetchingToken ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Search className="h-3 w-3 mr-1" />Fetch</>}
                  </Button>
                </div>
              </div>

              {/* Token Info Preview */}
              {tokenInfo && (
                <div className="mt-3 rounded-lg dark:bg-white/[0.03] bg-muted/40 border dark:border-white/[0.06] border-border/40 p-3">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest dark:text-white/30 text-muted-foreground/60 mb-0.5">Token</p>
                      <p className="text-sm font-semibold text-foreground">{tokenInfo.name} <span className="dark:text-white/40 text-muted-foreground/60 font-normal">({tokenInfo.symbol})</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest dark:text-white/30 text-muted-foreground/60 mb-0.5">Price</p>
                      <p className="text-sm font-mono font-semibold text-foreground">${tokenInfo.price.toFixed(8).replace(/\.?0+$/, '')}</p>
                    </div>
                    {tokenInfo.liquidity && (
                      <div>
                        <p className="text-[9px] uppercase tracking-widest dark:text-white/30 text-muted-foreground/60 mb-0.5">Liquidity</p>
                        <p className="text-sm font-semibold text-foreground">${Number(tokenInfo.liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                    )}
                    {rugCheckScore && (
                      <div className="ml-auto">
                        <Badge variant={rugCheckScore.risks > 2 || rugCheckScore.isRugged ? 'destructive' : 'success'} className="flex items-center gap-1 text-[10px] rounded-full px-2.5 py-1">
                          {rugCheckScore.risks > 2 || rugCheckScore.isRugged ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                          {rugCheckScore.risks > 2 ? `High Risk (${rugCheckScore.risks})` : 'Safe'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Trading Pair + Action */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-white/40 text-muted-foreground/70">Trading Pair</p>
                <Input
                  placeholder="e.g., SOL/USDT"
                  value={formData.pair}
                  onChange={(e) => handleInputChange('pair', e.target.value)}
                  error={formErrors.pair}
                  className="h-10 rounded-lg dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-white/40 text-muted-foreground/70">Direction</p>
                <Select
                  value={formData.action.toLowerCase()}
                  onValueChange={(value: string) => handleInputChange('action', value.toUpperCase())}
                >
                  <SelectTrigger className="h-10 rounded-lg dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl dark:border-white/[0.08] border-border/60">
                    <SelectItem value="buy">
                      <span className="flex items-center gap-2 text-emerald-500 font-semibold">Long / Buy</span>
                    </SelectItem>
                    <SelectItem value="sell">
                      <span className="flex items-center gap-2 text-rose-500 font-semibold">Short / Sell</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Entry + Stop Loss */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-white/40 text-muted-foreground/70">Entry Price</p>
                  {tokenInfo && (
                    <button type="button" onClick={applySmartZones} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-blue-500 hover:text-blue-400 transition-colors">
                      <Zap className="h-2.5 w-2.5" /> Auto Zones
                    </button>
                  )}
                </div>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.000000"
                  value={formData.entryZone}
                  onChange={(e) => handleInputChange('entryZone', e.target.value)}
                  error={formErrors.entryZone}
                  className="h-10 rounded-lg dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm font-mono"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-white/40 text-muted-foreground/70">Stop Loss <span className="normal-case tracking-normal font-normal dark:text-white/20 text-muted-foreground/50">(optional)</span></p>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.000000"
                  value={formData.stopLoss}
                  onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                  error={formErrors.stopLoss}
                  className="h-10 rounded-lg dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm font-mono"
                />
              </div>
            </div>

            {/* Take Profit Targets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-white/40 text-muted-foreground/70">Take Profit Targets</p>
                  <p className="text-[10px] dark:text-white/20 text-muted-foreground/50 mt-0.5">At least 1 target required</p>
                </div>
                <button
                  type="button"
                  onClick={addTakeProfit}
                  disabled={formData.takeProfit.length >= 8}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg border dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background dark:text-white/40 text-muted-foreground/70 text-[10px] font-bold uppercase tracking-wider hover:dark:border-white/[0.15] hover:border-border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="h-3 w-3" /> Add Target
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {formData.takeProfit.map((profit, index) => (
                  <div key={index} className="relative rounded-xl border dark:border-white/[0.06] border-border/50 dark:bg-white/[0.02] bg-muted/20 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase tracking-widest dark:text-white/25 text-muted-foreground/50">TP {index + 1}</p>
                      {Number(profit.price) > 0 && (
                        <span className={`text-[10px] font-bold tabular-nums ${profit.gain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {profit.gain >= 0 ? '+' : ''}{profit.gain.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        className={`h-9 rounded-lg dark:border-white/[0.06] border-border/50 dark:bg-white/[0.02] bg-background text-sm font-mono ${index > 0 ? 'pr-8' : ''}`}
                        placeholder="Price"
                        value={profit.price}
                        onChange={(e) => handleTakeProfitChange(index, e.target.value)}
                        error={formErrors.takeProfit?.[index]}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-md dark:text-white/20 text-muted-foreground/40 hover:text-rose-500 transition-colors"
                          onClick={() => removeTakeProfit(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-white/40 text-muted-foreground/70">Analysis & Note <span className="normal-case tracking-normal font-normal dark:text-white/20 text-muted-foreground/50">(optional)</span></p>
              <Textarea
                placeholder="Add your technical analysis and important note here..."
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className="min-h-[80px] rounded-xl dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm resize-none"
              />
              {submitError && (
                <div className="flex items-center gap-2 text-[11px] text-rose-500 font-medium mt-1">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                  {submitError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-white/[0.06] border-border/50">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl border dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm dark:text-white/60 text-muted-foreground hover:dark:bg-white/[0.05] hover:bg-muted/50 transition-all disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Posting...</>
                ) : (
                  <><RocketIcon className="h-4 w-4" /> Post Signal</>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
